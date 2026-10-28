<?php

namespace app\exception;

use think\exception\Handle as BaseHandle;
use think\exception\HttpException;
use think\exception\HttpResponseException;
use think\Request;
use think\Response;
use Throwable;

/**
 * 应用异常处理：生产环境使用自定义错误页，调试模式保留 TP8 调试页
 */
class Handle extends BaseHandle
{
    public function render(Request $request, Throwable $e): Response
    {
        if ($e instanceof HttpResponseException) {
            return $e->getResponse();
        }

        if ($this->app->isDebug()) {
            return parent::render($request, $e);
        }

        $status = 500;
        $message = config('show_error_msg') ? $e->getMessage() : config('error_message');

        if ($e instanceof HttpException) {
            $status = $e->getStatusCode();
        }

        if ($status === 404 || $this->isNotFound($e)) {
            $status = 404;
            $message = '抱歉，您访问的页面不存在~~';
        }

        return $this->renderErrorPage($message, $status);
    }

    /**
     * 判断是否为“控制器/操作不存在”类错误
     */
    protected function isNotFound(Throwable $e): bool
    {
        if ($e instanceof \ReflectionException) {
            return true;
        }

        $message = $e->getMessage();

        return str_contains($message, 'method not exists')
            || str_contains($message, 'controller not exists')
            || str_contains($message, 'class not exists');
    }

    /**
     * 渲染错误页
     */
    protected function renderErrorPage(string $message, int $status): Response
    {
        $template = config('exception_tmpl');

        if (empty($template) || !is_file($template)) {
            $template = app_path() . 'view' . DIRECTORY_SEPARATOR . 'Msg' . DIRECTORY_SEPARATOR . 'exception.html';
        }

        if (is_file($template)) {
            ob_start();
            include $template;
            $content = ob_get_clean();

            return Response::create($content, 'html', $status);
        }

        return Response::create($message, 'html', $status);
    }
}
