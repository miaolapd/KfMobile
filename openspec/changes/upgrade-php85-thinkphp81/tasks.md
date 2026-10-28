# Tasks

## 1. 环境与依赖

- [x] 1.1 在 `D:\Program Files\php-8.5\php.ini` 启用 `extension_dir="ext"` 以及 `curl`、`mbstring`、`openssl` 扩展（GD、fileinfo、zip 不再需要），并把本地 `startWeb.bat` 改为使用 PHP 8.5 的 `php.exe` 启动 `127.0.0.1:8022`；验证：`"D:\Program Files\php-8.5\php.exe" -v` 显示 8.5.12，`-m` 输出包含三个扩展，`netstat -ano | grep 8022` 显示监听。
- [x] 1.2 安装 Composer（使用 PHP 8.5 运行），并确认可访问 Packagist；Composer 解压依赖使用系统 `unzip`（Git Bash 已提供），不为此声明 `ext-zip`（若 Composer 无法调用系统 unzip，可临时启用 `ext-zip`，但不写入项目依赖）；验证：`php composer.phar --version` 与 `php composer.phar diagnose` 正常结束。
- [x] 1.3 重写 `composer.json`：加入 `topthink/framework:^8.1`、`topthink/think-view:^2.0`、`jaeger/phpquery-single:^1.1` 与扩展要求（仅 `curl/mbstring/openssl`，不含 `ext-gd`/`ext-fileinfo`/`ext-zip`），移除 `topthink/think-image`、`topthink/think-installer`、`extra.think-path`，增加 `psr-4: {"app\\": "app/"}`；同时从 `.gitignore` 移除 `composer.lock`。验证：`php composer.phar validate` 通过，`composer.json` 中无 `think-image`/`ext-gd`/`ext-fileinfo`/`ext-zip`。
- [x] 1.4 删除旧 `vendor/` 与 `thinkphp/` 后执行 `composer install`，确认生成 `composer.lock` 与完整 `vendor/`；验证：`php composer.phar check-platform-reqs` 通过，`composer show topthink/framework` 为 8.1.x，`vendor/` 中无 `topthink/think-image`。
- [x] 1.5 更新 README 的“环境要求/源码下载/部署”章节，写入 PHP 8.5、扩展列表（`curl/mbstring/openssl`，不含 GD/fileinfo/zip）、Composer 与“仓库自带 vendor”的说明；验证：按 README 命令可在全新检出目录直接启动，不需要额外 `composer install`。
- [x] 1.6 用 PHP 8.5 对 `vendor/jaeger/phpquery-single/phpQuery.php` 做兼容性验证：`php -l` 通过；用 TP8 式错误处理（`E_ALL`，`E_DEPRECATED` 即抛异常）加载真实 KF 页面，跑一遍应用实际使用的字面选择器（可用 `grep` 提取）与 `find/text/attr/html/val/eq/contents/parent/children/prev/next/is/addClass/removeClass/removeAttr/replaceWith/remove/wrap/wrapInner/prependTo/after/slice/hasClass/foreach`；验证：0 弃用、0 异常。若出现未覆盖路径的致命错误，按设计中的 fork 方案替换 `Callback` 的 `create_function()`。

## 2. 目录重构与启动入口

