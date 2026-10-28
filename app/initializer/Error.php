<?php

namespace app\initializer;

use think\initializer\Error as BaseError;

/**
 * 错误初始化：弃用信息记录但不抛异常，其他错误保持 TP8 行为
 */
class Error extends BaseError
{
    /**
     * @var array 本次请求已记录的弃用信息
     */
    protected static $loggedDeprecations = [];

    public function appError(int $errno, string $errstr, string $errfile = '', int $errline = 0): void
    {
        if (($errno === E_DEPRECATED || $errno === E_USER_DEPRECATED) && (error_reporting() & $errno)) {
            $key = $errno . '|' . $errstr . '|' . $errfile . '|' . $errline;

            if (!isset(static::$loggedDeprecations[$key])) {
                static::$loggedDeprecations[$key] = true;

                try {
                    $this->app->log->record(
                        'PHP 弃用：' . $errstr . ' @ ' . $errfile . ':' . $errline,
                        'warning'
                    );
                } catch (\Throwable $e) {
                    // 极早期日志服务未就绪时忽略
                }
            }

            return;
        }

        parent::appError($errno, $errstr, $errfile, $errline);
    }
}
