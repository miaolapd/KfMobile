<?php
// [ 应用入口文件 ]

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../app/bootstrap.php';

$app = new \think\App();
kfmobile_boot($app);

$http     = $app->http;
$response = $http->run();
$response->send();
$http->end($response);
