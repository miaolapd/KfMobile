# Spec Delta

## Purpose

定义 KfMobile 前端静态资源的构建环境要求、构建入口与任务集合、产物路径与浏览器兼容目标，以及自定义脚本的转译与分发契约，使前端源码在受支持的 Node.js 上可重复构建为可部署的产物。

## ADDED Requirements

### Requirement: 构建环境要求

前端构建 MUST 在 Node.js v22 或更高版本上运行，且 MUST 仅依赖可通过 npm 正常安装的纯 JavaScript 依赖（不要求本机编译原生模块）。

#### Scenario: 在 Node.js v22 上完成安装

- **WHEN** 在 Node.js v22 环境于项目根目录执行依赖安装
- **THEN** 安装成功结束，不出现原生模块编译失败或依赖已废弃导致的报错

#### Scenario: 声明的运行版本下界

- **WHEN** 查看项目根目录的依赖清单
- **THEN** 其中声明 Node.js 版本要求为 v22 或更高

#### Scenario: 构建环境可复现

- **WHEN** 提交依赖清单与锁定文件后，在另一台机器按文档执行安装
- **THEN** 安装得到的依赖版本与锁定文件一致

### Requirement: 构建入口与任务集合

前端构建 MUST 通过 npm 脚本提供完整的构建入口与增量监视入口，且构建 MUST 为原子完成（一次构建产出全部产物后才结束）。

#### Scenario: 全量构建

- **WHEN** 在项目根目录执行构建脚本
- **THEN** 命令以退出码 0 结束，并产出样式、脚本、字体与图片的全部产物

#### Scenario: 增量监视

- **WHEN** 执行监视脚本后修改前端源码中的样式文件或脚本文件
- **THEN** 无需重新执行构建即可自动重新产出对应产物

#### Scenario: 清理后重建

- **WHEN** 删除全部已产出产物后重新执行构建脚本
- **THEN** 产物被完整重新生成，无需任何手工中间步骤

### Requirement: 构建产物路径契约

构建 MUST 产出到既有路径与文件名，使服务端视图与运行时引用无需改动：样式 `static/dist/css/app.min.css`、`static/dist/css/font-awesome.min.css` 及其同名 `.map`，脚本 `static/dist/js/app.js`、`static/dist/js/app.min.js` 及其 `.map`，以及 `static/dist/js/lib/`、`static/dist/js/userScript/`、`static/dist/fonts/`、`static/dist/img/` 下的复制资源；其中 `static/dist/js/lib/`、`static/dist/fonts/`、`static/dist/img/` 的资源 MUST NOT 被改写。

#### Scenario: 页面引用无需改动

- **WHEN** 构建完成后打开站点任意页面
- **THEN** 页面引用的样式与脚本均正常加载，且不出现 404

#### Scenario: 复制类资源保持原样

- **WHEN** 对比 `static/src/js/lib/`、`static/src/fonts/`、`static/src/img/` 与产物目录中的同名文件
- **THEN** 文件内容逐字节一致

#### Scenario: 产物带调试映射

- **WHEN** 查看压缩后的样式与脚本产物
- **THEN** 两者均引用同目录下的 `.map` 文件，且浏览器可据此定位到前端源码

### Requirement: 浏览器兼容目标

构建产物的语法目标 MUST 为 ES2019，MUST NOT 要求 ES5 语法降级；产物 MUST NOT 依赖构建机之外的运行时转译。产物的实际语法门槛 MUST 不高于 Chrome 66 / Firefox 58 / Safari 11.1 / iOS 11.3 / Edge 79。

#### Scenario: 语法目标为 ES2019

- **WHEN** 检查构建配置中的脚本转译目标
- **THEN** 其声明为 ES2019，且压缩后的脚本产物保留 ES2015+ 语法（如箭头函数），未被降级为 ES5 等价写法

#### Scenario: 产物不超出实际语法门槛

- **WHEN** 检查压缩后的脚本产物所含语法
- **THEN** 其中不含 ES2020 及以上的语法（可选链、空值合并等），使其可在 iOS 11.3 / Safari 11.1 / Chrome 66 上直接解析执行

#### Scenario: 现代浏览器正常执行

- **WHEN** 在符合兼容目标的浏览器中打开站点并操作主要页面
- **THEN** 页面脚本无语法错误，交互功能与样式呈现正常

#### Scenario: 样式前缀按目标补齐

- **WHEN** 检查压缩后的样式产物
- **THEN** 面向兼容目标所需的浏览器前缀已自动补齐，无需在源码中手工书写

### Requirement: 自定义脚本的转译与元信息保留

仓库内维护的自定义脚本（`static/src/js/userScript/` 下的源码）MUST 被转译为不低于 ES2019 的语法并输出到独立的产物目录；转译 MUST 保留脚本头部的 `==UserScript==` 元信息块（名称、版本、执行时机、作者、首页、说明），且 MUST 保留中文等非 ASCII 字符的字面内容。

#### Scenario: 元信息块可被运行时解析

- **WHEN** 应用在运行时从转译后的脚本内容中提取自定义脚本元信息
- **THEN** 提取到名称与执行时机等字段，而非回退为默认值

#### Scenario: 中文内容保持可读

- **WHEN** 查看转译后的脚本文本
- **THEN** 其中的中文文案以可读字符呈现，不出现转义序列导致的乱码

#### Scenario: 产物目录标示目标语法级别

- **WHEN** 自定义脚本转译完成后查看输出目录
- **THEN** 产物位于以目标语法级别命名的目录中，且不与源码目录混淆

#### Scenario: 元信息块在检出后仍可解析

- **WHEN** 在 `core.autocrlf=true` 的环境全新检出仓库后读取自定义脚本产物
- **THEN** 其头部 `==UserScript==` 元信息块仍为 LF 换行并可被运行时正则解析，不因检出时的换行转换而失效

### Requirement: 前端源码中不得存在无效引用

构建 MUST NOT 在打包过程中报告跨模块引用不存在的成员；前端源码 MUST NOT 调用未被其来源模块导出的成员。

#### Scenario: 打包无悬空引用警告

- **WHEN** 执行构建脚本
- **THEN** 输出中不出现“引用不存在导出”一类的告警

#### Scenario: 页面初始化不因悬空调用中断

- **WHEN** 打开此前会触发无效调用的页面并查看浏览器控制台
- **THEN** 不出现由该调用引发的类型错误，页面其余初始化逻辑继续执行
