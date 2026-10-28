# Design

## Context

当前仓库是完整的 ThinkPHP 5.0.23 应用：框架源码直接提交在 `thinkphp/`，应用在 `application/`，`vendor/` 只提交了部分依赖（phpQuery 0.9.7、think-image 1.0.7、think-installer）。生产与本地都通过 nginx 把 `index.php?s=<path>` 交给 PHP 处理，URL 生成使用路径式参数（`url_common_param=false`），页面依赖 `PUBLIC_PATH`、`TEMP_PATH`、`CACHE_PATH`、`DS` 等 TP5 常量。目标环境为 PHP 8.5.12（本机 `D:\Program Files\php-8.5`）。

升级中已确认的硬性事实：

- 现有 `jaeger/phpquery-single:0.9.7` 在 PHP 8.5 下直接语法错误（`phpQuery.php:2157` 使用 `$param{0}`），且大量使用已移除的 `create_function()`；必须换成 1.1.1（lint 通过，已在真实 KF 首页上验证选择器与文本抓取正常）。
- `topthink/think-image:1.0.8` 仍调用 PHP 8.5 已弃用的 `imagedestroy()`；TP8 默认会把 `E_DEPRECATED` 转异常。该项目内唯一使用点是 GameIntro 缩略图，而上游 `g_intro_index.php` 已返回 404，功能不可用，因此决定整体移除 GameIntro 而不是替换 `think-image`。
- `App::$debug`、`think\Controller`、`controller()`、`action()` 在 TP8 中不存在；`think\Cookie` 的“按调用指定前缀”语义在 TP8 中也不存在。
- TP8 的 `url()` 只接受数组参数，而现有代码与模板存在大量字符串参数调用。
- TP8 的 `think-template` 默认 `default_filter=htmlentities`，而 TP5 模板默认不转义；若不显式关闭会改变页面输出。
- nginx 的 `rewrite ... /index.php?s=$1` 与 TP8 的 `varPathinfo='s'` 兼容，无需改动站点配置。
- 本机 PHP 8.5 的 `php.ini` 中 `curl`、`mbstring`、`gd`、`openssl`、`fileinfo`、`zip` 全部被注释，Composer 也不在 PATH 中。

## Goals / Non-Goals

**Goals:**

- 在 PHP 8.5.12 上无语法错误、无致命弃用错误地运行整个站点。
- 使用 Composer 安装并锁定 ThinkPHP 8.1.x 及模板/解析依赖，删除内置 `thinkphp/`。
- 用最少的兼容层保持现有控制器、响应类、视图、URL、Cookie 与上传行为。
- 保持 `my.php` 本地覆盖与“仓库自带 vendor”的部署方式。
- 对弃用采取“记录但不致命”的策略，避免远端 HTML 轻微变化导致 500。

**Non-Goals:**

- 不重构反向代理抓取逻辑，不改变页面 HTML 结构、样式或前端 `static/` 构建流程。
- 不引入数据库、队列、缓存中间件或新的用户可见功能。
- 不升级前端依赖（gulp/node_modules）。
- 不改动 nginx 站点配置的代理规则（仅本地验证时启动 PHP 8.5 服务）。

## Decisions

### 1. 目录与命名空间：`application/` → `app/`

采用 TP8 标准布局：

```
app/            # 原 application/，命名空间仍为 app\
  controller/  responser/  lib/  view/
  common.php   config.php  my.php  my.debug.php  my.product.php
  provider.php event.php
config/         # app.php route.php view.php cookie.php log.php
route/app.php
public/index.php
think
vendor/
```

- `composer.json` 增加 `"autoload": {"psr-4": {"app\\": "app/"}}`。
- 视图默认路径 `app/view` 由 TP8 的 view 驱动自动识别，无需 `setAppPath()` 等非常规设置。
- 备选方案：保留 `application/` 并用 `setAppPath()`/自定义 psr-4。被否决：需要额外覆盖 `getBasePath()`、view、route 路径，偏离框架约定，长期维护成本更高。

### 2. 依赖组合

