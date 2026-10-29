/**
 * 前端静态资源构建脚本
 *
 * 任务：clean（清理）→ style（样式）+ script（脚本）+ copy（复制资源）
 * 用法：node tools/build.mjs          全量构建
 *       node tools/build.mjs --watch  监视源码改动并增量重建
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import * as sass from 'sass';
import { transform as lightningTransform, browserslistToTargets } from 'lightningcss';

const rootPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* 路径常量 */
const staticPath = 'public/static/';
const srcPath = staticPath + 'src/';
const jsSrcPath = srcPath + 'js/';
const jsLibSrcPath = jsSrcPath + 'lib/';
const jsUserScriptSrcPath = jsSrcPath + 'userScript/';
const sassSrcPath = srcPath + 'sass/';
const cssSrcPath = srcPath + 'css/';
const fontSrcPath = srcPath + 'fonts/';
const imgSrcPath = srcPath + 'img/';

const distPath = staticPath + 'dist/';
const jsDistPath = distPath + 'js/';
const jsLibDistPath = jsDistPath + 'lib/';
const jsUserScriptDistPath = jsDistPath + 'userScript/';
const cssDistPath = distPath + 'css/';
const fontDistPath = distPath + 'fonts/';
const imgDistPath = distPath + 'img/';

const appJsFileName = 'app.js';

/* 样式编译入口（键为产物文件名） */
const sassEntries = ['app', 'font-awesome'];

/**
 * 浏览器兼容目标：单一事实来源，样式前缀与脚本语法断言均由此派生。
 * 与 spec「浏览器兼容目标」声明的门槛一致。
 */
export const BROWSERS = [
    'chrome 66',
    'safari 11.1',
    'ios_saf 11.3',
    'firefox 58',
    'edge 79',
    'android 5',
    'samsung 8',
];

/** 脚本语法目标 */
export const SCRIPT_TARGET = 'es2019';

