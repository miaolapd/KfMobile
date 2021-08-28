<?php
namespace app\controller;

/**
 * 空控制器
 * @package app\controller
 */
class Error
{
    public function index()
    {
        error('抱歉，您访问的页面不存在~~');
    }
}