```json
{
  "require": {
    "php": ">=8.1",
    "ext-curl": "*",
    "ext-mbstring": "*",
    "ext-openssl": "*",
    "topthink/framework": "^8.1",
    "topthink/think-view": "^2.0",
    "jaeger/phpquery-single": "^1.1"
  }
}
```

- 移除 `topthink/think-image`、`topthink/think-installer` 与 `extra.think-path`；GameIntro 移除后不再需要 `ext-gd`。
- 不声明 `ext-fileinfo`/`ext-zip`：应用运行时不使用；Composer 安装阶段使用系统 `unzip`（本机 Git Bash 已提供），避免把开发期工具依赖变成生产要求。
- `think-view:^2.0.5` 引入 `think-template:^3.0.2`，两者在 PHP 8.5 下已完成渲染冒烟验证。
- phpQuery 1.1.1 保留单文件 classmap 方式。已在 PHP 8.5.12 下用“TP8 式错误处理”（`E_ALL`，含 `E_DEPRECATED` 即抛异常）验证：phpQuery.php `php -l` 通过；应用实际使用的 270 个字面选择器、30 个伪类选择器与 `find/text/attr/html/val/eq/contents/parent/children/prev/next/is/addClass/removeClass/removeAttr/replaceWith/remove/wrap/wrapInner/prependTo/after/slice/hasClass/foreach` 全部执行通过，0 弃用、0 异常；1.1.1 已为 `Iterator/Countable/ArrayAccess` 方法添加 `#[ReturnTypeWillChange]`。残留的 `create_function()` 只存在于 `Callback` 类，应用未使用该类（选择器内部也不会实例化它），属于已知死代码风险。
- 备选方案：自行 fork/patch phpQuery 0.9.7。被否决：改动面更大且仍需处理 `create_function()`；1.1.1 是同一作者维护线，API 兼容。
- 备选方案：用 `symfony/dom-crawler` 等替换 phpQuery。被否决：30+ 响应类、数百处选择器需要重写，风险远高于收益。

### 3. 启动、配置分层与 `my.php`

新增 `app/bootstrap.php`，由 `public/index.php` 与命令行入口 `think` 在最前面 `require`：

```php
// 兼容常量（CLI 下 PUBLIC_PATH 为 /）
define('APP_PATH', __DIR__ . DIRECTORY_SEPARATOR);
define('PUBLIC_PATH', /* HTTP: SCRIPT_NAME 目录；CLI: '/' */);
define('TEMP_PATH', dirname(__DIR__) . '/runtime/temp' . DIRECTORY_SEPARATOR);
define('LOG_PATH', dirname(__DIR__) . '/runtime/log' . DIRECTORY_SEPARATOR);
defined('DS') || define('DS', DIRECTORY_SEPARATOR);
defined('EXT') || define('EXT', '.php');

function kfmobile_boot(\think\App $app): void
{
    // 扁平自定义配置（app_debug、url_common_param、default_*、proxy_domain、site_name、const.* 等）
    $app->config->load($app->getAppPath() . 'config.php', '');
    // 本地/生产覆盖，保持 my.php 机制
    $file = $app->getAppPath() . 'my.php';
    if (is_file($file) && is_array($override = include $file)) {
        $app->config->set($override);
        if (!empty($override['app_debug'])) {
            $app->debug(true);
        }
    }
}
```

`public/index.php`：

```php
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../app/bootstrap.php';

$app = new \think\App();
kfmobile_boot($app);

$http = $app->http;
$response = $http->run();
$response->send();
$http->end($response);
```

`think` 同样先 require bootstrap 并调用 `kfmobile_boot($app)`，保证控制台也能读到自定义配置与常量。

