/**
 * 自定义脚本转译脚本
 *
 * 把 public/static/src/js/userScript/es6/ 下的脚本转译为 es2019/ 目录。
 *
 * 注意：运行时（public/static/src/js/module/script.js）用
 *   /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i
 * 解析脚本元信息，其中 (?:.|\n) 无法跨越 \r，因此回填的元信息块必须是 LF 换行；
 * 同时 esbuild 默认会丢弃文件头注释，必须由本脚本自行提取并回填。
 *
 * 用法：node tools/build-user-scripts.mjs
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const rootPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(rootPath, 'public/static/src/js/userScript/es6');
const distDir = path.join(rootPath, 'public/static/src/js/userScript/es2019');

/** 与运行时 script.js 保持一致 */
const META_REGEX = /^\s*(\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==[ \t]*\r?\n)/i;

const buildUserScripts = async function () {
    const files = fs.readdirSync(srcDir, {withFileTypes: true})
        .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
        .map((entry) => entry.name);

    await fsp.rm(distDir, {recursive: true, force: true});
    await fsp.mkdir(distDir, {recursive: true});

    for (const file of files) {
        const source = await fsp.readFile(path.join(srcDir, file), 'utf8');
        const bannerMatch = META_REGEX.exec(source);
        if (!bannerMatch) {
            throw new Error('未找到 ==UserScript== 元信息块：' + file);
        }
        // 归一化为 LF：运行时正则无法跨越 \r
        const banner = bannerMatch[1].replace(/\r\n/g, '\n');
        const body = source.slice(bannerMatch[1].length);

        const result = await esbuild.transform(body, {
            loader: 'js',
            target: ['es2019'],
            charset: 'utf8',
            minify: true,
            banner: banner.trimEnd(),
        });

        const output = banner + result.code;
        await fsp.writeFile(path.join(distDir, file), output);
        console.log('-> ' + file);
    }
    console.log('已转译 ' + files.length + ' 个脚本到 ' + path.relative(rootPath, distDir).replace(/\\/g, '/'));
};

buildUserScripts().catch(function (ex) {
    console.error(ex);
    process.exitCode = 1;
});
