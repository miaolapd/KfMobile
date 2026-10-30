/**
 * 无头浏览器探测：用本机 Edge（Chromium 内核）渲染页面并读取运行时状态。
 *
 * 用途：验证前端改动在真实浏览器中的效果——计算样式、元素尺寸、图标字形、
 * 库是否加载、控制台错误等。与 tools/verify-*.mjs 的区别是那些脚本只看静态文件，
 * 本脚本执行页面 JS 并反映真实渲染结果。
 *
 * 依赖：仅需本机已安装 Edge（Windows 自带），不引入 npm 包。
 *       通过 DevTools Protocol 直连，无需 puppeteer/playwright。
 *
 * 用法：
 *   node tools/browser-probe.mjs <url> <probe.json> [选项]
 *
 *   probe.json 形如 { "键名": "返回该值的 JS 表达式", ... }
 *   表达式在页面上下文求值，结果以 JSON 输出；另附 __consoleErrors 字段。
 *
 * 选项：
 *   --width=1280    视口宽度（默认 1280；用于核对响应式断点）
 *   --height=900    视口高度
 *   --wait=1500     页面 load 后额外等待毫秒数（等脚本初始化，默认 1500）
 *   --mobile        以移动端视口模拟（默认关闭）
 *
 * 示例（自带广告位提示可省略探针文件，见下方 --preset）：
 *   node tools/browser-probe.mjs http://127.0.0.1:8022/login tools/probes/login.json
 *   node tools/browser-probe.mjs http://127.0.0.1:8022/ tools/probes/generic.json --width=375
 *
 * 注意：
 *   - 需先启动本地服务：php -S 127.0.0.1:8022 -t public
 *   - 本站是反向代理，未登录时受保护页面会重定向到登录页；仅登录页与错误页
 *     （如 /no-such-page）无需论坛账号即可渲染。
 *   - 脚本自动选择空闲调试端口并清理临时 profile，可并发调用。
 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import net from 'node:net';
import path from 'node:path';

/* 本机 Edge 路径（Chromium 内核；如换机器需调整） */
const EDGE_CANDIDATES = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
const probePath = args.filter((a) => !a.startsWith('--'))[1];
const opt = (name, def) => {
    const hit = args.find((a) => a.startsWith('--' + name + '='));
    return hit ? hit.split('=')[1] : def;
};
const width = parseInt(opt('width', '1280'), 10);
const height = parseInt(opt('height', '900'), 10);
const waitMs = parseInt(opt('wait', '1500'), 10);
const mobile = args.includes('--mobile');

if (!url || !probePath) {
    console.error('用法：node tools/browser-probe.mjs <url> <probe.json> [--width=1280] [--height=900] [--wait=1500] [--mobile]');
    process.exit(2);
}

const edgePath = EDGE_CANDIDATES.find((p) => fs.existsSync(p));
if (!edgePath) {
    console.error('未找到 Edge，请修改本脚本顶部的 EDGE_CANDIDATES');
    process.exit(2);
}

/** 取一个空闲端口，避免并发/残留进程冲突 */
const freePort = () => new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
        const p = srv.address().port;
        srv.close(() => resolve(p));
    });
});

const httpReq = (u, method = 'GET') => new Promise((resolve, reject) => {
    const req = http.request(u, { method }, (res) => {
        let d = '';
        res.on('data', (c) => d += c);
        res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.end();
});

const waitFor = async (fn, ms, label) => {
    const t0 = Date.now();
    let lastErr;
    while (Date.now() - t0 < ms) {
        try {
            const r = await fn();
            if (r) return r;
        }
        catch (ex) { lastErr = ex; }
        await new Promise((r) => setTimeout(r, 250));
    }
    throw new Error('超时等待 ' + label + (lastErr ? '（最后错误：' + lastErr.message + '）' : ''));
};

const run = async () => {
    const port = await freePort();
    const profile = path.join(os.tmpdir(), 'kfm-probe-profile-' + port);
    const probe = JSON.parse(fs.readFileSync(probePath, 'utf8'));

    const edge = spawn(edgePath, [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-extensions',
        '--remote-debugging-port=' + port,
        '--user-data-dir=' + profile,
        '--window-size=' + width + ',' + height,
        'about:blank',
    ], { stdio: 'ignore' });

    let ws;
    try {
        await waitFor(async () => {
            const r = await httpReq('http://127.0.0.1:' + port + '/json/version');
            return r.status === 200 && r.body.includes('webSocketDebuggerUrl');
        }, 30000, 'Edge 调试端口');

        // 注意：新版 Chromium 要求 /json/new 用 PUT
        const tabRes = await httpReq('http://127.0.0.1:' + port + '/json/new?about:blank', 'PUT');
        const tab = JSON.parse(tabRes.body);

        ws = new WebSocket(tab.webSocketDebuggerUrl);
        let id = 0;
        const pending = new Map();
        const logs = [];
        ws.addEventListener('message', (ev) => {
            const m = JSON.parse(ev.data);
            if (m.id && pending.has(m.id)) {
                const { resolve, reject } = pending.get(m.id);
                pending.delete(m.id);
                m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
            }
            else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
                logs.push(m.params.entry.text);
            }
        });
        await new Promise((resolve, reject) => {
            ws.addEventListener('open', resolve);
            ws.addEventListener('error', reject);
        });

        const send = (method, params = {}) => new Promise((resolve, reject) => {
            const mid = ++id;
            pending.set(mid, { resolve, reject });
            ws.send(JSON.stringify({ id: mid, method, params }));
        });

        await send('Runtime.enable');
        await send('Page.enable');
        await send('Log.enable').catch(() => {});
        // 始终用设备指标覆盖视口：仅靠 --window-size 在 headless 下不可靠
        // （实测请求 375 会得到 492），故显式设置。
        await send('Emulation.setDeviceMetricsOverride', {
            width, height, deviceScaleFactor: 1, mobile,
        });
        await send('Page.navigate', { url });
        await waitFor(async () => {
            const r = await send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
            return r.result.value === 'complete';
        }, 30000, '页面加载');
        // 等页面脚本初始化（app.js 在 DOMContentLoaded 后执行）
        await new Promise((r) => setTimeout(r, waitMs));

        const out = {};
        for (const [key, expr] of Object.entries(probe)) {
            const r = await send('Runtime.evaluate', {
                expression: expr, returnByValue: true, awaitPromise: true,
            });
            out[key] = r.exceptionDetails
                ? {__error: r.exceptionDetails.exception?.description || '求值失败'}
                : r.result.value;
        }
        out.__consoleErrors = logs;
        console.log(JSON.stringify(out, null, 2));
    }
    finally {
        try { ws && ws.close(); } catch {}
        edge.kill();
        await new Promise((r) => setTimeout(r, 400));
        fs.rmSync(profile, { recursive: true, force: true });
    }
};

run().catch(function (ex) {
    console.error(ex.message || ex);
    process.exitCode = 1;
});