- `Config::load($file, '')` 会把数组按扁平键合并，因此 96 处 `config('xxx')` 与 49 个视图里的 `{$Think.config.xxx}` 全部无需改写。自定义配置需保留 `app_debug`、`url_common_param`（Responser 的 `urlType` 依赖它）、`default_ajax_return`、`default_return_type` 等被代码直接读取的键。
- 实施时发现 TP8 `Config::get()` 对无点顶层键要求值为数组，扁平标量配置会抛 `TypeError`。因此在 `app/common.php` 提供 TP5 语义的 `config()` 兼容函数（扁平键、点号路径、设置、`?key` 存在性）；核心 helper 的 `function_exists` 守卫保证应用定义生效。
- cli-server 兼容：PHP 内置服务器请求 `/` 或 `/index.php` 时不提供 `s`/`PATH_INFO`，TP8 会把 `index.php` 当作 pathinfo 解析并返回 404。`app/bootstrap.php` 在 `PHP_SAPI === 'cli-server'` 且无 `s`/`PATH_INFO` 时补 `$_GET['s'] = '/'`；生产 PHP-FPM 不触发该分支。
- 常量必须在加载 `app/config.php` 与 `app/my.php` 之前定义，因为现有 `my.php`/`my.product.php` 会用 `APP_PATH`、`DS` 计算 `exception_tmpl`；若放到 `app/common.php`（App 初始化时才加载）会因常量未定义而报错。
- 备选方案：把自定义配置迁到 `config/kf.php` 并改为 `config('kf.xxx')`。被否决：需要同步修改大量 PHP 与模板，且容易漏改。
- 框架配置拆分为 `config/app.php`（时区 Asia/Shanghai）、`config/route.php`（`url_common_param=false`、`url_html_suffix=false`、`url_route_must=false`、`pathinfo_depr='/'`）、`config/view.php`、`config/cookie.php`（`prefix='kf_'`）、`config/log.php`。
- `app/provider.php` 绑定自定义异常处理器与错误初始化器。

### 4. 兼容层

**控制器基类**：新增 `app\BaseController`（替代 `think\Controller`），提供：

- 构造时注入当前 `request()`，供现有 `$this->request` 调用。
- `fetch()` / `assign()`：转发到 `think\facade\View`。
- `error()`：转发到现有全局 `error()`。
- `initialize()` 钩子，由构造函数调用；`app\controller\Base` 覆盖它实现关闭站点、登录校验与背景样式，`Login/Register/Msg` 直接继承基类并覆盖各自的初始化逻辑。

**移除的 helper**：

- `controller('Msg')`（3 处）与 `action('Login/index', ...)`（2 处）改为容器调用：`app(\app\controller\Msg::class)`、`app(\app\controller\Login::class)->index(false, request()->url())`。
- `App::$debug` 改为 `app()->isDebug()`。
- `Msg::redirectUrl()` 中 `new Redirect($url)` 在 TP8 会因构造函数依赖注入而失败，改为 `redirect($url, $code)` helper（或 `Response::create($url, 'redirect', $code)`）。

**`debug()` 计时函数**：在 `app/common.php` 实现与 TP5 兼容的命名打点（`debug('begin')`、`debug('begin','end')` 返回秒数），供 287 处调用继续使用；底层用静态数组记录微秒时间戳。

**Cookie 前缀兼容**：新增 `app\lib\Cookie`，以静态方法模拟 TP5 语义：

- `get($name='', $prefix=null)`：`null` 使用 `cookie.prefix`，`''` 表示原始 Cookie 名；空名称按前缀筛选并返回原始 Cookie 键（不剥离前缀，Proxy 用空前缀获取全部）。
- `set($name, $value, $option)`：把 `prefix` 拼到真实 Cookie 名上，转换 `httponly/secure` 为布尔值后写入 TP8 Cookie 管理器。
- `delete($name, $prefix=null)`：按同样规则删除。
- 读取通过 `request()->cookie()`，写入通过 `app('cookie')`，保证响应阶段正常落盘。
- `Base`/`Msg` 读取背景样式、`Login`/`Register` 写入账户 Cookie 时一并改用该封装；TP8 的全局 `cookie()` 不应用默认前缀，直接沿用会与原行为不一致。
- 备选方案：直接使用 `think\facade\Cookie`。被否决：TP8 不再支持按调用传入前缀，而本项目同时使用 `2ed4e_`、`kf_`、`<uid>_kf_` 和空前缀。

**`url()` 兼容**：在 `app/common.php` 定义 `url()`。TP8 核心 helper 用 `function_exists('url')` 守卫，因此应用内的定义会生效。实现为：

