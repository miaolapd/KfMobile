# Design

## Context

首页响应类 `app/responser/Index.php` 目前只解析远端首页的「神秘/系数/排行」区块（`.k_ale.k_ale_blue`）与其后紧邻的「KFB | 贡献」区块（`.k_ale`）。实测远端首页的进度分位于再往后的 `.k_ale_green` 区块内，结构为：

```html
<div class="k_ale k_ale_green k_ale k_tr">
  <span class="k_butt_green k_blk k_anbig" style="text-align:right;">
    <p class="k_f18"><a href="kf_lv200.php" style="color:#009900;">进度分：103</a></p>
    <p>登录奖励 (进度分&搜索次数)</p>
  </span>
</div>
```

远端 `kf_lv200.php` 的主内容位于 `#alldiv > .drow:nth-child(3) > .dcol:nth-child(2)`，包含「当前进度分：<数字>」、规则说明与「我的扣分记录」两个 `.k_ale` 区块，其中规则说明原文含被注释掉的权限说明，扣分记录区含远端的 class/style 与 `thread.php?fid=4` 链接。

## Goals / Non-Goals

**Goals:**

- 首页以与「KFB | 贡献」一致的按钮样式展示进度分，数字加粗。
- 提供本地进度分详情页，内容与远端语义一致，样式统一为本站 Bootstrap 风格。
- 远端结构缺失时不报错，页面可降级。

**Non-Goals:**

- 不实现进度分的修改能力（登录奖励领取、搜索次数）——这些仍由远端 `kf_growup.php` / 其它入口承担。
- 不实现扣分记录的申诉入口提交（仅保留链接）。
- 不改动导航栏与 kfolNav 的争夺入口。
- 不引入新的前端构建产物（不修改 `public/static/`）。

## Decisions

### 1. 进度分抓取方式

在首页响应类中复用已有的 `$pqSmArea`（`.k_ale.k_ale_blue`），用 `nextAll('.k_ale_green')` 定位进度分区块，再取 `a[href^="kf_lv200.php"]` 的文本并以 `/进度分：\s*(\d+)/u` 提取数字。

- 备选方案：按 `.k_ale:nth-child(3)` 之类的结构位置取值。被否决：远端侧栏区块增减会直接错位。
- 备选方案：正则匹配整页文本。被否决：易与页面其它含「进度」字样的内容冲突，且破坏已有的 phpQuery 解析风格。
- 大小写与容错：抓不到或元素缺失时保持 `0`，不影响首页其它数据。

### 2. 详情页数据解析

`GrowUp::lv200()` 复用 `GrowUp::index()` 的解析框架（phpQuery + `getCommonData()` + 调试计时 + 响应数据 trace），解析三项数据：

- `progressScore`：`.k_ale:first > span > .k_f32` 的数字。
- `progressRule`：取数字节点的父级 HTML，去掉「当前进度分：…」前缀、HTML 注释，再去首尾空白。
- `deductRecord`：取第二个 `.k_ale` 的 HTML，去掉 HTML 注释、剥离远端 `class`/`style` 属性，`<hr>` 补上 `my-2`，最后经 `replace_common_html_content()` 把远端链接转成本地链接。

- 备选方案：直接输出远端整块 HTML。被否决：会带进远端的 CSS 类与内联样式，与本站样式冲突，且注释内容会被浏览器渲染出来（实测确实如此）。

### 3. 页面与路由

- 控制器新增 `GrowUp::lv200()`，`Proxy::get('kf_lv200.php')`，AJAX 返回数据、否则渲染 `GrowUp/lv200`。
- 视图 `app/view/GrowUp/lv200.html`：面包屑 + 「当前进度分」卡片（数字用 `display-4` 加粗）+ 「扣分记录」卡片（空则不渲染该区块）。
- `convert_url()` 增加 `kf_lv200.php` → `url('GrowUp/lv200')` 映射，使远端页面里的进度分链接与详情页内引用都指向本地。
- 首页按钮使用 `{:url('GrowUp/lv200')}`，与站点其它按钮保持一致（生成 `/grow_up/lv200`）。

### 4. 首页按钮调整

移除 `<a ... href="/kf_fw_ig_index.php" ...>争夺奖励</a>`，在「KFB | 贡献」之后插入进度分按钮。`Public/header.html` 与 `Public/kfolNav.html` 中的争夺入口保持不动（用户明确要求仅处理首页按钮）。

## Risks / Trade-offs

- **远端结构变化**：进度分区块的 class 名或层级改变会导致取不到值 → 抓取失败降级为 `0`，且选择器基于语义化的 `kf_lv200.php` 链接而非纯位置，冒烟脚本可覆盖。
- **规则说明含注释**：远端用 HTML 注释隐藏权限说明，直接输出会被渲染 → 解析时用 `preg_replace('/<!--.*?-->/s', ...)` 剔除；若远端改为其它隐藏方式需重新适配。
- **扣分记录样式**：剥离远端 class/style 后依赖本站样式 → 已实测显示正常；若远端新增结构性标签，需要人工复查一次。
- **数值一致性**：进度分与远端实时值一致，本地不缓存，因此每次访问首页都会多解析一个区块，开销可忽略。
