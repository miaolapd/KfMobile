<?php
// 缓存配置（框架/ORM 引导需要默认驱动）
return [
    'default' => 'file',
    'stores' => [
        'file' => [
            'type' => 'File',
            'path' => runtime_path() . 'cache' . DIRECTORY_SEPARATOR,
            'prefix' => '',
            'expire' => 0,
        ],
    ],
];
