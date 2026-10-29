# Design

## Context

动机见 `proposal.md` - Why；行为契约见 `specs/platform/frontend-build/spec.md`。以下是实现方案所依据的现状约束（均为本次实测结论）。

**现有构建链路**（`gulpfile.js`，18 个 devDependencies）：

| 环节 | 现用工具 | 产物 |
| --- | --- | --- |
| 脚本打包/转译/压缩 | browserify 16 + babelify 8 + babel-preset-es2015 + gulp-uglify | `dist/js/app.js`、`app.min.js`(+`.map`) |
| 样式编译 | gulp-sass 4（node-sass，原生模块） | 展开的 `src/css/*.css` |
| 样式压缩/前缀 | gulp-clean-css + gulp-autoprefixer | `dist/css/*.min.css`(+`.map`) |
| 资源复制 | gulp.src/dest（vinyl） | `dist/js/lib/`、`dist/js/userScript/`、`dist/fonts/`、`dist/img/` |
| 清理/编排/监视 | del + run-sequence + watchify + gulp.watch | - |
| 自定义脚本 | babel-cli 6（`npm run build-scripts`） | `src/js/userScript/es5/*.js` |

**关键现状事实**（影响方案，务必保留）：

1. 产物文件名与路径是**外部契约**：`Public/head.html`、`Public/footer.html` 引用 `app.min.css`、`font-awesome.min.css`、`app.min.js`、`js/lib/*`、`js/userScript/KfEmotion.min.user.js`；`config/` 中 `static_path = 'static/dist/'`。
2. `src/css/*.css` 是 **sass 的展开产物**（非手写源码），已被 git 跟踪，并被 45 个视图以 ThinkPHP 模板注释 `{/* 编辑器提示用 */}` 形式引用；`clean` 任务会删除它。
3. 脚本源码为 **ESM + 混用 CommonJS**：12 个 `module/*.js` 用 `import`/`export`，而 `app.js` 的 `exportModule()` 内混用 **11 处 `require()`**（browserify 靠静态分析容忍此写法）。esbuild 实测可直接打包并通过（含 2 处 `direct-eval` 告警、1 处悬空引用告警），但 **Babel 必须移除后仍然可用**，故打包器需同时理解两种模块语法。
4. 运行时 `script.js:10` 用 `metaRegex = /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i` **解析用户粘贴的自定义脚本文本**，从 `==UserScript==` 块中取 `@name`/`@trigger`。该正则的 `(?:.|\n)` **不能跨越 `\r`**（实测：CRLF 文本匹配失败，LF 匹配成功）。而仓库内维护的 `userScript/es6/*.js` 头部正是此类元信息块。
5. `app.js:139` 调用 `Other.transferKfbAlert()`，但 `other.js` **从未导出该名字**（`TransferKfbAlert` 在初始提交即缺失）。旧 browserify 产物同样只是把它编译成 `Other.transferKfbAlert()` 调用，即**线上银行页（`bankPage`）现状会抛 `TypeError`**。
6. `src/js/userScript/es5/` 不被任何代码或构建任务引用（仅 `buildCustomScripts.bat` 写入它），也不复制进 `dist/`。
7. `polyfill.min.js` 由页面加载，且 `dist/js/lib/` 内脚本按第 1 条**原样复制**，不经打包器。
8. Sass 源码内含 Bootstrap 4.1.3 与 Font Awesome 4.7 的官方 `.scss`，会触发 dart-sass 的 5 类弃用告警（`import`、`slash-div`、`global-builtin`、`color-functions`、`if-function`）；实测 **仅告警、编译成功**，且可通过 `silenceDeprecations` 全部静音。
9. `package.json` 的 `main` 指向不存在的 `main.js`，`test` 为占位失败脚本。

**环境**：本机 Node.js v22.22.3 / npm 12.2.1。旧链路在 Node 12+ 即不可用（`node_modules/gulp/bin/gulp.js` 缺失、node-sass 需按 ABI 编译）。

## Goals / Non-Goals

**Goals:**

- 在 Node.js v22+ 上以纯 JS 依赖完成全部前端构建，**产物文件名与路径零变化**，服务端视图与运行时引用无需改动。
- 保留现有全部构建语义：清理 → 样式 + 脚本 + 复制、增量监视、`src/css/` 展开中间产物、`.map` 调试映射、`dist/js/app.js` 未压缩副本。
- 让 `app.js` 的 ESM + `require()` 混用写法继续可打包。
- 保证自定义脚本产物仍能被运行时 `metaRegex` 解析出元信息。
- 用提交 `package-lock.json` + `engines.node` 让构建环境可复现。