- [x] 2.1 执行 `git mv application app`，保留控制器、响应类、视图、`lib/` 与 `my*.php`（包括未跟踪的本地 `my.php`），并把 `.gitignore` 中的 `application/my.php` 改为 `app/my.php`；验证：`app/controller/Index.php` 与本地 `app/my.php` 存在且原 `application/` 不再存在，`git status` 显示重命名且 `app/my.php` 仍被忽略。
- [x] 2.2 清理 TP5 遗留文件：删除 `build.php`、`app/command.php`、`app/.htaccess`，把 `tags.php` 改为空的 `app/event.php`，并将 `app/config.php` 精简为纯自定义扁平配置（移除 `app_namespace`、`app_status`、`template`、`dispatch_*_tmpl` 等 TP5 框架键，以及 `game_image_domain`），同时从 `app/extra/const.php` 移除 `thumbMaxWidth`/`thumbMaxHeight`；验证：`grep -rn "think\\\\Controller\|dispatch_success_tmpl\|app_status\|game_image_domain\|thumbMax" app` 无结果，全部 PHP 文件 `php -l` 通过。
- [x] 2.3 新建 `config/app.php`、`config/route.php`、`config/view.php`、`config/cookie.php`、`config/log.php`，写入设计中的键值（`url_common_param=false`、`url_html_suffix=false`、`cookie.prefix='kf_'`、`default_filter=''` 等）；验证：启动后访问页面不出现配置缺失，`config('cookie.prefix')` 返回 `kf_`。
- [x] 2.4 新增 `app/bootstrap.php`：定义 `APP_PATH`、`PUBLIC_PATH`、`TEMP_PATH`、`LOG_PATH`、`DS`、`EXT`（不再定义 `CACHE_PATH`），提供 `kfmobile_boot(App $app)` 扁平加载 `app/config.php` 并应用 `app/my.php` 覆盖与 `App::debug()`；重写 `public/index.php` 使用该引导，最后执行 `$http->run()/send()/end()`；验证：`curl "http://127.0.0.1:8022/index.php?s=/"` 返回首页或登录页且无 500，`my.php` 中使用 `APP_PATH`/`DS` 的配置不再报未定义常量。
- [x] 2.5 确保 `runtime/temp`、`runtime/log` 可按需创建（引导或使用处），不再定义/使用 `CACHE_PATH`；验证：删除这两个目录后访问页面与上传功能仍可自动创建，页面中 `__PUBLIC__` 输出为 `/`。
- [x] 2.6 将根目录 `think` 改为 TP8 控制台入口（先加载 autoload 与 `app/bootstrap.php`，调用 `kfmobile_boot()` 后执行 `$app->console->run()`）；验证：`"D:\Program Files\php-8.5\php.exe" think list` 输出命令列表并以退出码 0 结束。
- [x] 2.7 更新 README 的调试与部署说明：`application/` 改为 `app/`，`my.php` 机制、`runtime/temp` 清理、TP8 的 `optimize:config`/`optimize:route` 命令与回滚说明；验证：文档中的每条命令在本地可原样执行。

## 3. 控制器与兼容层

- [x] 3.1 新增 `app/BaseController.php`，提供 `request`、`initialize()`、`fetch()`、`assign()`、`error()`（委托 `think\facade\View` 与全局 `error()`）；验证：一个继承它的测试控制器能渲染现有视图并触发错误提示。
- [x] 3.2 新增 `app/lib/Cookie.php`，按设计实现带前缀的 `get/set/delete`，并替换 `Base`、`Login`、`Register`、`Responser`、`Proxy`、`common.php` 中的 `think\Cookie` 调用以及控制器里读取背景样式/写入账户 Cookie 的全局 `cookie()` 调用；验证：用临时脚本分别读写 `2ed4e_`、`kf_`、`<uid>_kf_` 与空前缀 Cookie，名称与 TP5 一致，且 `bgStyle` 读取使用 `kf_` 前缀。
- [x] 3.3 改造全部控制器：移除 `think\Controller` 依赖并继承新基类，`Base` 保留登录校验，`Login/Register/Msg` 覆盖各自初始化逻辑；验证：`grep -rn "think\\\\Controller" app` 无结果，未登录访问受保护页面返回登录页。
- [x] 3.4 替换已移除/不兼容 API：`controller('Msg')`、`action('Login/index', ...)`、`App::$debug`、`$this->error()`、`new Redirect($url)` 分别改为容器调用、`app()->isDebug()`、全局 `error()` 与 `redirect($url, $code)`；验证：登录、注册、消息提示与远端 301/302 跳转页面均可正常跳转，Proxy 调试分支使用 `app()->isDebug()`。
- [x] 3.5 补齐未知控制器/操作的处理（路由 miss 或异常处理器映射），保持“抱歉，您访问的页面不存在~~”；验证：访问 `/NoSuchController/index` 与 `/index/noSuchAction` 均显示该提示页。