```php
function url(string $url = '', array|string $vars = [], $suffix = true, $domain = false): string
{
    if (is_string($vars)) {
        parse_str($vars, $vars);
    }
    // 保持 TP5 url_convert=true 的格式：控制器小写蛇形、操作全小写
    if ($url !== '' && !str_starts_with($url, '/') && !str_contains($url, '://')) {
        $parts = parse_url($url);
        $segments = explode('/', $parts['path'] ?? '');
        if (count($segments) === 2) {
            $segments[0] = \think\helper\Str::snake($segments[0]);
            $segments[1] = strtolower($segments[1]);
            $url = implode('/', $segments)
                . (isset($parts['query']) ? '?' . $parts['query'] : '')
                . (isset($parts['fragment']) ? '#' . $parts['fragment'] : '');
        }
    }
    return (string) \think\facade\Route::buildUrl($url, $vars)->suffix($suffix)->domain($domain);
}
```

配合 `url_common_param=false` 保持 `/控制器/操作/名/值` 格式，并复现 TP5 的 `url_convert`：`SelfRate/waitCheck` → `/self_rate/waitcheck`、`GuanJianCi/index` → `/guan_jian_ci/index`。该行为已核对 TP5 源码 `thinkphp/library/think/Url.php::parseUrl()` 与 `Loader::parseName()`：`url_convert=true` 时控制器转小写蛇形、操作转小写。模板中的 `{:url('X/y', 'a=b')}` 因此无需修改。备选方案是改写全部调用点与模板，被否决：改动面大且容易遗漏锚点/字符串参数。

**路由**：`application/route.php` 转为 `route/app.php`，使用 `Route::rule()` + `->pattern([...])`。原 `'login$'` 在 TP8 中会被当作普通静态字符串，必须改为 `Route::rule('login', 'Login/index')->completeMatch()`；其余规则保持不完全匹配，与原 `route_complete_match=false` 一致。

### 5. 视图层

`config/view.php` 关键项：

```php
return [
    'type' => 'Think',
    'view_path' => app_path() . 'view' . DIRECTORY_SEPARATOR,
    'view_suffix' => 'html',
    'view_depr' => DIRECTORY_SEPARATOR,
    'tpl_begin' => '{', 'tpl_end' => '}',
    'taglib_begin' => '{', 'taglib_end' => '}',
    'tpl_replace_string' => ['__PUBLIC__' => PUBLIC_PATH],
    'default_filter' => '',   // 保持 TP5 的“不自动转义”输出
];
```

- `default_filter` 必须显式设为空串；否则 think-template 会自动 `htmlentities`，导致已转义的数据被二次转义。
- 所有保留的 `fetch('Controller/action', $data)` 调用继续有效；`think-view` 在模板名包含分隔符时不会追加当前控制器前缀。
- 视图中的 `{$Think.config.*}`、`volist`、`eq`、`switch`、`include` 等语法已用 `think-template:3.0.2`（注册 think-view 的 `$Think` 扩展后）对现有模板逐一渲染验证；GameIntro 视图已随功能删除。
- **AJAX 数组响应**：TP5 的自动响应依据 `X-Requested-With`（`default_ajax_return=json`），而 TP8 依据 `Accept` 是否包含 `json`；现有 46 处 `if ($request->isAjax()) return $data;` 在 jQuery 未指定 `dataType` 时会退化为 HTML 响应并因数组数据抛错。新增全局中间件 `app\middleware\AjaxResponse`（在 `app/middleware.php` 注册）：当请求为 AJAX、响应为 `think\response\Html` 且原始数据为数组时，改用 `json($data)` 返回，并保留状态码。这样无需逐处修改控制器，也兼容未来的新增页面。

### 6. 代理抓取与 PHP 8.5 清理

