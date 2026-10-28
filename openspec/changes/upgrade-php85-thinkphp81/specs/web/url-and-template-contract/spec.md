# Spec Delta

## Purpose

定义 KfMobile 对浏览器与前端脚本暴露的 URL、路由、模板渲染、响应类型及页面注入数据的契约，确保框架升级不改变保留页面的链接与行为，并明确已废弃游戏介绍入口的处理。

## ADDED Requirements

### Requirement: 入站美化路由

系统 MUST 继续接受以下路由形式：`/`、`/login`、`/thread/{数字}`、`/read/{数字}`、`/gjc/{关键词}`、`/user/uid/{数字}`、`/user/username/{用户名}`、`/rank`、`/share`、`/faq/{数字}`，并 MUST 对数字参数执行数字约束。已废弃的 `/game/{数字}` MUST NOT 再提供游戏介绍页面。

#### Scenario: 主题与阅读路由

- **WHEN** 请求 `/thread/42` 或 `/read/100`
- **THEN** 分别渲染版块页面或主题页面，并携带对应 `fid` / `tid` 参数

#### Scenario: 数字约束不满足

- **WHEN** 请求 `/read/abc`
- **THEN** 请求不会被当作合法主题 ID 处理，而是进入未找到/错误提示流程

### Requirement: 兼容控制器/操作路径

系统 MUST 继续接受由控制器、操作和路径式参数组成的地址，例如 `/thread/index/fid/1`、`/login/index`、`/profile/show/uid/1`，并按控制器与操作分发。

#### Scenario: 路径式参数

- **WHEN** 请求 `/thread/index/fid/1/page/2`
- **THEN** 控制器收到 `fid=1`、`page=2` 并按版块页面处理

#### Scenario: 控制器/操作直接访问

- **WHEN** 请求 `/message/read/action/read`
- **THEN** 消息控制器按 `read` 操作处理并读取 `action` 参数

### Requirement: 出站 URL 生成

系统 MUST 以路径分段形式生成参数（`/控制器/操作/名/值`），MUST 支持字符串与数组两种参数输入，MUST 保留目标地址中的查询参数与锚点，且 MUST 不追加伪静态后缀。控制器段 MUST 转为小写蛇形（如 `SelfRate` → `self_rate`），操作段 MUST 全小写（如 `waitCheck` → `waitcheck`）。

#### Scenario: 字符串参数

- **WHEN** 生成 `url('Read/index', 'tid=1&sf=2')`
- **THEN** 得到包含 `tid/1` 与 `sf/2` 的路径，而不是类型错误

#### Scenario: 大小写归一化

- **WHEN** 生成 `url('SelfRate/waitCheck')` 或 `url('GuanJianCi/index')`
- **THEN** 分别得到 `/self_rate/waitcheck` 与 `/guan_jian_ci/index`，不保留控制器/操作的原始大小写

#### Scenario: 锚点保留

- **WHEN** 远端链接包含 `read.php?tid=1#pid2`
- **THEN** 生成的本地链接包含 `#pid2`

### Requirement: 模板渲染兼容

系统 MUST 使用保留的视图文件渲染页面，并 MUST 支持 `{$Think.config.*}`、`volist`、`eq`、`switch/case`、`include`、`notempty`、`empty`、`assign`、`for` 等现有模板语法以及 `__PUBLIC__` 替换；已删除的游戏介绍视图 MUST NOT 再被引用。

#### Scenario: 配置与标签渲染

- **WHEN** 渲染包含站点名称、背景图列表与条件分支的页面
- **THEN** 配置值、循环与条件结果正确输出，且不出现模板解析错误

#### Scenario: 视图文件无需改写

- **WHEN** 升级后访问任意保留页面
- **THEN** 对应 `view/<控制器>/<操作>.html` 文件被正常解析并输出

### Requirement: 客户端页面信息契约

系统 MUST 在非提示页面注入 `window.Info`，包含 `uid`、`userName`、`verify`、`safeId`、`imgPath`、`rootPath`、`baseFile`、`staticPath`、`urlType`、`urlParam`、`cookiePrefix` 与 `resTimestamp`，其含义与升级前一致。

#### Scenario: 路径式参数模式

- **WHEN** 正常渲染页面且系统使用路径式参数模式
- **THEN** `urlType` 为 `1`，`baseFile` 为 `/index.php`，`rootPath` 为站点根路径

#### Scenario: 前端构造链接

- **WHEN** 前端脚本使用 `window.Info` 构造带参数的本地链接
- **THEN** 生成的链接与升级前的路径式格式一致

### Requirement: 响应类型与提示页

系统 MUST 对 AJAX 请求返回 JSON、对普通请求返回 HTML；成功与错误提示 MUST 使用应用内置提示页并遵循配置的等待时间；成功提示中的链接 MUST 经过本地 URL 转换。

#### Scenario: AJAX 请求

- **WHEN** 带 AJAX 标识请求返回结构化数据的页面
- **THEN** 响应内容为 JSON，而不是 HTML 片段

#### Scenario: 操作成功

- **WHEN** 登录、发帖等操作成功并触发成功提示
- **THEN** 显示成功提示页，等待配置秒数后跳转到目标本地地址

### Requirement: 未找到页面处理

系统 MUST 对不存在的控制器、操作或路由返回应用内置的错误提示页，MUST NOT 暴露框架调试页面或目录结构。

#### Scenario: 未知地址

- **WHEN** 请求不存在的控制器或操作
- **THEN** 返回“抱歉，您访问的页面不存在”提示页，且不显示调试堆栈

#### Scenario: 已废弃的游戏介绍入口

- **WHEN** 请求 `/game/1` 或其它原游戏介绍路由
- **THEN** 返回应用内错误提示页，不再渲染游戏介绍内容或调用已删除的缩略图接口
