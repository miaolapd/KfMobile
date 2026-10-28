# Tasks

## 1. 首页进度分展示

- [x] 1.1 在 `app/responser/Index.php` 中定位 `.k_ale.k_ale_blue` 之后的 `.k_ale_green` 区块，提取 `a[href^="kf_lv200.php"]` 文本中的进度分数值并加入响应数据；验证：已登录请求首页后，响应数据中 `progressScore` 与远端首页显示的数字一致。
- [x] 1.2 在 `app/view/Index/index.html` 的「KFB | 贡献」按钮下方新增进度分按钮，文案为 `<b>{$progressScore}</b>进度分`，链接使用 `{:url('GrowUp/lv200')}`；验证：首页 HTML 中出现形如 `<b>103</b>进度分` 的按钮，紧跟 KFB/贡献 之后。
- [x] 1.3 容错处理：远端缺失进度分元素或请求失败时数值降级为 `0` 且首页照常渲染；验证：用缺少 `.k_ale_green` 区块的样例 HTML 调用响应类，`progressScore` 为 `0` 且不抛异常。

## 2. 进度分详情页

- [x] 2.1 在 `app/responser/GrowUp.php` 新增 `lv200()`，解析当前进度分、规则说明（去除「当前进度分：」前缀与 HTML 注释）与扣分记录（去除注释、剥离远端 class/style、`<hr>` 补 `my-2`、链接本地化）；验证：解析真实远端 `kf_lv200.php` 后三项数据均正确，输出中不含 HTML 注释与远端 class/style。
- [x] 2.2 在 `app/controller/GrowUp.php` 新增 `lv200()` 动作，代理 `kf_lv200.php`，AJAX 返回数据、否则渲染视图；验证：`/grow_up/lv200` 返回 200，AJAX 请求返回 JSON 且含 `progressScore`。
- [x] 2.3 新增视图 `app/view/GrowUp/lv200.html`：面包屑、当前进度分卡片（数字加粗）、扣分记录卡片（为空时不渲染）；验证：页面显示加粗的进度分数字与规则说明，且复用站点页头页脚。
- [x] 2.4 在 `app/common.php::convert_url()` 增加 `kf_lv200.php` → `GrowUp/lv200` 映射；验证：`convert_url('kf_lv200.php')` 返回 `/grow_up/lv200`，详情页内管理区链接指向本地版块页。

## 3. 首页功能区按钮调整

- [x] 3.1 移除 `app/view/Index/index.html` 功能区的「争夺奖励」按钮，保留导航栏与 `Public/kfolNav.html` 入口不变；验证：首页渲染结果不含「争夺奖励」按钮，导航栏与 kfolNav 仍包含争夺入口且可访问。

## 4. 验证

- [x] 4.1 全量 `php -l` 检查 `app/`、`config/`、`route/`、`public/`、`tools/`，并运行 `tools/smoke.php`；验证：无语法错误，冒烟脚本退出码 0。
- [x] 4.2 已登录只读验证：首页显示进度分、`/grow_up/lv200` 正常、`/grow_up/index` 未受影响；未登录访问进度分页面跳转登录页；验证：四个用例的标题与状态码符合预期，无 TypeError 或 500。

## Workflow follow-up

- 依赖的 `upgrade-php85-thinkphp81` 变更完成后，按项目评审要求归档本变更。
- 归档后检查 `openspec/specs/web/progress-score` 的 Purpose 与需求内容完整。
