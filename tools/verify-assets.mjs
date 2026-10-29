/**
 * 静态资源引用检查：抓取页面 HTML，提取其中的本地静态资源 URL 并逐个请求，
 * 确认无 404。供 tasks 5.1 验收使用。
 *
 * 用法：node tools/verify-assets.mjs [baseUrl]
 */
const baseUrl = process.argv[2] || 'http://127.0.0.1:8022';

const paths = ['/', '/login', '/index/index', '/bank/index', '/read/1', '/post/1', '/rank', '/faq/1'];

/** 从 HTML 中提取本站静态资源 URL */
const extractAssets = function (html) {
    const urls = new Set();
    const patterns = [
        /(?:src|href)\s*=\s*["']([^"']+)["']/gi,
    ];
    for (const re of patterns) {
        for (const m of html.matchAll(re)) {
            const url = m[1].trim();
            if (!/\.(?:css|js|png|jpe?g|gif|svg|woff2?|ttf|eot|otf|ico)(?:\?|#|$)/i.test(url)) continue;
            if (/^(?:https?:)?\/\//i.test(url)) {
                // 仅检查指向本机的绝对地址
                if (!url.includes('127.0.0.1') && !url.includes('localhost')) continue;
            }
            urls.add(url);
        }
    }
    return [...urls];
};

const resolve = function (url) {
    if (/^(?:https?:)?\/\//i.test(url)) return url;
    if (url.startsWith('/')) return baseUrl + url;
    return baseUrl + '/' + url;
};

let failures = 0;
const seen = new Map();

for (const page of paths) {
    const res = await fetch(baseUrl + '/index.php?s=' + encodeURIComponent(page));
    if (!res.ok) {
        console.log('  FAIL  ' + page + ' 页面状态 ' + res.status);
        failures++;
        continue;
    }
    const html = await res.text();
    const assets = extractAssets(html);
    const bad = [];
    for (const asset of assets) {
        const target = resolve(asset);
        if (!seen.has(target)) {
            try {
                const head = await fetch(target, { method: 'GET' });
                seen.set(target, head.status);
            }
            catch (ex) {
                seen.set(target, 'ERR ' + ex.message);
            }
        }
        const status = seen.get(target);
        if (status !== 200) bad.push(asset + ' -> ' + status);
    }
    console.log((bad.length === 0 ? '  PASS  ' : '  FAIL  ') + page
        + '  资源 ' + assets.length + ' 个' + (bad.length ? '  异常: ' + bad.join(', ') : ''));
    if (bad.length) failures++;
}

console.log('');
console.log('共检查 ' + seen.size + ' 个唯一资源 URL');
for (const [url, status] of seen) {
    if (status !== 200) console.log('  非 200: ' + url + ' -> ' + status);
}
console.log(failures === 0 ? '全部通过' : failures + ' 项未通过');
process.exitCode = failures === 0 ? 0 : 1;
