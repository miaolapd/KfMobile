<?php
// 日志配置
return [
    'default' => 'file',
    'level'   => [],
    'channels' => [
        'file' => [
            'type'          => 'File',
            'path'          => runtime_path() . 'log' . DIRECTORY_SEPARATOR,
            // 每个文件超过 2MB 即切分，避免单文件无限膨胀
            'file_size'     => 2097152,
            'single'        => false,
            'apart_level'   => [],
            // 关键：保留的最大文件数。默认值 0 表示不清理，
            // 曾导致生产环境日志累积到 12G / 7709 个文件。
            // 设为 60 个 × 2MB ≈ 120MB 上限，足够排障且不会撑爆磁盘。
            'max_files'     => 60,
        ],
    ],
];
