# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

KfMobile 是绯月论坛（KF）的**移动版反向代理**：没有数据库，服务端抓取远端 `proxy_domain`（GBK 编码的论坛页面），用 phpQuery 解析、改写链接与编码后，用本地 Bootstrap 视图重新渲染。站点入口是 `public/index.php`。

技术栈：PHP 8.5 + ThinkPHP 8.1（Composer 管理）+ jaeger/phpquery-single 1.1 + Bootstrap 4.1.3 + jQuery 3.4.1 + Font Awesome 4.7。仓库已提交 `vendor/` 与 `composer.lock`，部署机无需执行 `composer install`。

## 常用命令

需 PHP 8.5 与 Node.js 22+ 的 CLI：

```bash
# 本地起服务（docroot 必须是 public/）
php -S 127.0.0.1:8022 -t public

# 语法检查（提交前对全部 PHP 文件执行）
find app config route public tools -name '*.php' -exec php -l {} \;

# 冒烟测试：检查保留路由、/game/1 错误页、URL 归一化、响应中无 PHP 致命错误
# 可选第二参数为只读验证用的 Cookie 头
php tools/smoke.php http://127.0.0.1:8022

# 静态资源引用完整性（抓取页面 HTML，逐个请求其中的本地静态资源确认无 404）
node tools/verify-assets.mjs http://127.0.0.1:8022

# 前端构建（产物已提交，普通部署无需执行）
npm install
npm run build            # 全量：clean → style + script + copy
npm run watch            # 监视增量重建
npm run build-scripts    # public/static/src/js/userScript/es6/ → es2019/

# 构建产物的两套验收脚本（改构建链路或产物后必跑）
node tools/verify-build.mjs     # 产物集合 vs git 跟踪集合、复制资源逐字节一致、sourcemap 无本机绝对路径
node tools/verify-targets.mjs   # 按 ES 版本阶梯实测产物语法级别不超出声明门槛

# 无头浏览器探测（需先起服务；验证前端改动的真实渲染效果）
node tools/browser-probe.mjs http://127.0.0.1:8022/login tools/probes/generic.json

# 生成配置/路由缓存（生产部署时）
php think optimize:config
php think optimize:route
```

没有测试框架（不引入 PHPUnit），验证依靠 `tools/smoke.php` 与 `tools/verify-*.mjs`。

### 无头浏览器测试

验证前端改动（样式、字号、图标、库版本、交互）时，用 `tools/browser-probe.mjs` 在**真实浏览器**中渲染页面并读取运行时状态——它执行页面 JS，因而能反映计算样式、元素尺寸、图标字形等静态检查看不到的东西。

原理：直连本机 Edge（Chromium 内核，Windows 自带）的 DevTools Protocol，**不引入 puppeteer/playwright 等 npm 包**。脚本自动取空闲端口、用完清理临时 profile，可并发调用。

```bash
# 需先起服务（docroot 必须是 public/）
php -S 127.0.0.1:8022 -t public

# 用内置通用探针（检查字号、横向溢出、库版本、图标字形、BS4 残留等）
node tools/browser-probe.mjs http://127.0.0.1:8022/login tools/probes/generic.json

# 指定视口宽度，核对响应式断点
node tools/browser-probe.mjs http://127.0.0.1:8022/login tools/probes/generic.json --width=375
node tools/browser-probe.mjs http://127.0.0.1:8022/login tools/probes/generic.json --width=1440

# 自定义探针：写一个 { "键名": "JS 表达式" } 的 JSON，表达式在页面上下文求值
cat > /tmp/my-probe.json <<'EOF'
{ "navbarTheme": "document.querySelector('.navbar')?.dataset.bsTheme || 'none'" }
EOF
node tools/browser-probe.mjs http://127.0.0.1:8022/ /tmp/my-probe.json
```

选项：`--width=1280`、`--height=900`、`--wait=1500`（load 后额外等待毫秒，用于等 `app.js` 初始化）、`--mobile`。

**访问限制（重要）**：本站是反向代理，**未登录时受保护页面一律重定向到登录页**。无需论坛账号即可渲染的只有：

- `/login` 登录页（`body id="loginPage"`）
- 不存在的路径（如 `/no-such-page`）触发的错误页（`id="errorPage"`）

