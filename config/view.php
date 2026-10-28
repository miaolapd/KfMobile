<?php
// 视图配置
return [
    // 模板引擎类型
    'type' => 'Think',
    // 模板路径
    'view_path' => app_path() . 'view' . DIRECTORY_SEPARATOR,
    // 模板后缀
    'view_suffix' => 'html',
    // 模板文件名分隔符
    'view_depr' => DIRECTORY_SEPARATOR,
    // 模板引擎普通标签开始/结束标记
    'tpl_begin' => '{',
    'tpl_end' => '}',
    // 标签库标签开始/结束标记
    'taglib_begin' => '{',
    'taglib_end' => '}',
    // 视图输出字符串内容替换
    'tpl_replace_string' => [
        '__PUBLIC__' => defined('PUBLIC_PATH') ? PUBLIC_PATH : '/',
    ],
    // 保持 TP5 模板的“不自动转义”行为
    'default_filter' => '',
    // 开启模板编译缓存
    'tpl_cache' => true,
];
