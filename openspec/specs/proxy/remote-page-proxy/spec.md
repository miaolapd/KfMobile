# remote-page-proxy Specification

## Purpose

定义 KfMobile 作为 KF 移动版反向代理的核心行为：按配置抓取远端页面、转换编码与链接、维护登录与 Cookie、转发附件上传。

## Requirements

### Requirement: 远端请求构造

系统 MUST 使用配置的代理域名、User-Agent、Referer、连接/执行超时与 SSL 校验开关发起远端请求，并 MUST 将客户端 Cookie 与客户端 IP 转发给远端。

#### Scenario: 按配置发起抓取

- **WHEN** 用户访问需要远端数据的页面
- **THEN** 远端请求使用配置的域名、UA、超时时间，并携带客户端 Cookie 与 `X-Forwarded-For`

#### Scenario: 关闭 SSL 校验时允许自签名证书

- **WHEN** 配置 `verify_ssl_cert` 为 `false` 且远端使用自签名证书
- **THEN** 请求仍能完成并返回页面内容

### Requirement: 远端响应状态处理

系统 MUST 将远端 200 响应渲染为本地页面；远端 301/302 MUST 转换为本地重定向；其他状态或连接失败 MUST 显示包含错误信息的提示页。

#### Scenario: 远端 200

- **WHEN** 远端返回 200 和 HTML 文档
- **THEN** 系统解析文档并渲染对应页面

#### Scenario: 远端重定向

- **WHEN** 远端返回 301 或 302 及 Location
- **THEN** 浏览器被重定向到经过本地 URL 转换的目标地址

#### Scenario: 远端连接失败

- **WHEN** 远端超时、返回 5xx 或返回空响应
- **THEN** 系统显示“远端连接错误”提示页，而不是空白页或框架异常页

### Requirement: 字符编码转换

系统 MUST 将远端 GBK 文档转换为 UTF-8，并将文档中的 charset 声明改为 UTF-8；发往远端的查询参数 POST 数据与文件名 MUST 转换为远端编码。

#### Scenario: GBK 页面正常显示

- **WHEN** 远端返回 GBK 编码且声明 `charset=gbk` 的页面
- **THEN** 本地页面以 UTF-8 输出且中文不乱码，HTML 中声明为 UTF-8

#### Scenario: 中文参数发往远端

- **WHEN** 用户提交包含中文的搜索词或帖子内容
- **THEN** 请求参数按远端编码发送，远端能正确识别

### Requirement: 远端链接重写

系统 MUST 将指向 KF 各域名的远端链接转换为当前站点域名，并 MUST 将仍受支持的远端 PHP 入口地址映射为对应的本地路由，同时保留查询参数与锚点；已废弃的 `g_intro*.php` 入口 MUST NOT 再映射到本地页面。

#### Scenario: 主题链接转换

- **WHEN** 远端页面包含 `read.php?tid=123#floor` 链接
- **THEN** 输出页面中的链接指向本地阅读页并保留锚点

#### Scenario: 其它 KF 域名链接转换

- **WHEN** 远端页面包含其它 KF 域名（如 `2dkf.com`）的绝对链接
- **THEN** 输出链接指向当前站点对应路径

### Requirement: 主题安全校验参数 sf 的传递

阅读页 MUST 从远端分页链接中提取主题的 `sf` 安全校验参数，并在该页所有指向回帖、引用、编辑与多重引用的入口中携带；回帖页 MUST 将该参数透传到其面包屑中的主题链接与提交表单，使用户点击后能通过远端安全校验。系统 MUST NOT 从回帖页的侧栏列表等无关区域推断 `sf`。

#### Scenario: 阅读页入口携带 sf

- **WHEN** 阅读页取得主题的 `sf` 参数后渲染回帖、引用、编辑与多重引用入口
- **THEN** 这些链接均包含该主题的 `sf` 参数

#### Scenario: 回帖页面包屑可正常打开主题

- **WHEN** 用户从阅读页入口进入回帖页并点击面包屑中的主题链接
- **THEN** 主题页正常打开，不出现远端「查看帖子链接不完整，无安全验证」提示

#### Scenario: 回帖表单保留 sf

- **WHEN** 用户提交回帖表单
- **THEN** 提交数据中包含进入回帖页时携带的 `sf` 参数

#### Scenario: 缺少 sf 时不臆造

- **WHEN** 请求中没有 `sf` 参数，或远端回帖页仅在侧栏等无关区域出现同一主题的 `sf` 链接
- **THEN** 系统按无 `sf` 生成链接，不采用无关区域的取值

### Requirement: 登录校验与登录流程

系统 MUST 在缺少用户账户 Cookie 时展示登录页而不是受保护内容；登录 MUST 将远端下发的账户 Cookie 保存为本地 Cookie，登出 MUST 请求远端登出并清理本地账户状态。

#### Scenario: 未登录访问受保护页面

- **WHEN** 请求受保护页面且请求中没有用户账户 Cookie
- **THEN** 返回登录页面并携带原始访问地址作为登录后跳转地址

#### Scenario: 登录成功

- **WHEN** 用户提交正确的用户名和密码
- **THEN** 远端账户 Cookie 被保存到本地浏览器并跳转到登录后页面

#### Scenario: 登出

- **WHEN** 用户执行登出
- **THEN** 系统请求远端登出接口并回到首页或登录页，受保护页面再次要求登录

### Requirement: Cookie 透传与名称前缀

系统 MUST 原样转发远端下发的非账户 Cookie（包括由远端删除的 Cookie），并 MUST 保持现有 Cookie 名称与前缀语义：默认配置前缀、按用户区分的前缀以及无前缀的远端原始 Cookie 均不得改名。

#### Scenario: 远端 Set-Cookie 透传

- **WHEN** 远端响应同时包含普通 Cookie、被删除 Cookie 与账户 Cookie
- **THEN** 普通 Cookie 被设置、被删除 Cookie 在本地失效、账户 Cookie 由登录流程单独管理

#### Scenario: 按用户前缀读取偏好

- **WHEN** 已登录用户设置了按用户前缀保存的偏好 Cookie
- **THEN** 后续请求能以原有前缀和名称读回该偏好

### Requirement: 附件上传转发

系统 MUST 校验发帖附件与头像的扩展名，并在转发时保持原始文件名与 MIME 类型；上传的临时文件 MUST 在请求完成后删除。

#### Scenario: 合法附件上传

- **WHEN** 用户上传扩展名允许的附件并发帖
- **THEN** 远端收到文件名与 MIME 类型保持原样的文件，且本地临时文件被清理

#### Scenario: 非法扩展名

- **WHEN** 用户上传不在允许列表中的扩展名
- **THEN** 系统显示类型不匹配的错误提示且不向远端发送该文件

### Requirement: 远端页面结构变化的容错

系统 MUST 在远端页面缺少可选元素或属性时继续渲染页面，不得因空值参与字符串处理或正则匹配而产生 500 响应。

#### Scenario: 可选属性缺失

- **WHEN** 远端页面中某个被读取的可选属性不存在
- **THEN** 页面仍正常渲染，缺失值以空字符串处理

#### Scenario: 可选列表为空

- **WHEN** 远端页面中某个预期列表没有任何条目
- **THEN** 页面输出空列表且不抛出异常