**Non-Goals:**

- 不改写前端业务逻辑与页面结构（`transferKfbAlert` 悬空调用的清理除外，见决策 7）。
- 不升级 Bootstrap 4 / Font Awesome 4、`js/lib/` 第三方库、`polyfill.min.js`。
- 不做 Sass `@import` → `@use`、`math.div`、`color.adjust` 的现代化改写（仅静音告警，见决策 3 与 Open Questions）。
- 不改 `src/css/*.css` 的编辑器提示用途与那 45 个视图。
- 不引入打包缓存、代码分割、CSS Modules、PostCSS 插件生态等新能力。
- 不处理生产部署与 CDN（`static_file_cdn` 分支）配置。

## Decisions

### 1. 以 esbuild 取代 browserify + babelify + uglify，目标 ES2019

esbuild 0.28 的 JS API 一次完成打包、转译、压缩与 sourcemap，实测打包本仓库入口：**12ms、161KB（未压缩）/ 99KB（压缩）**，无错误。替代方案对比：

- **browserify 17 + @babel/core 8 + terser**：保留原架构，但依赖数（约 8 个）与构建耗时都远高于 esbuild，且 browserify 生态自身也在收缩。
- **rollup / webpack**：配置量远大于需求；本项目只有一个入口、无需代码分割。
- **保留 Babel 做 ES5 降级**：与已确认的"现代浏览器 ES2019"目标冲突；产物更小、构建更简。

混用模块语法由 esbuild 直接支持（约束事实 3 已实测通过）。选 `format: 'iife'`（无需模块加载器，贴合原 browserify 产物形态）、`target: ['es2019']`。**不关闭 `minifyIdentifiers`**：实测直接 `eval(keyWord)` 所在作用域的被引用绑定（`keyWord`/`regex`/`title` 等）被 esbuild 保留原名，未破坏 `public.js`、`configDialog.js` 中"用户输入正则字符串"的既有用法。

`dist/js/app.js`（未压缩）与 `dist/js/app.min.js`（压缩 + `.map`）分两次 `build` 产出，对应原链路的双产物。

**产物的实际语法门槛（实测，非按 `target` 推断）**：`target: 'es2019'` 并不等于"门槛就是 ES2019"，需按产物实际含有的语法逐项核对。实测结果：

| 项目 | 结论 |
| --- | --- |
| 源码语法层级 | 全部 15 个源文件（`app.js` + 12 个 module + 2 个 userscript）均为 **ES2015**，无 ES2016+ 语法 |
| 压缩产物（`app.min.js`，98,994 字节） | 含 ES2015 全部语法 + **可选 catch 绑定 `catch {}`**（ES2019） |
| 未压缩产物（`dist/js/app.js`，161,942 字节） | 仅 ES2015，不含 `catch {}` |
| ES2019+ 运行时 API | **未使用**（无 `flat`/`flatMap`/`fromEntries`/`trimStart`/`allSettled`） |
| 实际门槛 | **Chrome 66 / Firefox 58 / Safari 11.1 / iOS 11.3 / Edge 79** |

关键点：`catch {}` **不是源码写法**——源码 10 处全为 `catch (ex)`，是压缩器为省字节删除未使用绑定而生成的。地面真值（MDN/V8 发布说明）与 esbuild 自报一致：可选 catch 绑定为 Chrome 66 / Firefox 58 / Safari 11.1 / iOS 11.3 / Edge 79。

**与旧声明矩阵的差异**：初稿曾声明"Chrome 60+"，但实测 Chrome 60–65 解析 `catch {}` 会失败、整站 JS 不可用；同矩阵中的 iOS 12 / Safari 12 / Firefox 60 均高于实际门槛故安全。已按实测修正声明，避免文档承诺高于实际能力。

**为何不降 `target` 到 `es2015`/`es2017`**：实测 `es2015`/`es2016`/`es2017`/`es2018` 四个目标的产物**逐字节相同**（均 99,012 字节），且门前门槛同为 Chrome 62（模板字面量等由 esbuild 自行改写所致），并不比 `es2019` 更能覆盖旧引擎；`es2019` 反而小 18 字节。若将来确需覆盖 iOS 10 级别设备，可加 `supported: {'optional-catch-binding': false}` 保留 catch 绑定（实测 99,012 字节、门槛降至 Chrome 62），而不是降 `target`。

