<?php
// 应用引导：兼容常量、运行时目录与本地配置覆盖

define('APP_PATH', __DIR__ . DIRECTORY_SEPARATOR);

if (!defined('PUBLIC_PATH')) {
    if (PHP_SAPI !== 'cli' && isset($_SERVER['SCRIPT_NAME'])) {
        $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME']);
        define('PUBLIC_PATH', substr($scriptName, 0, strrpos($scriptName, '/') + 1));
    } else {
        define('PUBLIC_PATH', '/');
    }
}

define('TEMP_PATH', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'runtime' . DIRECTORY_SEPARATOR . 'temp' . DIRECTORY_SEPARATOR);
define('LOG_PATH', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'runtime' . DIRECTORY_SEPARATOR . 'log' . DIRECTORY_SEPARATOR);

defined('DS') || define('DS', DIRECTORY_SEPARATOR);
defined('EXT') || define('EXT', '.php');

// PHP 内置服务器请求 / 或 /index.php 时不会提供 s/PATH_INFO，
// TP8 会把 index.php 当成 pathinfo 解析而返回 404；这里补成根路径。
if (PHP_SAPI === 'cli-server' && !isset($_GET['s']) && empty($_SERVER['PATH_INFO'])) {
    $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    if ($requestPath === '/' || $requestPath === '/index.php' || $requestPath === $scriptName) {
        $_GET['s'] = '/';
    }
}

/**
 * 确保运行时目录存在
 */
function kfmobile_ensure_runtime_dirs(): void
{
    foreach ([TEMP_PATH, LOG_PATH] as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
    }
}

/**
 * 加载扁平自定义配置与 my.php 覆盖
 * @param \think\App $app
 */
function kfmobile_boot(\think\App $app): void
{
    kfmobile_ensure_runtime_dirs();

    // 扁平自定义配置（app_debug、url_common_param、proxy_domain、site_name、const.* 等）
    $app->config->load($app->getAppPath() . 'config.php', '');

    // 本地/生产覆盖，保持 my.php 机制
    $file = $app->getAppPath() . 'my.php';
    if (is_file($file)) {
        $override = include $file;
        if (is_array($override)) {
            $app->config->set($override);
            if (!empty($override['app_debug'])) {
                $app->debug(true);
            }
        }
    }
}
