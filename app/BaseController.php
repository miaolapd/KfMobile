<?php

namespace app;

use think\facade\View;

/**
 * 控制器基类（兼容 TP5 Controller 的常用能力）
 */
abstract class BaseController
{
    /**
     * 当前请求对象
     * @var \think\Request
     */
    protected $request;

    public function __construct()
    {
        $this->request = app('request');
        $this->initialize();
    }

    /**
     * 初始化钩子
     */
    protected function initialize()
    {
    }

    /**
     * 渲染模板
     * @param string $template
     * @param array $vars
     * @return string
     */
    protected function fetch(string $template = '', array $vars = [])
    {
        return View::fetch($template, $vars);
    }

    /**
     * 模板变量赋值
     * @param string|array $name
     * @param mixed $value
     * @return $this
     */
    protected function assign($name, $value = null)
    {
        View::assign($name, $value);
        return $this;
    }

    /**
     * 操作错误跳转
     * @param string $msg
     * @return mixed
     */
    protected function error($msg)
    {
        return error($msg);
    }

    /**
     * 操作成功跳转
     * @param string $msg
     * @param string|null $url
     * @param int $wait
     * @return mixed
     */
    protected function success($msg, $url = null, $wait = -1)
    {
        return success($msg, $url, $wait);
    }
}