## 4. 路由与 URL

- [x] 4.1 将 `app/route.php` 迁移为 `route/app.php`，使用 `Route::rule()` 与 `->pattern()` 重现保留的美化路由，`login` 使用 `->completeMatch()`，不再注册 `game/:id`；验证：逐个请求 `/`、`/login`、`/thread/1`、`/read/1`、`/gjc/test`、`/user/uid/1`、`/user/username/test`、`/rank`、`/share`、`/faq/1` 正常响应，`/game/1` 返回应用内错误页而非游戏介绍页。
- [x] 4.2 在 `app/common.php` 实现兼容 `url()`（字符串参数 `parse_str`、控制器转小写蛇形、操作转小写、委托 `Route::buildUrl()`、返回字符串），并确认 `route.php` 配置保持路径式参数；验证：`url('Read/index', 'tid=1&sf=2')` 为 `/read/index/tid/1/sf/2`，`url('SelfRate/waitCheck')` 为 `/self_rate/waitcheck`，`url('GuanJianCi/index')` 为 `/guan_jian_ci/index`，且均不含 `.html`；绝对路径/单段地址不被改写。
- [x] 4.3 验证兼容的控制器/操作路径与数字约束；验证：`/thread/index/fid/1`、`/login/index`、`/profile/show/uid/1` 正常响应，`/read/abc` 不进入阅读页。
- [x] 4.4 验证出站链接的查询参数与锚点保留；验证：用包含 `read.php?tid=1#pid2` 的样例调用 URL 转换后得到本地路径且包含 `#pid2`。
- [x] 4.5 验证 `window.Info` 契约：渲染页面包含 `uid`、`userName`、`verify`、`safeId`、`imgPath`、`rootPath`、`baseFile`、`staticPath`、`urlType`、`urlParam`、`cookiePrefix`、`resTimestamp`，且 `urlType=1`、`baseFile=/index.php`、`cookiePrefix=kf_`；验证：抓取首页 HTML 检查脚本对象字段，并用该对象构造的链接可正常访问。

## 5. 模板渲染

- [x] 5.1 完成 `config/view.php`（`type=Think`、`view_path=app/view`、`view_depr`、`tpl_replace_string`、`default_filter=''`）；验证：渲染页面中的 `__PUBLIC__` 被替换，且已转义内容不再出现二次转义（对比升级前后输出）。
- [x] 5.2 让控制器 `fetch()/assign()` 走 `think\facade\View`，并逐一渲染删除 GameIntro 后保留的全部视图；验证：全部视图无“模板不存在/解析失败”，`php -l` 与页面冒烟通过。
- [x] 5.3 验证 `{$Think.config.*}`、`volist/eq/switch/include/notempty/empty/assign/for` 与 `Think.config.const.bgImageList` 等现有语法；验证：首页、登录页、阅读页、版块页输出包含预期的循环/条件内容。
- [x] 5.4 新增全局中间件 `app\middleware\AjaxResponse` 并在 `app/middleware.php` 注册，把 AJAX 请求下携带数组数据的 HTML 响应转换为 JSON；验证：带 `X-Requested-With: XMLHttpRequest`、不带 `Accept: application/json` 请求 `register/check` 等接口时返回 JSON（含 `type`/`msg`），普通请求仍返回 HTML，成功/错误提示遵循配置等待时间。
- [x] 5.5 补充 README 中关于模板缓存目录（`runtime/temp`）与 `my.php` 中 `exception_tmpl` 兼容性的说明；验证：删除 `runtime/temp` 后页面仍能重新编译并正常显示。

## 6. 代理抓取与 PHP 8.5 清理