- `Proxy.php` 删除 `CURLOPT_BINARYTRANSFER`（8.4 起访问即弃用，且自 5.1.2 起无效果）与 `curl_close()`（8.5 起弃用，句柄自动释放）；`CURLOPT_SAFE_UPLOAD` 保留。
- 对 `explode("\r\n\r\n", $result, 2)` 增加分隔符存在性判断，避免 curl 返回异常格式时产生未定义下标异常。
- `getResponseCookies()` 保持原逻辑。
- 所有 `trim()`、`htmlspecialchars()`、`preg_match()` 接收 phpQuery `attr()` 结果的路径做空值加固：`trim_strip()` 内部强制 `(string)`；对可能缺失的属性统一转换为字符串。此部分优先覆盖 60 处 `preg_match(...->attr(...)...)` 与 54 处 `trim($pq...)`。
- PHP 8.1 起 `htmlspecialchars()`/`htmlentities()` 的默认 flags 变为 `ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401`，会开始转义单引号。`trim_strip()`、`Responser\Message`、`Responser\Post` 中显式传入 `ENT_COMPAT` 以保持升级前的转义范围；模板中的 `|htmlspecialchars` 即使多转义单引号也不影响页面正确性。
- phpQuery 的解析调用本身放在 `try/catch` 中，保持原错误处理。

**主题安全校验参数 `sf` 的传递**：远端阅读页需要 `sf` 才能通过安全校验，否则显示「查看帖子链接不完整，无安全验证」。`Responser\Read` 已从分页链接提取 `sf`，但阅读页的回帖/引用/编辑/多重引用入口此前未携带，且远端回帖页本身不提供该参数（表单隐藏字段与表单内导航链接均不含，`sf` 只出现在侧栏「最新主题帖」等同 tid 的无关链接中）。因此：

- 阅读页四处入口（回帖、引用、编辑、多重引用）在生成的 URL 中带上 `$sf`。
- 回帖页 `Responser\Post` 从**当前请求参数**读取 `sf`，用于面包屑主题链接与响应数据，并新增表单隐藏字段 `sf` 以便提交时透传。
- 实施中曾尝试从回帖页 DOM 搜索同 tid 的 `sf` 链接，经确认为不可靠做法（会误取侧栏无关链接），已移除并改为仅在缺少参数时按无 `sf` 处理。
- 编辑入口的父级导航在远端即为版块，因此其面包屑指向 `/thread/{fid}`，无需 `sf`，属预期行为。

### 7. 移除 GameIntro 功能（替代 think-image 适配）

上游 `g_intro_index.php` 当前返回 404，游戏介绍功能已不可用；移除整个功能比继续适配 `think-image` 更简单，也消除了 GD 依赖与动画 GIF 行为差异。删除范围：

- 控制器与响应类：`app/controller/GameIntro.php`、`app/responser/GameIntro.php`。
- 视图：`app/view/GameIntro/` 下全部 8 个模板（index/game/company/type/property/moon/search/searchArea）。
- 路由与链接：`route/app.php` 中的 `game/:id`；`app/common.php::convert_url()` 中 `g_intro_index.php`、`g_intro.php`、`g_intro_inc.php`、`g_intro_adv.php`、`g_intro_moe.php` 的映射（不再重写，旧链接交由远端 404）。
- 缩略图链路：`app/common.php::make_thumb()`、`app/controller/GameIntro::thumb()`、`config('game_image_domain')`、`const.thumbMaxWidth/thumbMaxHeight`、`CACHE_PATH`（移除后无其它使用点）。
- Cookie 特例：`app/responser/Responser.php` 中 `g_intro_` 前缀 Cookie 的 48 小时有效期分支。
- 前端源码：`public/static/src/js/app.js` 中的 `gameIntro*Page` 分支与 `public/static/src/js/module/other.js` 中的 `handleGameIntroSearchArea()`、`tuiGame()` 及相关 cookie 名；`public/static/dist/` 不重新构建（页面已不存在，旧包中的死代码无入口，后续构建时自然消失）。
- 依赖：移除 `topthink/think-image` 与 `ext-gd`。

外部行为：`/game/:id` 不再匹配路由，按默认分发进入不存在的控制器，由统一 404 错误页处理；远端页面中的 `g_intro*.php` 链接不再被改写为本地地址。

- 备选方案：保留 GameIntro 代码但将 `make_thumb()` 换成 GD 实现。被否决：上游已 404，保留的页面不可用，还继续背负 GD 与图片处理维护成本。
- 备选方案：仅删除缩略图接口、保留其余 GameIntro 页面。被否决：所有 GameIntro 页面都依赖已 404 的上游接口，无法工作。

### 8. 上传 API 迁移

`Post::post()` 与 `Profile::modify()` 从 TP5 `File` API 迁移：

