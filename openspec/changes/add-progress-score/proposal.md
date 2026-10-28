# Proposal

## Why

KF 的进度分（`kf_lv200.php`）决定用户权限（能否查看共享版块、回复、发帖、发短消息等），但 KfMobile 首页此前不显示进度分，用户必须回到电脑版才能查看。升级到 PHP 8.5 / ThinkPHP 8.1 后新增了此项移动端展示能力，需要作为独立变更记录。

## What Changes

- 首页「功能区」在「KFB | 贡献」按钮下方新增进度分按钮，格式为 `<b>进度分</b>进度分`，点击进入本地进度分页面。
- 新增本地进度分页面 `/grow_up/lv200`：展示当前进度分（加粗）、规则说明与扣分记录；远端 `kf_lv200.php` 链接映射到该页面。
- 进度分抓取失败或远端结构变化时按 `0` 处理，不影响首页其它内容渲染。
- 首页「功能区」不再提供「争夺奖励」按钮；导航栏与 kfolNav 中的「争夺奖励」「争夺首页」入口保持不变。

## Capabilities

### New Capabilities

- `web/progress-score`: 移动端首页进度分展示、进度分详情页内容与链接本地化，以及首页功能区按钮集合的调整。

### Modified Capabilities

无（项目当前没有已归档的 specs；`upgrade-php85-thinkphp81` 尚未归档，本变更不依赖其规格内容）。

## Impact

- 应用代码：`app/responser/Index.php`（抓取进度分）、`app/responser/GrowUp.php`（新增 `lv200()`）、`app/controller/GrowUp.php`（新增 `lv200()`）、`app/common.php`（`kf_lv200.php` 链接映射）。
- 视图：新增 `app/view/GrowUp/lv200.html`；修改 `app/view/Index/index.html`（新增进度分按钮、移除「争夺奖励」按钮）。
- 外部行为：首页新增一个按钮与一个页面；首页「争夺奖励」按钮消失。导航栏与 kfolNav 的争夺入口、其它页面与接口不变。
- 配置、依赖、部署方式无变化。