### 2. 任务编排用单个 Node 脚本，取代 gulp + run-sequence + del + vinyl-*

新增 `tools/build.mjs`（`--watch` 切换监视模式），`package.json` 只保留三个脚本：

```json
"build":         "node tools/build.mjs",
"watch":         "node tools/build.mjs --watch",
"build-scripts": "node tools/build-user-scripts.mjs"
```

任务语义与 gulp 版一一对应：`clean` → 并行（`style`、`script`、`copy`），全部 `await` 后用非零退出码反映失败（原 `runSequence` 的回调式串行无错误传播，此处是行为改进，非行为变更）。

- 清理与复制用 Node 内置 `fs.rm({recursive,force})` / `fs.cp({recursive})`（Node 22 原生可用，实测通过），去掉 `del` + `vinyl-*` + `gulp.src/dest` 共 6 个依赖。
- 复制范围严格沿用现状：`js/lib/*.js`（**仅顶层，不递归**）、`js/userScript/*.js`（仅顶层）、`fonts/**`、`img/**`。`js/lib/*.js` 必须保持"不递归"，否则会把 `lib/` 下若有子目录的内容一并搬走而改变产物集合。
- 编排不引入 `npm-run-all`/`concurrently` 等额外依赖。

### 3. dart-sass 编译 + lightningcss 压缩与加前缀

- **编译**：`sass`（dart-sass，1.106）纯 JS，无需原生编译，取代 node-sass。实测编译 `app.scss` 与 `font-awesome.scss` 均成功（仅弃用告警）。用 `silenceDeprecations: ['import','slash-div','global-builtin','color-functions','if-function']` 静音上述 5 类告警，使构建输出干净；**不修改** Bootstrap/FA 的 `.scss` 内容。
- **压缩与前缀**：`lightningcss` 1.33 同时完成压缩、按目标补齐前缀与 sourcemap，取代 `gulp-clean-css` + `gulp-autoprefixer`（含 `autoprefixer` 传递依赖）。选它而非 PostCSS + cssnano + autoprefixer（3 个依赖、需配置）：单依赖、原生实现、速度快。实测对比 esbuild 的 CSS 压缩：lightningcss 多补出 `-webkit-text-decoration`、`-webkit-backface-visibility`，且补齐 `-moz-*`/`-ms-*` 更具覆盖面，体积还略小（140,959 vs 142,968 字节）。目标用 `lightningcss` 的数值 targets（`chrome:66<<16`、`safari:11.1<<16`、`ios_saf:11.3<<16`、`firefox:58<<16`、`edge:79<<16`、`android:5<<16`、`samsung:8<<16`）——与决策 1 实测的脚本门槛对齐，CSS 前缀覆盖面不得窄于脚本门槛。
- **两段产物保持**：sass 先输出展开 CSS 到 `src/css/`（约束事实 2，保留供编辑器提示，不产 `.map`，与现状一致），再由 lightningcss 输出 `dist/css/*.min.css` + `.map`。

### 4. 监视模式：esbuild context 增量 + 递归 fs.watch

- 脚本用 esbuild 的 `context()` + `ctx.watch()`（原生增量，内部自带防抖），对应原 `watchify`。
- 样式用 `fs.watch(sassSrcPath, {recursive: true})`（Windows 与 macOS 原生支持递归；实测递归监视可捕获嵌套写入），加 ~100ms 防抖后重跑样式任务，对应原 `gulp.watch`。
- 监视模式额外补齐原 `watch` 任务**未覆盖**的 `copy` 与 `app.js` 未压缩副本：源码变动后一并刷新，避免 dev 环境产物与 build 结果不一致。

### 5. 自定义脚本改为单文件转译，`es2019/` 输出

用 esbuild 的 `transform` API（单文件、不打包，脚本依赖页面的全局 `$`、`pageId`）逐个转译 `userScript/es6/*.js` → `userScript/es2019/*.js`，`target: ['es2019']`、`charset: 'utf8'`（保留中文字面量，避免被转成 `\uXXXX` 转义序列）、`minify: true`（沿用原 `es5/` 目录已是压缩产物的量级）。

