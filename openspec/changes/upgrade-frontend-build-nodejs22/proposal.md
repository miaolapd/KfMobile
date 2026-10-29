# Proposal

## Why

前端静态资源构建链路固定在 gulp 3.9 + browserify 16 + babel 6 + node-sass 4 上，本机 Node.js 已为 v22.22.3，该链路在 Node 12 之后即无法运行（`gulp` 二进制缺失、`node-sass` 需针对 Node ABI 编译原生模块、`gulp-util`/`run-sequence` 已废弃），导致 `app.min.js` 与 `app.min.css` 自 2023-04-21 起无法重新构建。升级 PHP 8.5 / ThinkPHP 8.1 后前端源码仍可修改，但产物无法再生，会阻塞后续一切前端改动，因此需要把构建链路迁到受支持的 Node.js v22+ 工具上。

## What Changes

- **BREAKING**：构建入口由 `gulp build` / `gulp watch` 改为 `npm run build` / `npm run watch`；删除 `gulpfile.js` 与全部 gulp 插件依赖，README 中的编译说明同步改写。对外交付物（`public/static/dist/` 下的文件路径与文件名）保持不变。
- **BREAKING**：产物兼容目标由 ES5 改为现代浏览器，语法目标定为 ES2019，实际语法门槛为 Chrome 66+ / Firefox 58+ / Safari 11.1+ / iOS 11.3+ / Edge 79+（该门槛由压缩器为省字节删除 `catch` 绑定而生成的 `catch {}`（ES2019 可选 catch 绑定）决定，源码本身只用到 ES2015 语法）。不再对主应用做 ES5 降级；IE 与 2015 年前的旧移动浏览器不再受支持。
- 打包与压缩改用 esbuild：`app.js` 由 browserify + babelify + uglify 改为 esbuild 直接打包为 IIFE 并压缩，产物仍为 `dist/js/app.js`（未压缩，含换行归一化）与 `dist/js/app.min.js` + `dist/js/app.min.js.map`。
- 样式编译改用 dart-sass（`sass`，纯 JS 实现，无需原生编译），压缩与浏览器前缀由 `lightningcss` 承担，替代 `gulp-sass` + `gulp-clean-css` + `gulp-autoprefixer`；产物仍为 `dist/css/app.min.css`、`dist/css/font-awesome.min.css` 及同名 `.map`。
- 资源复制与清理改用 Node 内置 `fs.cp`/`fs.rm`，替代 `gulp.src/dest`、`del`、`vinyl-*`；复制范围维持现状（`js/lib/*.js`、`js/userScript/*.js`、`fonts/**`、`img/**`）。
- 自定义脚本链路（`public/static/src/js/userScript/`）由 `babel-cli` 6 + `babel-preset-es2015` 改为 esbuild 转译，输出目标同为 ES2019；产物目录由 `es5/` 改为 `es2019/`（目录名标示目标语法级别，沿用原有命名约定），`package.json` 的 `build-scripts` 脚本同步改写；同时删除内容为非法 JSON（使用单引号）且仅服务于 babel 6 的 `userScript/.babelrc`。
- 新增 `engines.node` 声明（`>=22`）并提交 `package-lock.json`，使构建环境可复现。
- 清理构建升级过程中发现的遗留缺陷：移除 `public/static/src/js/app.js` 中对 `Other.transferKfbAlert()` 的调用（`other.js` 从未导出该函数，银行页在现有线上产物中会抛 `TypeError`）；同时移除 `package.json` 中指向不存在文件的 `main` 字段与失效的 `test` 脚本。

## Capabilities

### New Capabilities

- `platform/frontend-build`: 前端静态资源的 Node.js v22+ 构建要求、构建入口与任务集合、产物路径与兼容目标、自定义脚本转译与元信息头保留、以及构建产物的可复现性。

### Modified Capabilities

无（项目当前 `openspec/specs/` 尚无已归档 specs；`upgrade-php85-thinkphp81` 虽已完成但未归档，本次不依赖其规格内容）。

## Impact

- 构建配置：删除 `gulpfile.js`；重写 `package.json`（删除 18 个 devDependencies，新增 `esbuild`、`sass`、`lightningcss`，共 3 个）；新增 `package-lock.json`；构建脚本逻辑迁入 `tools/` 下的 Node 脚本；新增 `.gitattributes` 固定自定义脚本的换行（`*.user.js text eol=lf`），避免 `core.autocrlf=true` 在检出时把 LF 转成 CRLF 而破坏运行时元信息解析。
- 本地辅助脚本（均在 `.gitignore` 中，仅影响本机）：`build.bat`、`gulp.cmd` 改为调用 npm 脚本，`buildCustomScripts.bat` 删除。
- 前端源码：`public/static/src/js/app.js` 移除 `transferKfbAlert` 调用；`public/static/src/js/userScript/.babelrc` 删除；`es5/` 目录删除（改为 `es2019/`）。
- 构建产物：`public/static/dist/` 下文件名与路径不变，但字节内容变化（不同压缩器与编译目标）；`dist/js/app.js`、`dist/js/app.min.js`、两个 `.min.css` 及两个 `.css.map` 均需重新生成并提交。
- 应用代码：不需要改动。视图引用的 `__PUBLIC__{$Think.config.static_path}` 路径、`static_file_timestamp` 缓存参数、`window.Info.staticPath` 契约与运行时 `==UserScript==` 元信息解析均保持不变。
- 文档：README「编译静态资源文件」章节改写为 Node.js v22+ 与 npm 脚本说明。
- 不在本次范围：`public/static/src/css/*.css` 的编辑器提示用途、`js/lib/` 下第三方库的版本升级、Bootstrap 4 / Font Awesome 4 升级、Sass `@import` 与 `math.div` 的现代化改写、生产部署流程。