由此带来两个验证上的限制，改前端前需知悉：

1. **`app.js` 的 `init()` 在登录页会提前 return**（`if (pageId === 'loginPage') return;`），故 `window.Util`/`readConfig` 等模块导出、配置对话框、发帖/阅读/消息页的交互**无法在未登录状态下验证**；`register` 页会 302 到远端，同样不可达。
2. 因此涉及 `init()` 之后逻辑的改动（BS 插件构造器、`kf_config` 持久化、各页面交互），须由用户在已登录的真实会话中验收，不能仅凭探针结果判定通过。

调试期若界面未更新，先删 `runtime/temp`（模板编译缓存）再探测。

### 调试配置

`app/my.php` 是本地覆盖配置（已被 gitignore）。调试时复制 `app/my.debug.php` 为 `app/my.php`（开 `app_debug`，Windows 下建议 `verify_ssl_cert=false`）；部署时改用 `app/my.product.php`。`app/bootstrap.php` 以扁平键方式加载 `app/config.php` 后再叠加 `my.php`。

改视图或配置后若界面未更新，删除 `runtime/temp`（模板编译缓存）。

## 请求链路

每个页面的服务端代码是固定四件套，新增页面需同时补齐这几处：

1. **控制器** `app/controller/X.php` — 继承 `Base`（内置登录校验），调用 `Proxy::get('远端.php', $request->param())`，把响应交给响应类，再 `if ($request->isAjax()) return $data; else return $this->fetch('X/index', $data);`
2. **响应类** `app/responser/X.php` — 继承 `Responser`，用 phpQuery 从远端 DOM 抓数据，返回视图变量数组
3. **视图** `app/view/X/index.html` — 用 `body id="xPage"` 标记页面（前端按此分发）
4. **链接映射** `app/common.php:convert_url()` — 远端 `xxx.php?action=y` → 本地路由

写操作（发帖、回帖、投票、购买等）走 `Proxy::post()`，然后 `new responser\Responser($response)`；该类会解析远端的「跳转/操作提示」页面并转成本地 `success()`/`error()`，调用后必须再 `return error('…失败')` 兜底。

### 关键抽象

- **`app/responser/Responser.php`** — 基类构造函数即处理公共逻辑：301/302 转本地重定向、非 200 报错、写回远端 Cookie、识别远端提示页；`getCommonData()` 从远端 DOM 提取用户信息，**未登录时直接 `success('请登录', 'login/index')`**（`$noCheckLogin` 可跳过）；`response()` 提供无自定义解析的通用数据。
- **`app/lib/Proxy.php`** — 唯一的出站 HTTP 出口。负责 GBK↔UTF-8 转换（`site_encoding` / `remote_site_encoding`）、把响应中的 `proxy_domain` 替换为本站域名、透传 Cookie（去掉 `kfCookiePrefix` 前缀后序列化）、`X-Forwarded-For`、附件以 `CURLFile` 从 `TEMP_PATH` 上传并在请求后删除临时文件。
- **`app/common.php`** — TP5 兼容层与全局改写工具，改动风险最高的文件：
  - `url()` 覆盖框架 helper，必须复现 TP5 的 `url_convert`：控制器转小写蛇形、操作转小写（`SelfRate/waitCheck` → `/self_rate/waitcheck`）。模板里大量 `{:url('X/y')}` 依赖此行为。
  - `config()` 兼容扁平标量配置（TP8 原生 `Config::get()` 对无点顶层键要求数组）。
  - `convert_url()` 是远端 PHP 入口 → 本地路由的**唯一映射表**；`convert_to_current_domain_url()` 处理 KF 各备用域名。
  - `replace_common_html_content()` / `replace_floor_content()` 改写楼层内 HTML（链接本地化、`<strike>`→`<s>`、表情/图片/附件标记）。