- [x] 6.1 修改 `app/lib/Proxy.php`：移除 `CURLOPT_BINARYTRANSFER` 与 `curl_close()`，为 `explode("\r\n\r\n", ...)` 增加分隔符判断，保留 UA/Referer/超时/SSL/转发头行为；验证：`grep` 不再命中两个弃用 API，`/login` 能抓取真实远端页面。
- [x] 6.2 对响应类做空值加固：`trim_strip()`、`convert_url()` 强制字符串，`htmlspecialchars()` 显式传入 `ENT_COMPAT`，覆盖 60 处 `preg_match(...->attr(...)...)` 与 54 处 `trim($pq...)`；验证：`php -l` 全部通过，用缺少可选属性的远端 HTML 样例解析时页面不抛异常，中文/引号输出与升级前一致。
- [x] 6.3 验证编码转换与链接重写：GBK 页面转 UTF-8、`charset=gbk` 改写、中文参数转 GBK、KF 域名与 PHP 入口映射、锚点保留；验证：抓取真实首页后中文不乱码，生成的本地链接可访问。
- [x] 6.4 验证远端状态处理：200 渲染、301/302 本地重定向、超时/5xx/空响应显示“远端连接错误”；验证：用临时本地 HTTP 桩返回 200/302/500/空响应分别请求并检查结果。
- [x] 6.5 验证 Cookie 透传：普通 Cookie 设置、远端删除生效、账户 Cookie 不直接透传、按用户前缀偏好可读回；验证：在临时脚本中模拟 `Set-Cookie` 与请求 Cookie，检查响应头与 `app\lib\Cookie::get()`。
- [x] 6.6 迁移上传处理：`Post::post()`、`Profile::modify()` 使用 `getOriginalExtension/getOriginalName/getOriginalMime` 与 `move(TEMP_PATH, hashName('uniqid'))`；验证：用临时脚本模拟上传对象，检查允许/拒绝扩展名、文件名/MIME 与临时文件清理。
- [x] 6.7 修复主题安全校验参数 `sf` 的传递：阅读页回帖/引用/编辑/多重引用入口带上 `$sf`；回帖页从请求参数读取 `sf` 并用于面包屑主题链接，新增表单隐藏字段 `sf` 以便提交透传；不得从回帖页侧栏等无关区域推断 `sf`。验证：从阅读页进入回帖页后面包屑为 `/read/<tid>/sf/<sf>`，点击可正常打开主题页（对照：不带 `sf` 仍报「查看帖子链接不完整，无安全验证」）；引用/多重引用/编辑入口同样带 `sf`，表单提交含该字段；无 `sf` 请求时按无参数生成链接。

## 7. 移除游戏介绍（GameIntro）功能

- [x] 7.1 删除 GameIntro 服务端代码：`app/controller/GameIntro.php`、`app/responser/GameIntro.php`、`app/view/GameIntro/` 全部模板、`route/app.php` 的 `game/:id`、`app/common.php::convert_url()` 中 5 个 `g_intro*.php` 映射、`app/responser/Responser.php` 的 `g_intro_` Cookie 分支；验证：`grep -rn "GameIntro\|g_intro" app route` 无结果，`/game/1` 返回应用内错误页。
- [x] 7.2 删除缩略图与依赖：`app/common.php::make_thumb()`、`game_image_domain`、`const.thumbMaxWidth/thumbMaxHeight`、`CACHE_PATH`、`composer.json` 中的 `topthink/think-image` 与 `ext-gd`；验证：`grep -rn "make_thumb\|think\\\\Image\|imagedestroy\|CACHE_PATH\|game_image_domain\|thumbMax" app composer.json config route` 无结果，`composer validate` 通过。
- [x] 7.3 删除前端源码入口：`public/static/src/js/app.js` 中 `gameIntro*Page` 分支、`public/static/src/js/module/other.js` 中 `handleGameIntroSearchArea()`/`tuiGame()` 与 `g_intro_*` cookie 名；不重新构建 `public/static/dist/`。验证：`grep -rn "GameIntro\|g_intro\|gameIntro" public/static/src/js` 无结果，现有页面加载无 JS 报错。
- [x] 7.4 在 README 升级说明中标注游戏介绍功能已废弃、`/game/:id` 进入错误页、`g_intro*.php` 链接不再重写；验证：文档描述与 7.1 的实际行为一致。