**元信息块必须自行拆分与回填**（关键，源自约束事实 4）：esbuild 会把文件头注释当作注释丢弃，实测 `transform` 产物中 `==UserScript==` 块彻底消失。且**不能简单原样回填**——源码块为 CRLF，而运行时 `metaRegex` 的 `(?:.|\n)` 无法跨 `\r`，实测 CRLF 元信息块**匹配失败**（回退为默认名"未命名脚本"/`end`），而当时的 `es5/` 产物元信息块恰为 LF（实测匹配成功）。因此流程为：正则提取头部块 → **归一化为 LF** → `transform(body, {banner})` 回填 → 校验产物可被 `metaRegex` 匹配且 `new Function()` 可解析。

**换行契约需要 `.gitattributes` 兜底**（实施阶段发现，仅靠构建脚本不足）：本机 `core.autocrlf=true`（Git for Windows 的默认设置），git 会把仓库中以 LF 存储的文本在**检出时转成 CRLF**。实测复现：一个以 LF 存储且元信息块可被 `metaRegex` 匹配的文件，经 `core.autocrlf=true` 检出后变成 CRLF、匹配失败。也就是说，构建脚本在磁盘上写出的 LF 归一化结果，会在下次检出时被 git 悄悄还原成 CRLF，使本决策失效（旧 `es5/` 产物以 LF 存储，同样存在该隐患）。故新增 `.gitattributes` 声明 `*.user.js text eol=lf`，把"这些文件必须保持 LF"固化为仓库级契约；实测该声明生效（`*.user.js` 检出后仍为 LF 且匹配成功，其他文件仍按常规转换）。`tools/verify-build.mjs` 通过 `git check-attr` 断言该声明存在，防止回归。

目录名由 `es5/` 改为 `es2019/`：原命名标示目标语法级别，改后仍沿用该约定，避免目录名与内容（ES2019）不符。旧 `es5/` 目录与 `userScript/.babelrc`（内容 `{ "presets": ['es2015'] }`，**使用单引号、非合法 JSON**）一并删除；`es5/` 无任何引用（约束事实 6），删除不影响构建与运行时。

### 6. 依赖与锁定

`devDependencies` 由 18 个降至 3 个：`esbuild`、`sass`、`lightningcss`；新增 `"engines": {"node": ">=22"}`；提交 `package-lock.json`（现无锁定文件）。同时移除 `main`（指向不存在的 `main.js`）与 `test`（占位失败脚本，替换为不存在的测试框架无意义），保留 `build`、`watch`、`build-scripts`。

### 7. 清理 `transferKfbAlert` 悬空调用

`app.js` 的 `bankPage` 分支改为不调用该函数（该分支随之无其他语句，按现有代码风格移除整个 `bankPage` 分支，`app.js:138-140`）。依据：`other.js` 全量导出清单里没有该名字，`git log -S` 显示自初始提交起就从未存在，属**构建升级前既有的缺陷**；新打包器会对此告警，若不处理将长期污染构建输出（spec 要求"打包无悬空引用警告"）。行为变化仅为：银行页由"抛 TypeError、后续初始化中断"变为"无报错、初始化继续"，属缺陷修复而非功能变更。

### 8. 本地辅助脚本

`build.bat`、`gulp.cmd`、`buildCustomScripts.bat` 均在 `.gitignore` 中（仅本机）。`build.bat` 改为 `call npm run build`；`gulp.cmd` 删除（其硬编码 `D:\Program Files\nodejs-10\node.exe` 已失效）；`buildCustomScripts.bat` 删除（对应 npm 脚本仍在）。`gulpfile.js` 从仓库删除，并从 `.gitignore` 移除 `gulp.cmd` 条目。

## Risks / Trade-offs

