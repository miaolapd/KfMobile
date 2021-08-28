<?php
namespace app\controller;

use think\Controller;
use think\Response;
use think\exception\HttpResponseException;
use think\Cookie;

/**
 * 控制器基类
 * @package app\controller
 */
class Base extends Controller
{
    /**
     * 初始化
     */
    protected function _initialize()
    {
        if (config('site_close')) {
            error(config('site_close_msg'));
        }
        if (!Cookie::get(config('const.userAccountCookieName'), config('const.kfCookiePrefix'))) {
            $result = action('Login/index', ['isRemote' => false, 'jumpUrl' => request()->url()]);
            $response = Response::create($result, 'html');
            throw new HttpResponseException($response);
        }
        set_bg_style(cookie(config('const.bgStyleCookieName')));
    }

    /**
     * 空操作
     */
    public function _empty()
    {
        error('抱歉，您访问的页面不存在~~');
    }
}
