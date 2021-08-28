<?php
// [ 应用入口文件 ]

// 定义应用目录
define('APP_PATH', __DIR__ . '/../application/');
// 定义公共入口所在目录的url路径
define('PUBLIC_PATH', substr($_SERVER['SCRIPT_NAME'], 0, strrpos($_SERVER['SCRIPT_NAME'], '/') + 1));
// 加载框架引导文件
require __DIR__ . '/../thinkphp/start.php';
