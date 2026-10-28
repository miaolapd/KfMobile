<?php
namespace app\controller;

use app\BaseController;
use think\Response;
use think\exception\HttpResponseException;
use app\lib\Cookie;

/**
 * 控制器基类
 * @package app\controller
 */
class Base extends BaseController
{
    /**
     * 初始化
     */
    protected function initialize()
    {
        if (config('site_close')) {
            error(config('site_close_msg'));
        }
        if (!Cookie::get(config('const.userAccountCookieName'), config('const.kfCookiePrefix'))) {
            $result = app(\app\controller\Login::class)->index(false, request()->url());
            $response = Response::create($result, 'html');
            throw new HttpResponseException($response);
        }
        set_bg_style(Cookie::get(config('const.bgStyleCookieName')));
    }

    /**
     * 空操作
     */
    public function _empty()
    {
        error('抱歉，您访问的页面不存在~~');
    }
}