- **`app/BaseController.php`** — 替代 TP8 已删除的 `think\Controller`，提供 `request`、`fetch()`、`assign()`、`error()`、`success()` 与 `initialize()` 钩子。
- **`app/lib/Cookie.php`** — TP8 没有「按调用指定前缀」语义，此类还原之。项目同时使用 `2ed4e_`（远端 KF 前缀）、`kf_`（本站前缀）、`<uid>_kf_` 与空前缀四种，不要改用 `think\facade\Cookie`。
- **`app/middleware/AjaxResponse.php`** — TP8 按 `Accept` 判断响应类型，旧代码按 `X-Requested-With`。控制器里那 46 处 `if ($request->isAjax()) return $data;` 依赖此中间件把数组转成 JSON。
- **错误处理** — `app/exception/Handle.php`（非调试模式渲染 `Msg/exception` 或 `my.php` 的 `exception_tmpl`，404 统一为「抱歉，您访问的页面不存在~~」）与 `app/initializer/Error.php`（`E_DEPRECATED` 只写 `runtime/log` 不抛异常）。二者在 `app/provider.php` 绑定。

### 前端

`public/static/src/js/app.js` 按 `window.pageId`（即视图的 `body id`）分发各页面初始化逻辑，只做页面增强，核心交互不依赖 JS。`window.Info` 由 `app/view/Public/head.html` 注入（`uid`、`rootPath`、`staticPath`、`urlType`、`cookiePrefix` 等），是前后端的契约。

源码在 `public/static/src/`，产物在 `public/static/dist/`（**已提交**，`static_path = 'static/dist/'`）。`public/static/src/css/*.css` 是 sass 的展开产物（非手写源码），供 45 个视图里的 `{/* 编辑器提示用 */}` 注释引用。

## 需要注意的约定与陷阱

- **编码**：本站 UTF-8，远端 GBK。跨边界（URL 参数、POST 数据、响应体）都要显式转换，`Proxy` 已封装，新增代码不要绕过。
- **`sf` 安全校验参数**：远端阅读页需要 `sf` 才能通过校验，否则报「查看帖子链接不完整，无安全验证」。阅读页的回帖/引用/编辑/多重引用入口必须带上 `$sf`；`sf` 只能从阅读页带入，**不要从回帖页侧栏等区域推断**（会误取无关链接）。
- **常量配置位置**：背景图列表、`kfCookiePrefix`、`userAccountCookieName`、`bgStyleCookieName` 等由 `app/config.php` 的 `const` 段提供，读取方式为 `config('const.xxx')`（模板用 `{$Think.config.const.xxx}`）。TP8 只 glob `config/` 目录加载框架配置，`app/` 下不放按文件名自动加载的配置段。
- **`*.user.js` 必须保持 LF**：运行时用 `/\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i` 解析自定义脚本元信息，`(?:.|\n)` 无法跨越 `\r`，CRLF 会导致回退为默认名。`.gitattributes` 中的 `*.user.js text eol=lf` 是必要契约（本机 `core.autocrlf=true` 会在检出时改回 CRLF），`tools/verify-build.mjs` 会断言它存在。
- **前端兼容门槛**：脚本目标 ES2019，实际门槛由压缩产物中的 `catch {}` 决定，为 Chrome 66 / Firefox 58 / Safari 11.1 / iOS 11.3 / Edge 79。浏览器目标在 `tools/build.mjs` 中以 `BROWSERS` 单点导出，样式前缀由它派生，不要在两处各写一份。**页面不加载任何 polyfill**（原 babel-polyfill 6 已移除）：新增运行时 API 必须确认门槛浏览器原生支持（如 `Object.fromEntries` 需 iOS 12.2+、`Array.prototype.flat` 需 iOS 12+、`Promise.allSettled` 需 iOS 13+，均超出门槛），否则页面会直接报错。
- **依赖与产物交付方式**：`vendor/`、`composer.lock`、`public/static/dist/` 均在版本控制内，以保持「ZIP / git pull 即可部署」。改动前端源码后需重新构建并提交产物。

## OpenSpec 工作流

项目使用 OpenSpec 管理变更（`openspec/` 目录，`.claude/skills/` 与 `.claude/commands/opsx/` 提供 `/opsx:propose`、`/opsx:apply`、`/opsx:archive` 等命令）。进行非平凡改动时，先看 `openspec/changes/` 下是否有对应变更及其 `tasks.md`；文档与提交信息统一用中文。

## 注意事项
Always response in Simplified Chinese.
