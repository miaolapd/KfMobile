<?php
// 日志配置
return [
    'default' => 'file',
    'level' => [],
    'channels' => [
        'file' => [
            'type' => 'File',
            'path' => runtime_path() . 'log' . DIRECTORY_SEPARATOR,
            'single' => false,
            'apart_level' => [],
        ],
    ],
];
