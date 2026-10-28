<?php
// 路由配置
return [
    // pathinfo分隔符
    'pathinfo_depr' => '/',
    // 是否强制使用路由
    'url_route_must' => false,
    // 路由是否完全匹配
    'route_complete_match' => false,
    // URL伪静态后缀（false 表示禁止）
    'url_html_suffix' => false,
    // 非路由变量使用路径式参数（保持旧版 /控制器/操作/名/值 格式）
    'url_common_param' => false,
    // 是否区分大小写
    'url_case_sensitive' => false,
    // 访问控制器层名称
    'controller_layer' => 'controller',
    // 是否使用控制器后缀
    'controller_suffix' => false,
    // 默认控制器名
    'default_controller' => 'Index',
    // 默认操作名
    'default_action' => 'index',
    // 操作方法后缀
    'action_suffix' => '',
    // 空控制器名
    'empty_controller' => 'Error',
];