## 8. 错误处理与弃用策略

- [x] 8.1 新增 `app/exception/Handle.php` 与 `app/initializer/Error.php`，并在 `app/provider.php` 绑定；验证：未捕获异常显示 `Msg/exception`（或 `my.php` 指定的 `exception_tmpl`），调试模式显示 TP8 调试页。
- [x] 8.2 实现弃用非致命：`E_DEPRECATED`/`E_USER_DEPRECATED` 写日志但不抛异常，其他错误仍抛异常；验证：临时触发一个 `trigger_error(..., E_USER_DEPRECATED)` 的请求返回 200 且日志出现记录，触发 `E_USER_WARNING` 时进入错误处理。
- [x] 8.3 清除已知 PHP 8.5 弃用调用并回归；验证：`grep -rn "curl_close\|CURLOPT_BINARYTRANSFER\|imagedestroy" app` 无结果，连续访问主要页面后 `runtime/log` 无新的致命错误。
- [x] 8.4 在 README 记录弃用处理策略与日志位置；验证：文档描述与 `config/log.php` 实际路径一致。

## 9. 集成验收

- [x] 9.1 新增 `tools/smoke.php`（CLI、无框架依赖、不含凭据、不执行写操作），并做全量静态检查：对 `app/`、`config/`、`route/`、`public/`、`tools/` 下所有 PHP 文件执行 `php -l`，运行 `composer validate` 与 `composer check-platform-reqs`；验证：脚本存在且 lint 通过，全部检查无语法错误或平台缺失。
- [x] 9.2 以 PHP 8.5 启动 `127.0.0.1:8022` 并加载 nginx `mtest.miaola.work:8021`，运行 `tools/smoke.php`（接受基础 URL，检查保留路由、`/game/1` 错误页、响应中无 PHP 致命错误，并断言 URL 归一化示例）；验证：脚本退出码 0，无 500，登录页/错误页/静态资源正常。
- [x] 9.3 使用本地测试账号（见 `vps/kf-test-account.txt`，该目录已被 `.gitignore` 忽略，凭据不得写入仓库文档）在浏览器验证**只读**行为：登录、登出、受保护页面、Cookie 持久化与跨页面跳转；验证：登录后可访问首页/版块/主题/消息，登出后再次要求登录，全程不产生任何发帖、回复、消息或上传。
- [x] 9.4 真实账号写操作确认门禁：在执行任何发帖、回复、发消息、上传附件或修改头像之前，必须先向用户说明具体动作（目标版块/主题、标题与正文、附件文件、头像文件、预期公开范围与清理方式），并获得用户明确确认；未获确认时 MUST NOT 执行写操作。验证：确认记录与将要执行的动作一一对应，默认流程无任何写请求。
- [ ] 9.5 仅在 9.4 获得确认后，验证发帖附件与头像上传：使用事先确认的测试内容，验证远端帖子带附件、头像更新成功；验证：操作完成后按确认的清理方式恢复头像或删除测试帖（若远端允许），并记录结果。（用户于 2026-10-26 决定暂不执行，后续另行确认）
- [x] 9.6 检查最终变更集：`thinkphp/`、GameIntro 相关文件与 `think-image` 已删除，`composer.lock` 与 `vendor/` 已纳入，`application/` 已重命名，README 与实际命令一致；验证：`git status` 与 `git ls-files` 符合预期，全新检出可启动。

## Workflow follow-up

- 生产部署（PHP-FPM 切换 8.5、`vps/` 脚本、生产 nginx）后续单独处理，不阻塞本次 apply/archive。
- 完成实现与验收后，按项目评审要求归档本 change。
- 归档后检查 `openspec/specs/` 下的 `platform/runtime`、`proxy/remote-page-proxy`、`web/url-and-template-contract` 内容完整且 Purpose 正确。
