/**
 * 构建验收辅助脚本（不属于构建产物，供 tasks 验证使用）
 *
 * 用法：node tools/verify-build.mjs
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const rootPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (p) => path.relative(rootPath, p).replace(/\\/g, '/');
const abs = (p) => path.join(rootPath, p);

let failures = 0;
const check = function (label, ok, detail) {
    console.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail === undefined ? '' : '  ' + detail));
    if (!ok) failures++;
};

const walk = function (dir) {
    let out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const child = path.join(dir, entry.name);
        if (entry.isDirectory()) out = out.concat(walk(child));
        else out.push(child);
    }
    return out;
};

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

console.log('== 产物文件集合 vs git 跟踪集合 ==');
const tracked = execSync('git ls-files public/static/dist', { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean).map((s) => s.replace(/\\/g, '/')).sort();
const actual = walk(abs('public/static/dist')).map(rel).sort();
const missing = tracked.filter((f) => !actual.includes(f));
const extra = actual.filter((f) => !tracked.includes(f));
check('跟踪集合全部重新生成', missing.length === 0, missing.length ? 'missing: ' + missing.join(', ') : '');
check('未产生额外文件', extra.length === 0, extra.length ? 'extra: ' + extra.join(', ') : '');
check('文件总数一致', tracked.length === actual.length, tracked.length + ' vs ' + actual.length);

console.log('== 复制类资源逐字节一致 ==');
// js/lib 与 js/userScript 仅复制顶层（与构建脚本的 glob 一致），fonts 与 img 递归
const copyPairs = [
    ['public/static/src/js/lib', 'public/static/dist/js/lib', /\.js$/, false],
    ['public/static/src/js/userScript', 'public/static/dist/js/userScript', /\.js$/, false],
    ['public/static/src/fonts', 'public/static/dist/fonts', null, true],
    ['public/static/src/img', 'public/static/dist/img', null, true],
];
let copyChecked = 0;
let copyBad = [];
for (const [srcDir, distDir, filter, recursive] of copyPairs) {
    const entries = fs.readdirSync(abs(srcDir), { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const child = path.join(abs(srcDir), entry.name);
        if (entry.isDirectory()) {
            if (recursive) files.push(...walk(child));
        }
        else {
            files.push(child);
        }
    }
    for (const file of files) {
        if (filter && !filter.test(file)) continue;
        const relativePath = path.relative(abs(srcDir), file);
        const target = path.join(abs(distDir), relativePath);
        copyChecked++;
        if (!fs.existsSync(target) || sha256(file) !== sha256(target)) copyBad.push(rel(target));
    }
}
check('复制资源一致', copyBad.length === 0, copyChecked + ' 个文件，异常 ' + copyBad.length + (copyBad.length ? ': ' + copyBad.join(', ') : ''));
check('img-ori 未被复制', !fs.existsSync(abs('public/static/dist/img/img-ori')));

console.log('== 脚本产物 ==');
const minJs = fs.readFileSync(abs('public/static/dist/js/app.min.js'), 'utf8');
const rawJs = fs.readFileSync(abs('public/static/dist/js/app.js'), 'utf8');
check('app.min.js 保留箭头函数（未降级 ES5）', minJs.includes('=>'));
check('app.min.js 引用 sourcemap', /sourceMappingURL=app\.min\.js\.map/.test(minJs));
check('app.js 不含 sourceMappingURL（与现状一致）', !/sourceMappingURL/.test(rawJs));
check('app.min.js 可被解析', (() => { try { new Function(minJs); return true; } catch { return false; } })());
let extraSyntax = [];
for (const [name, re] of [['可选链 ?.', /\?\.[A-Za-z_$[(]/], ['空值合并 ??', /\?\?/], ['BigInt 字面量', /\b\d+n\b/]]) {
    if (re.test(minJs)) extraSyntax.push(name);
}
check('app.min.js 不含 ES2020+ 语法', extraSyntax.length === 0, extraSyntax.join(', '));
check('app.min.js 含 ES2019 可选 catch 绑定（= 声明的门槛上限）', /catch\s*\{/.test(minJs));
check('sourcemap sources 为相对路径（无本机绝对路径）',
    (() => {
        const map = JSON.parse(fs.readFileSync(abs('public/static/dist/js/app.min.js.map'), 'utf8'));
        return map.sources.every((s) => !path.isAbsolute(s) && !/^[A-Za-z]:/.test(s));
    })());

console.log('== 样式产物 ==');
const minCss = fs.readFileSync(abs('public/static/dist/css/app.min.css'), 'utf8');
const expandedCss = fs.readFileSync(abs('public/static/src/css/app.css'), 'utf8');
const countPrefix = (s) => (s.match(/-webkit-/g) || []).length;
check('app.min.css 引用 sourcemap', /sourceMappingURL=app\.min\.css\.map/.test(minCss));
check('前缀已补齐（多于展开产物）', countPrefix(minCss) > countPrefix(expandedCss),
    'min=' + countPrefix(minCss) + ' expanded=' + countPrefix(expandedCss));
check('font-awesome.min.css 存在且非空', fs.statSync(abs('public/static/dist/css/font-awesome.min.css')).size > 0);
check('src/css 展开产物已生成', fs.statSync(abs('public/static/src/css/app.css')).size > 0
    && fs.statSync(abs('public/static/src/css/font-awesome.css')).size > 0);
check('src/css 展开产物不含 sourceMappingURL', !/sourceMappingURL/.test(expandedCss));
check('CSS sourcemap sources 为相对路径',
    (() => {
        const map = JSON.parse(fs.readFileSync(abs('public/static/dist/css/app.min.css.map'), 'utf8'));
        return map.sources.every((s) => !path.isAbsolute(s) && !/^[A-Za-z]:/.test(s));
    })());

console.log('== 自定义脚本 ==');
const metaRegex = /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i;
const es6Dir = abs('public/static/src/js/userScript/es6');
const es2019Dir = abs('public/static/src/js/userScript/es2019');
for (const file of fs.readdirSync(es6Dir)) {
    const src = fs.readFileSync(path.join(es6Dir, file), 'utf8');
    const outPath = path.join(es2019Dir, file);
    if (!fs.existsSync(outPath)) { check(file + ' 已转译', false, 'missing'); continue; }
    const out = fs.readFileSync(outPath, 'utf8');
    // 源文件为 CRLF，运行时正则无法解析（这正是构建要修正的问题），
    // 故比较前先归一化源文件换行，取出「预期元信息」。
    const srcMeta = metaRegex.exec(src.replace(/\r\n/g, '\n'));
    const outMeta = metaRegex.exec(out);
    const nameOf = (m) => (m ? (/@name[ \t]+(.*)/i.exec(m[1]) || [])[1] : undefined);
    const trigOf = (m) => (m ? (/@trigger[ \t]+(.*)/i.exec(m[1]) || [])[1] : undefined);
    check(file + ' 元信息块可被运行时正则解析', !!outMeta);
    check(file + ' @name 与源一致', nameOf(srcMeta) === nameOf(outMeta),
        JSON.stringify(nameOf(outMeta)));
    check(file + ' @trigger 与源一致', trigOf(srcMeta) === trigOf(outMeta),
        JSON.stringify(trigOf(outMeta)));
    check(file + ' 中文未被转义', /[一-龥]/.test(out));
    check(file + ' 可被解析', (() => { try { new Function(out); return true; } catch { return false; } })());
    check(file + ' 保留 ES2015+ 语法', /\bconst\b|\blet\b|=>/.test(out));
    check(file + ' 元信息块为 LF（不含 \\r）', !/\r/.test(out.slice(0, out.indexOf('==/UserScript=='))));
}

// 检出后仍须为 LF：core.autocrlf=true 会在检出时把 LF 转成 CRLF，从而破坏元信息块解析。
// 依赖 .gitattributes 中的 `*.user.js text eol=lf`。
console.log('== 换行契约（防止检出后失效） ==');
const attrFor = function (target) {
    try {
        return execSync('git check-attr text eol -- "' + target + '"', { encoding: 'utf8', cwd: rootPath }).trim();
    }
    catch {
        return '';
    }
};
for (const target of ['public/static/src/js/userScript/es2019/CommonPostText.user.js',
    'public/static/src/js/userScript/KfEmotion.min.user.js']) {
    const attr = attrFor(target);
    check(path.basename(target) + ' 声明为 eol=lf', /eol:\s*lf/.test(attr), attr.replace(/\s+/g, ' '));
}
check('.gitattributes 存在', fs.existsSync(abs('.gitattributes')));

console.log('');
console.log(failures === 0 ? '全部通过' : failures + ' 项未通过');
process.exitCode = failures === 0 ? 0 : 1;
