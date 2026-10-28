<?php
/**
 * KfMobile 最小冒烟脚本（不依赖框架、不含凭据、不执行写操作）
 *
 * 用法：
 *   php tools/smoke.php http://127.0.0.1:8022 [cookie]
 *
 * 可选 cookie 参数用于只读的登录态验证，例如从浏览器复制的 Cookie 头。
 */

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This script must be run from CLI.\n");
    exit(2);
}

$base = rtrim($argv[1] ?? 'http://127.0.0.1:8022', '/');
$cookie = $argv[2] ?? '';

$routes = [
    '/' => 200,
    '/login' => 200,
    '/thread/1' => 200,
    '/read/1' => 200,
    '/gjc/test' => 200,
    '/user/uid/1' => 200,
    '/user/username/test' => 200,
    '/rank' => 200,
    '/share' => 200,
    '/faq/1' => 200,
];

$failures = [];

function fetch(string $url, string $cookie = ''): array
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    if ($cookie !== '') {
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Cookie: ' . $cookie]);
    }
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    return ['code' => $code, 'body' => (string) $body, 'error' => $error];
}

function fail(array &$failures, string $message): void
{
    $failures[] = $message;
    echo "FAIL $message\n";
}

function check_body(array &$failures, string $label, string $body): void
{
    foreach (['Fatal error', 'Parse error', 'Uncaught'] as $needle) {
        if (stripos($body, $needle) !== false) {
            fail($failures, "$label 响应包含 PHP 错误：$needle");
            return;
        }
    }
}

foreach ($routes as $path => $expected) {
    $url = $base . '/?s=' . rawurlencode($path);
    $res = fetch($url, $cookie);

    if ($res['code'] !== $expected) {
        fail($failures, "$path 期望 $expected，实际 {$res['code']} {$res['error']}");
        continue;
    }

    check_body($failures, $path, $res['body']);
    echo "OK   $path ({$res['code']})\n";
}

// 已废弃的游戏介绍入口：生产模式应显示错误页，调试模式为 404
$res = fetch($base . '/?s=' . rawurlencode('/game/1'), $cookie);
if ($res['code'] !== 404 && stripos($res['body'], '抱歉，您访问的页面不存在') === false) {
    fail($failures, '/game/1 未返回错误页（状态 ' . $res['code'] . '）');
} else {
    echo "OK   /game/1 (deprecated)\n";
}

// URL 归一化：登录表单应生成小写路径，且不带 index.php 前缀
$res = fetch($base . '/?s=' . rawurlencode('/login/index'), $cookie);
if (preg_match('/action="([^"]+)"/', $res['body'], $m)) {
    $action = $m[1];
    // 本地 nginx 以 proxy_pass 转发时，PHP 看到的请求 URI 可能带 /index.php 前缀；
    // 生产 fastcgi 环境与直接访问 8022 时为 /login/login。两者都接受。
    if (!preg_match('#^(?:/index\.php)?/login/login$#', $action)) {
        fail($failures, "登录表单 action 期望 /login/login（可带 /index.php 前缀），实际 $action");
    } else {
        echo "OK   url normalization ($action)\n";
    }
} else {
    fail($failures, '登录页未找到表单 action');
}

// 未找到页面（生产模式）
$res = fetch($base . '/?s=' . rawurlencode('/NoSuchController/index'), $cookie);
if ($res['code'] !== 404 && stripos($res['body'], '抱歉，您访问的页面不存在') === false) {
    fail($failures, '未知控制器未返回错误页');
} else {
    echo "OK   unknown controller\n";
}

if ($failures) {
    echo "\n" . count($failures) . " failure(s)\n";
    exit(1);
}

echo "\nAll smoke checks passed.\n";