/** 脚本不再被转译的语法（用于断言产物未超出声明门槛） */
export const FORBIDDEN_SYNTAX = [
    {name: '可选链 ?.', pattern: /\?\.[A-Za-z_$[(]/},
    {name: '空值合并 ??', pattern: /\?\?/},
    {name: 'BigInt 字面量', pattern: /\b\d+n\b/},
];

/** 样式压缩与前缀目标（由 BROWSERS 派生） */
export const CSS_TARGETS = browserslistToTargets(BROWSERS);

/** Sass 弃用告警：来自 Bootstrap 4.1.3 与 Font Awesome 4.7，仅静音输出，不改写源码 */
const silencedDeprecations = ['import', 'slash-div', 'global-builtin', 'color-functions', 'if-function'];

const abs = (p) => path.join(rootPath, p);
const log = (msg) => console.log(msg);

/**
 * 清理产物目录
 */
export const clean = async function () {
    await fsp.rm(abs(cssSrcPath), {recursive: true, force: true});
    await fsp.rm(abs(distPath), {recursive: true, force: true});
    await fsp.mkdir(abs(cssSrcPath), {recursive: true});
    await fsp.mkdir(abs(distPath), {recursive: true});
};

/**
 * 收集目录下的文件
 * @param {string} dirPath 目录（相对项目根目录）
 * @param {boolean} recursive 是否递归
 * @returns {Promise<string[]>} 文件绝对路径列表
 */
const listFiles = async function (dirPath, recursive) {
    let entries;
    try {
        entries = await fsp.readdir(abs(dirPath), {withFileTypes: true});
    }
    catch (ex) {
        if (ex.code === 'ENOENT') return [];
        throw ex;
    }
    const files = [];
    for (const entry of entries) {
        const childPath = dirPath + entry.name;
        if (entry.isDirectory()) {
            if (recursive) files.push(...await listFiles(childPath + '/', recursive));
        }
        else {
            files.push(abs(childPath));
        }
    }
    return files;
};

/**
 * 复制资源：js/lib 与 js/userScript 仅取顶层，fonts 与 img 递归
 */
export const copy = async function () {
    const copyDir = async function (srcDir, distDir, recursive, filter) {
        const files = await listFiles(srcDir, recursive);
        const targets = filter ? files.filter(filter) : files;
        for (const file of targets) {
            const relativePath = path.relative(abs(srcDir), file);
            const distFile = path.join(abs(distDir), relativePath);
            await fsp.mkdir(path.dirname(distFile), {recursive: true});
            await fsp.copyFile(file, distFile);
        }
    };

    const isJs = (file) => file.endsWith('.js');
    await copyDir(jsLibSrcPath, jsLibDistPath, false, isJs);
    await copyDir(jsUserScriptSrcPath, jsUserScriptDistPath, false, isJs);
    await copyDir(fontSrcPath, fontDistPath, true);
    await copyDir(imgSrcPath, imgDistPath, true);
};

/**
 * 把 sourcemap 的 sources 改写为相对项目根目录的路径，避免提交本机绝对路径
 * @param {string} mapJson sourcemap JSON 文本
 * @returns {string} 改写后的 sourcemap JSON 文本
 */
const normalizeMapSources = function (mapJson) {
    const map = JSON.parse(mapJson);
    map.sources = map.sources.map(function (source) {
        if (!path.isAbsolute(source)) return source;
        return path.relative(rootPath, source).replace(/\\/g, '/');
    });
    return JSON.stringify(map);
};

/**
 * 编译样式：sass 输出展开 CSS 到 src/css/，再用 lightningcss 压缩并补前缀到 dist/css/
 */
export const style = async function () {
    await fsp.mkdir(abs(cssSrcPath), {recursive: true});
    await fsp.mkdir(abs(cssDistPath), {recursive: true});

    for (const name of sassEntries) {
        const result = sass.compile(abs(sassSrcPath + name + '.scss'), {
            silenceDeprecations: silencedDeprecations,
            style: 'expanded',
            sourceMap: true,
        });

        // src/css/ 的展开产物供编辑器提示使用，不含 sourceMappingURL 注释
        const expandedCss = result.css.replace(/\n?\/\*# sourceMappingURL=.*?\*\/\s*$/s, '\n');
        await fsp.writeFile(abs(cssSrcPath + name + '.css'), expandedCss);

        const minFileName = name + '.min.css';
        const output = lightningTransform({
            filename: minFileName,
            code: Buffer.from(result.css),
            minify: true,
            sourceMap: true,
            inputSourceMap: JSON.stringify(result.sourceMap),
            targets: CSS_TARGETS,
        });
        const minCss = output.code.toString() + '\n/*# sourceMappingURL=' + minFileName + '.map */\n';
        await fsp.writeFile(abs(cssDistPath + minFileName), minCss);
        await fsp.writeFile(abs(cssDistPath + minFileName + '.map'), normalizeMapSources(output.map.toString()));
    }
};

/**
 * 打包脚本：未压缩副本 + 压缩产物（含 sourcemap）
 * @param {{watch?: boolean}} options 选项
 * @returns {Promise<import('esbuild').BuildContext[]|undefined>} 监视模式返回构建上下文
 */
export const script = async function (options = {}) {
    await fsp.mkdir(abs(jsDistPath), {recursive: true});

    const shared = {
        entryPoints: [abs(jsSrcPath + appJsFileName)],
        bundle: true,
        format: 'iife',
        target: [SCRIPT_TARGET],
        logLevel: 'warning',
    };
    const builds = [
        {...shared, outfile: abs(jsDistPath + appJsFileName), minify: false},
        {...shared, outfile: abs(jsDistPath + 'app.min.js'), minify: true, sourcemap: true},
    ];

    if (!options.watch) {
        await Promise.all(builds.map((build) => esbuild.build(build)));
        return;
    }

    const contexts = await Promise.all(builds.map((build) => esbuild.context(build)));
    await Promise.all(contexts.map((ctx) => ctx.watch()));
    return contexts;
};

/**
 * 全量构建：clean → style + script + copy（并行），任一任务失败即抛出
 */
export const build = async function () {
    await clean();
    await Promise.all([style(), script(), copy()]);
};

/**
 * 监视模式：脚本用 esbuild 增量重建；样式与资源用递归 fs.watch + 防抖
 */
export const watch = async function () {
    await clean();
    await Promise.all([style(), copy()]);
    await script({watch: true});

    const debounce = function (task) {
        let timer = null;
        return function () {
            if (timer) clearTimeout(timer);
            timer = setTimeout(function () {
                timer = null;
                Promise.resolve()
                    .then(task)
                    .catch((ex) => console.error(ex));
            }, 100);
        };
    };

    const watchers = [
        {dir: sassSrcPath, task: style, label: '样式'},
        {dir: jsLibSrcPath, task: copy, label: '资源'},
        {dir: jsUserScriptSrcPath, task: copy, label: '资源'},
        {dir: fontSrcPath, task: copy, label: '资源'},
        {dir: imgSrcPath, task: copy, label: '资源'},
    ];
    for (const {dir, task, label} of watchers) {
        fs.watch(abs(dir), {recursive: true}, debounce(async function () {
            await task();
            log('-> ' + label + '已更新');
        }));
    }

    log('监视中……（Ctrl+C 退出）');
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
    const task = process.argv.includes('--watch') ? watch : build;
    task().catch(function (ex) {
        console.error(ex);
        process.exitCode = 1;
    });
}