| TP5 | TP8 |
| --- | --- |
| `$file->checkExt([...])` | `in_array(strtolower($file->getOriginalExtension()), [...])` |
| `$file->getInfo('name')` | `$file->getOriginalName()` |
| `$file->getInfo('type')` | `$file->getOriginalMime()` |
| `$file->rule('uniqid')->move(TEMP_PATH)` | `$file->move(TEMP_PATH, $file->hashName('uniqid'))` |
| `$info->getFilename()` | 同上返回值仍为 `File` 对象，`getFilename()` 可用 |

TP5 的 `rule('uniqid')` 会生成 `uniqid().扩展名`，与 `hashName('uniqid')` 一致；临时文件仍由 `Proxy` 在请求结束后删除。

### 9. 错误处理与弃用策略

- `app/exception/Handle` 继承 `think\exception\Handle`：
  - `HttpResponseException` 直接返回其响应；404（含控制器/操作不存在）输出“抱歉，您访问的页面不存在~~”；其他 `HttpException` 交给父类。
  - 非调试模式下优先使用 `config('exception_tmpl')`（兼容 `vps/my.php` 与 `my.product.php`），以 `include` + 输出缓冲渲染，注入 `$message`；未配置时渲染 `Msg/exception`。
  - 其他异常按 `config('show_error_msg')` 决定显示原始消息还是 `config('error_message')`。
- `app/initializer/Error` 继承 `think\initializer\Error`，仅重写 `appError()`：当错误为 `E_DEPRECATED`/`E_USER_DEPRECATED` 时写日志后返回，不抛异常；其他错误调用父类。`@` 抑制的错误仍被忽略。写日志放在 `try/catch` 中，避免极早期日志服务未就绪时再次抛错。
- `app/provider.php` 绑定：

```php
return [
    'think\exception\Handle'    => app\exception\Handle::class,
    'think\initializer\Error'   => app\initializer\Error::class,
];
```

- 备选方案：全局把 `error_reporting` 改成 `E_ALL & ~E_DEPRECATED`。被否决：无法区分来源、也不便记录；自定义初始化器更可控。
- 同时仍会修复已知弃用点，避免依赖“非致命”策略掩盖真实问题。

### 10. 依赖交付与本地环境

- 按用户决定：`composer.lock` 纳入版本控制（从 `.gitignore` 移除），`vendor/` 安装后提交。
- 删除 `thinkphp/` 全部受控文件；`build.php`（TP5 构建配置）删除；`think` 改为 TP8 控制台入口。
- 本机 `D:\Program Files\php-8.5\php.ini` 启用 `extension_dir="ext"` 及 `curl/mbstring/openssl`（GD、fileinfo、zip 均不再作为应用依赖）；本地 `startWeb.bat`（未跟踪）改用 PHP 8.5 的 `php.exe` 启动 `127.0.0.1:8022`，与 nginx `mtest.miaola.work` 站点中的 `proxy_pass http://mtest.miaola.work:8022` 保持一致。Composer 安装阶段使用系统 `unzip` 解压依赖。
- README 更新环境要求（PHP 8.5、扩展列表）、调试/部署步骤（删除 `my.php`、清理 `runtime/temp`、TP8 optimize 命令）与目录说明。
- 提交最小冒烟脚本 `tools/smoke.php`（CLI，无框架依赖），接受基础 URL 作为参数，检查保留路由、可选的只读 Cookie、`/game/1` 错误页以及响应中无 PHP 致命错误；不包含账号凭据、不执行写操作。不引入 PHPUnit。
- 验收用 KF 测试账号仅存放在本地被忽略的 `vps/kf-test-account.txt`，README、OpenSpec 文档与提交信息只引用该路径，不记录明文凭据；若凭据曾出现在可共享的记录中，验收完成后应更换密码。
- 真实账号验收默认只读。任何写操作（发帖、回复、发消息、上传附件、修改头像）都必须逐项获得用户明确确认；执行前说明目标版块/主题、内容、文件、公开范围与清理方式，未确认不得执行。

## Risks / Trade-offs

