<?php
namespace app\controller;

use think\Controller;
use think\exception\HttpResponseException;
use think\Response;
use think\response\Redirect;

/**
 * 消息页面控制器
 * @package app\controller
 */
class Msg extends Controller
{
    /**
     * 初始化
     */
    protected function _initialize()
    {
        set_bg_style(cookie(config('const.bgStyleCookieName')));
    }

    /**
     * 操作成功跳转的快捷方法
     * @param string $msg 提示信息
     * @param string $url 跳转的URL地址
     * @param int $wait 跳转等待时间，设为-1代表使用默认等待时间
     * @throws HttpResponseException
     */
    public function successMsg($msg, $url = null, $wait = -1)
    {
        if ($wait < 0) $wait = config('success_msg_wait');
        if (is_null($url) && isset($_SERVER["HTTP_REFERER"])) {
            $url = $_SERVER["HTTP_REFERER"];
        } else {
            $url = convert_url($url);
        }
        $result = [
            'msg' => $msg,
            'url' => $url,
            'wait' => $wait
        ];

        $type = $this->getResponseType();
        if ('html' == strtolower($type)) {
            $result = $this->fetch('Msg/success', array_merge($result, ['noInfo' => true]));
        }
        $response = Response::create($result, $type);
        throw new HttpResponseException($response);
    }

    /**
     * 操作错误跳转的快捷方法
     * @param string $msg 提示信息
     * @throws HttpResponseException
     */
    public function errorMsg($msg)
    {
        $result = ['msg' => $msg];
        $type = $this->getResponseType();
        if ('html' == strtolower($type)) {
            $result = $this->fetch('Msg/error', array_merge($result, ['noInfo' => true]));
        }
        $response = Response::create($result, $type);
        throw new HttpResponseException($response);
    }

    /**
     * URL重定向
     * @param string $url 跳转的URL表达式
     * @param integer $code http code
     * @throws HttpResponseException
     */
    public function redirectUrl($url, $code = 302)
    {
        $response = new Redirect(convert_url($url));
        $response->code($code);
        throw new HttpResponseException($response);
    }

    /**
     * 获取当前的响应输出类型
     * @return string 响应输出类型
     */
    protected function getResponseType()
    {
        $isAjax = $this->request->isAjax();
        return $isAjax ? config('default_ajax_return') : config('default_return_type');
    }
}