- **[产物字节内容变化]** 换编译器/压缩器必然改变产物字节，`static_file_timestamp` 需在部署时更新以破缓存 → 部署时按既有流程更新该配置；文件名不变，故浏览器缓存键已由 `?ts=` 覆盖。
- **[ES5 → ES2019 是不兼容变更]** 旧设备（iOS < 11.3、Chrome/WebView < 66、Firefox < 58）将无法执行脚本，页面只剩静态 HTML → 门槛由一个压缩器生成的 `catch {}` 决定（见决策 1），比语法目标本身更严；若需覆盖 iOS 10 级别设备，加 `supported: {'optional-catch-binding': false}` 即可把门槛降至 Chrome 62（实测 +18 字节），无需改 `target`。若需真正回到 ES5，则 esbuild 不够用（实测拒绝把 `let`/`const`/箭头函数降级到 es5），须另引 Babel，成本较高。
- **[`polyfill.min.js` 覆盖有限]** 页面加载的是 babel-polyfill 6（core-js 2），实测确认覆盖 `Array.prototype.includes`、`Object.entries`/`values`、`String.prototype.padStart` 等源站实际用到的 API，但**不含** `Object.fromEntries`、`Array.prototype.flat` 等 ES2019 方法 → 本产物未使用这类方法，故当前无缺口；若日后新增 ES2019+ API 调用，须同时补 polyfill（或将其纳入构建期转译），不能只升 `target`。
- **[ES2019 目标下 `dist/js/app.js` 不再是 ES5]** 未压缩副本同样面向现代浏览器 → 该文件仅供调试，页面实际加载 `app.min.js`。
- **[Sass 弃用告警被静音]** 未来升级到 dart-sass 3.0 时 `@import` 会被移除，届时构建会真正失败 → 已记入 Open Questions；静音仅压制输出，不影响编译结果（实测编译成功、产物 183KB 与原先同量级）。
- **[`fs.watch` 递归在 Linux 上不可用]** Node 的 recursive 选项仅 Windows/macOS 支持 → 本项目开发环境为 Windows（README 与本机均如此），监视模式仅用于本地开发，构建模式不受影响；若将来有 Linux 开发者，可退化为逐目录注册 watcher。
- **[移除 `bankPage` 分支]** 若该函数本应有实现（如转账前提示），清理会让该意图丢失 → 便于恢复：函数体从未入库，spec 已把"页面初始化不因悬空调用中断"固化为契约；若日后需要该提示功能，应作为独立变更按需求重新实现。
- **[lightningcss 目标与 esbuild 目标需人工保持一致]** 两处各写一份目标列表，可能漂移 → 在构建脚本中以单一常量导出目标并在两处复用（`BROWSERS` 供 lightningcss 派生 `CSS_TARGETS`，`SCRIPT_TARGET` 供 esbuild）。
- **[esbuild 的 Safari/iOS 兼容表不可靠，不能用作门槛校验]** 实测 esbuild 声称 Safari 14 / iOS 14 缺少解构（与事实不符），且 `android 5`、`samsung 8` 不是其合法 target 记法 → 门槛核对改为「ES 版本阶梯」：按 `es2015`…`es2021` 逐级重新转译产物，首次与 `esnext` 基线一致的级别即产物实际语法级别（见 `tools/verify-targets.mjs`）；浏览器门槛再由该级别对应的公开支持数据得出，并单独断言 ES2020+ 语法不存在、产物中最高语法确为 ES2019 可选 catch 绑定。

## Migration Plan

1. 装依赖并锁定：更新 `package.json`（依赖、`engines`、scripts）→ `npm install` 生成 `package-lock.json`。
2. 新增 `tools/build.mjs`、`tools/build-user-scripts.mjs`；删除 `gulpfile.js`。
3. 先跑 `npm run build`，与旧产物对照验收（路径同名、页面 200、无 404、`dist/js/lib|fonts|img` 与源码逐字节一致、两个 `.map` 可被浏览器解析）。
4. 处理源码侧清理：`app.js` 移除 `bankPage`/`transferKfbAlert` 分支；删除 `userScript/.babelrc` 与 `es5/`；生成 `es2019/`。
5. `npm run watch` 验证增量：改 `_variables.scss` 与任一 `module/*.js`，确认只重跑受影响产物。
6. 更新 README「编译静态资源文件」为 Node.js v22+ 与 npm 命令；更新本机 `build.bat`，删除 `gulp.cmd`、`buildCustomScripts.bat`。
7. 提交重新生成的 `public/static/dist/` 产物（含 `app.js`、`app.min.js`、两个 `.min.css`、两个 `.css.map`）与 `package-lock.json`。

**回滚**：恢复上一版本代码（含 `gulpfile.js`、`package.json`、`es5/`、旧 `dist/`）即可；本次不涉及数据库、外部存储或服务端配置迁移。注意旧链路在本机 Node 22 下无法重建，回滚后如需重新构建前端，须使用 Node 12 环境或先回退 Node 版本。

## Open Questions

- Sass 现代化（`@import` → `@use`、`math.div`、`color.adjust`）与 Bootstrap 4 / Font Awesome 4 的升级时机：本次以静音告警维持现状，待 dart-sass 3.0 发布前另行处理，不影响本变更的规格与任务拆分。
- Linux 开发机上的样式监视退化为逐目录 watcher 的实现方式：本机与 README 均以 Windows 为准，可延后到实际需要时再定。