- **`url()` 覆盖框架 helper**：TP8 内部若按对象方式使用 `url()` 可能不兼容 → 返回字符串并只依赖其字符串转换；用例集中在应用与模板，验证所有页面链接格式。
- **模板输出二次转义**：think-template 默认过滤器不同 → 配置 `default_filter=''`，并对代表性页面做输出对比。
- **Cookie 前缀语义偏差**：TP8 无前缀概念 → 用独立兼容类集中处理，覆盖 `2ed4e_`、`kf_`、`<uid>_kf_` 与空前缀四类用例。
- **URL 归一化逻辑**：`url()` 兼容层需把控制器转为小写蛇形、操作转为小写，同时不能误改单段地址、绝对路径、查询串、锚点或参数值 → 用 `parse_url` 拆分后只处理两段的 `控制器/操作` 形式，并在冒烟脚本中断言 `SelfRate/waitCheck`、`GuanJianCi/index` 等输出。
- **phpQuery 1.1.1 并非上游正式声明支持 PHP 8.5**（其 composer.json 仍写 PHP >=5.3），且仍保留未使用的 `create_function()` → 以本次验证覆盖“KfMobile 实际使用的选择器与方法”为准；遗留的 `Callback` 类不可使用。若后续页面触发未覆盖路径的弃用/致命错误，回退方案是 fork 1.1.1：把 `Callback` 的 `create_function()` 改为闭包并纳入仓库，而不是回退到 0.9.7（0.9.7 在 PHP 8.5 下无法解析）。
- **游戏介绍入口被移除**：外部书签或远端页面中残留的 `g_intro*.php` 链接将失效（远端本身已 404）→ 在 README 升级说明中标注该功能已废弃；`/game/:id` 由统一错误页承接。
- **前端 `dist/` 保留旧死代码**：只删除 JS 源码入口、不重新构建 → 页面已无对应 DOM，旧代码不会执行；后续正常构建时自动消失。
- **提交 `vendor/` 增大仓库体积**：接受，以保持 ZIP/git pull 直接部署；`composer.lock` 保证可复现。
- **远端登录态无法自动化**：本地没有有效 KF 账号 Cookie → 自动验证覆盖登录页、路由、代理抓取与解析；登录后的完整页面由人工用真实账号验收。
- **生产 PHP-FPM 仍指向 php7.0 socket**（`vps/kfm.test.conf`）→ 本次不处理生产部署；后续单独把 PHP-FPM 切到 8.5 并安装扩展，本地验收只依赖 8021/8022 测试站点。
- **TP8 配置/路由缓存**：若生产执行过 `optimize:config`/`optimize:route`，升级后需清理 `runtime` 缓存并使用 TP8 对应命令。

## Migration Plan

1. 备份当前分支；在本地启用 PHP 8.5 扩展并安装 Composer。
2. 更新 `composer.json`，删除旧 `vendor/`、`thinkphp/`，执行 `composer install` 生成 `vendor/` 与 `composer.lock`。
3. `git mv application app`，迁移配置/路由/入口/控制台/provider，按上述决策改造兼容层。
4. 逐项迁移控制器、上传、Proxy、响应类与模板配置，删除 GameIntro 功能与 `think-image`；运行 `php -l` 与 Composer 平台检查。
5. 本地启动 PHP 8.5 + nginx 站点，按 specs 场景做冒烟与回归；用真实账号做只读验证（登录、浏览、Cookie），发帖附件与头像上传等写操作需逐项获得用户确认后再执行。
6. 提交 `app/`、`config/`、`route/`、`public/index.php`、`think`、`composer.json/lock`、`vendor/` 与文档；删除 `thinkphp/`、`build.php`、`GameIntro` 相关文件与 `think-image`。
7. 部署（后续单独处理，不阻塞本次 apply/archive）：服务器切换 PHP-FPM 到 8.5 并安装 `curl/mbstring/openssl` → `git pull` → 清空 `runtime/temp` 与配置/路由缓存 → 重载 nginx → 冒烟。
8. 回滚：`git revert` 升级提交（`vendor/`、`app/`、`thinkphp/` 均在版本控制内），清空 `runtime` 缓存，PHP-FPM 切回旧版本即可；本次升级不涉及数据库或外部存储迁移。
