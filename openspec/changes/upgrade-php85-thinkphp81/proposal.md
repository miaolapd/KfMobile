# Proposal

## Why

KfMobile 目前固定在 PHP 5.6～7.1 与随仓库内置的 ThinkPHP 5.0.23 上，而 PHP 5.6/7.x 与 TP5 均已停止维护；本地已提供 PHP 8.5.12，继续停留在旧栈会阻塞安全更新与新环境部署。需要将运行环境迁移到 PHP 8.5 + ThinkPHP 8.1，同时保证反向代理服务对最终用户的行为（除已废弃的游戏介绍外）不变。原站点的游戏介绍入口已返回 404、功能不可用，可在本次升级中一并移除，从而去掉 `think-image` 与 GD 依赖。

## What Changes

- **BREAKING**：运行环境要求由 PHP 5.6～7.1 改为 PHP 8.5（TP8.1 的最低要求为 8.0，本项目以 8.5 为验证目标），并启用 `curl`、`mbstring`、`openssl`、`fileinfo` 扩展。
- **BREAKING**：框架由仓库内置的 `thinkphp/`（ThinkPHP 5.0.23）替换为 Composer 管理的 `topthink/framework:^8.1`；删除 `thinkphp/` 目录，应用代码目录由 `application/` 重命名为 `app/`。
- **BREAKING**：移除已不可用的游戏介绍（GameIntro）功能：删除对应控制器、响应类、视图、路由、`g_intro*.php` 链接映射、缩略图生成与前端入口；`/game/:id` 等入口改为应用内错误页。
- 依赖调整：`jaeger/phpquery-single` 由 0.9.7 升级到 `^1.1`；引入 `topthink/think-view:^2.0`（含 `topthink/think-template`）；移除 `topthink/think-image`，不再需要 GD 扩展。
- 按 TP8 结构重建启动与控制台入口：`public/index.php`、`think`、`app/provider.php`、`config/`、`route/`；保留 `my.php` 本地配置覆盖机制与现有 nginx `?s=` 重写方式。
- 提供 TP8 兼容层：控制器基类（初始化、视图渲染、错误跳转）、带前缀语义的 Cookie 封装、`url()` 字符串参数兼容并保持 TP5 的小写/蛇形控制器格式、`debug()` 计时函数，替换已移除的 `think\Controller`、`controller()`、`action()`、`App::$debug` 等 API。
- 新增不依赖框架的最小冒烟脚本 `tools/smoke.php`，用于升级验收与后续回归；不引入 PHPUnit 等测试框架。
- 迁移模板引擎到 `think-view` + `think-template`，保持现有视图文件、`{$Think.config.*}`、标签库与 `__PUBLIC__` 替换行为；配置键继续以扁平方式可读（`config('site_name')`）。
- 迁移上传处理到 TP8 的 `UploadedFile` API（扩展名校验、原始文件名/MIME、`move()`/`hashName()`）。
- 清除 PHP 8.5 已弃用调用（如 `curl_close()`、`CURLOPT_BINARYTRANSFER`），并对 `attr()` 可能返回 `null` 的字符串/正则调用做空值加固。
- 弃用（E_DEPRECATED）策略：记录到日志但不转成异常；其他警告/错误维持 TP8 默认的异常处理，避免远端页面轻微变化导致整页 500。
- 依赖交付方式：升级后提交 `composer.lock` 与安装完成的 `vendor/`，保持“下载 ZIP / git pull 即可运行”的现有部署习惯。

## Capabilities

### New Capabilities

- `platform/runtime`: PHP 8.5 + ThinkPHP 8.1 的运行要求、扩展依赖、Composer 启动入口、配置覆盖与弃用处理策略。
- `proxy/remote-page-proxy`: 对 KF 远端的代理抓取、编码转换、URL 重写、登录校验、Cookie 透传与附件上传转发。
- `web/url-and-template-contract`: 入站路由兼容、出站 URL 生成格式、模板渲染、已废弃入口的处理与页面注入的客户端 `window.Info` 契约。

### Modified Capabilities

无（项目当前没有已归档的 specs）。

## Impact

- 应用代码：`application/` 下全部控制器、响应类、公共函数、视图与路由；目录迁移为 `app/`；删除 GameIntro 相关控制器、响应类与 8 个视图。
- 配置：`application/config.php` 拆分为 `config/*.php`，自定义配置保持扁平键；删除 `game_image_domain` 与缩略图尺寸常量；`my.php` / `my.debug.php` / `my.product.php` 机制保留。
- 依赖与构建：`composer.json`、新增 `composer.lock`、`vendor/` 全量更新、删除 `thinkphp/`、更新 `think` 控制台入口；`build.php` 等 TP5 遗留文件移除。
- 运行环境：PHP 8.5 `php.ini` 启用 `curl/mbstring/openssl`；本地 `startWeb.bat` 改用 PHP 8.5 并监听 8022；README 环境要求、调试与部署说明同步更新。
- 部署范围：本次只完成仓库内升级与本地冒烟；生产 PHP-FPM 切换到 8.5、`vps/` 部署脚本与生产 nginx 配置后续单独处理。
- 外部行为：URL 形式、页面输出、Cookie 名称与前缀、登录跳转与上传接口保持兼容；游戏介绍入口 `/game/:id` 不再提供并进入应用内错误页，远端页面中的 `g_intro*.php` 链接不再重写；除此之外不新增用户可见功能。
