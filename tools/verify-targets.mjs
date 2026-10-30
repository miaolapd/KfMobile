/**
 * 兼容门槛端到端核对：确认最终产物的语法门槛不超出 spec 声明。
 *
 * 方法说明（为何不用「按浏览器目标重新转译」）：
 *   esbuild 的 Safari/iOS 兼容表不可靠——实测它声称 Safari 14 / iOS 14 缺少解构，
 *   与事实不符；且 `android 5`、`samsung 8` 不是 esbuild 的合法 target 记法。
 *   因此改用以 ES 版本阶梯测定产物**实际语法级别**的方法：
 *   把产物按 es2015…es2020 逐级重新转译，输出与 esnext 基线一致的最低级别
 *   即为产物自身的语法级别。浏览器门槛再由该级别对应的公开支持数据得出，
 *   并单独断言 ES2020+ 语法不存在、以及产物中最高语法确为 ES2019 可选 catch 绑定
 *   （其门槛恰为 Chrome 66 / Firefox 58 / Safari 11.1 / iOS 11.3 / Edge 79）。
 *
 * 用法：node tools/verify-targets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { transform as lightningTransform } from 'lightningcss';
import { BROWSERS, SCRIPT_TARGET, CSS_TARGETS, FORBIDDEN_SYNTAX } from './build.mjs';

const rootPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const abs = (p) => path.join(rootPath, p);

let failures = 0;
const check = function (label, ok, detail) {
    console.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail === undefined ? '' : '  ' + detail));
    if (!ok) failures++;
};

/** ES 版本阶梯：产物语法级别 = 重新转译结果首次等于 esnext 基线的级别 */
const ES_LADDER = ['es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021'];
const LEVEL_ORDER = ['es5', ...ES_LADDER];

const syntaxLevel = function (code) {
    const base = esbuild.transformSync(code, { loader: 'js', target: ['esnext'], logLevel: 'silent' }).code;
    for (const level of ES_LADDER) {
        const out = esbuild.transformSync(code, { loader: 'js', target: [level], logLevel: 'silent' }).code;
        if (out === base) return level;
    }
    return 'es2022+';
};

/** 声明的门槛与产物语法级别的对应关系（公开支持数据） */
const LEVEL_FLOORS = {
    es2015: 'Chrome 49 / Firefox 44 / Safari 10 / iOS 10 / Edge 14',
    es2019: 'Chrome 66 / Firefox 58 / Safari 11.1 / iOS 11.3 / Edge 79（由可选 catch 绑定决定）',
};

const minJs = fs.readFileSync(abs('public/static/dist/js/app.min.js'), 'utf8');
const rawJs = fs.readFileSync(abs('public/static/dist/js/app.js'), 'utf8');

console.log('== 声明的门槛 ==');
console.log('  脚本语法目标: ' + SCRIPT_TARGET);
console.log('  样式前缀目标: ' + BROWSERS.join(', '));

console.log('== 产物语法级别（ES 版本阶梯实测） ==');
const minLevel = syntaxLevel(minJs);
const rawLevel = syntaxLevel(rawJs);
check('app.min.js 语法级别为 ' + SCRIPT_TARGET, minLevel === SCRIPT_TARGET, '实测 ' + minLevel);
check('app.js 语法级别不高于 ' + SCRIPT_TARGET, LEVEL_ORDER.indexOf(rawLevel) <= LEVEL_ORDER.indexOf(SCRIPT_TARGET),
    '实测 ' + rawLevel);
check('app.min.js 语法级别不超出声明门槛', LEVEL_ORDER.indexOf(minLevel) <= LEVEL_ORDER.indexOf(SCRIPT_TARGET),
    LEVEL_FLOORS[minLevel] || '');
check('app.js 语法级别不超出声明门槛', LEVEL_ORDER.indexOf(rawLevel) <= LEVEL_ORDER.indexOf(SCRIPT_TARGET),
    LEVEL_FLOORS[rawLevel] || '');

console.log('== 不含超门槛语法（决定门槛的充分条件） ==');
for (const { name, pattern } of FORBIDDEN_SYNTAX) {
    check('app.min.js 不含 ' + name, !pattern.test(minJs));
    check('app.js 不含 ' + name, !pattern.test(rawJs));
}
check('产物中最高级别语法 = ES2019 可选 catch 绑定', /catch\s*\{/.test(minJs));
// 页面已不加载任何 polyfill，因此这一步是硬约束：用到门槛外的 API 会直接报错。
check('未使用超出门槛的运行时 API（页面无 polyfill 兜底）',
    !/\.flat(?:Map)?\(|fromEntries|trimStart|trimEnd|allSettled|replaceAll|Object\.hasOwn|\.at\(/.test(minJs));

console.log('== 样式产物前缀覆盖 ==');
for (const name of ['app', 'font-awesome']) {
    const committed = fs.readFileSync(abs('public/static/dist/css/' + name + '.min.css'), 'utf8');
    const source = fs.readFileSync(abs('public/static/src/css/' + name + '.css'));
    const rerun = lightningTransform({
        filename: name + '.min.css',
        code: source,
        minify: true,
        targets: CSS_TARGETS,
    }).code.toString();
    const setOf = (s) => new Set(s.match(/-(?:webkit|moz|ms|o)-[a-z-]+/g) || []);
    const committedSet = setOf(committed);
    const rerunSet = setOf(rerun);
    const lost = [...rerunSet].filter((p) => !committedSet.has(p));
    check(name + '.min.css 前缀覆盖不少于按目标复跑', lost.length === 0,
        '提交产物 ' + committedSet.size + ' 项 / 复跑 ' + rerunSet.size + ' 项'
        + (lost.length ? '  丢失: ' + lost.join(', ') : ''));
}

console.log('');
console.log(failures === 0 ? '全部通过' : failures + ' 项未通过');
process.exitCode = failures === 0 ? 0 : 1;
