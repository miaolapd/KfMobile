<?php

namespace app\controller;

use think\Controller;
use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 注册页面控制器
 * @package app\controller
 */
class Register extends Controller
{
    /**
     * 初始化
     */
    protected function _initialize()
    {
        if (config('site_close')) {
            error(config('site_close_msg'));
        }
    }

    /**
     * 展示注册页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::get('register.php', $request->param(), ['proxyDomain' => config('register_page_proxy_domain')]);
        $register = new responser\Register($response, ['noCheckLogin' => true]);
        $this->assign($register->index());
        return $this->fetch('Register/index');
    }

    /**
     * 注册
     * @param Request $request
     */
    public function register(Request $request)
    {
        if (!$request->isPost()) error('非法请求');

        $response = Proxy::post(
            'register.php',
            $request->param(),
            null,
            ['proxyDomain' => config('register_page_proxy_domain')]
        );
        if ($response['code'] !== 200) {
            $this->error(
                '远端连接错误' .
                (empty($response['errorMsg']) ? '（' . $response['code'] . '）' : '：' . $response['errorMsg'])
            );
        }
        $cookies = $response['cookies'];
        $userCookieName = config('const.kfCookiePrefix') . config('const.userAccountCookieName');
        if (isset($cookies[$userCookieName])) {
            cookie($userCookieName, $cookies[$userCookieName], ['prefix' => '', 'expire' => 60 * 60 * 24 * 356, 'httponly' => 'true']);
        }

        new responser\Responser($response, ['jumpUrl' => url('/')]);
        return error('注册失败');
    }

    /**
     * 检查用户名
     * @param Request $request
     * @return mixed
     */
    public function check(Request $request)
    {
        if (!$this->request->isPost()) error('非法请求');

        $response = Proxy::post(
            'register.php',
            $request->param(),
            null,
            ['proxyDomain' => config('register_page_proxy_domain')]
        );
        new responser\Responser($response, ['noCheckLogin' => true]);

        $matches = [];
        $msgId = null;
        if (preg_match('/parent\.retmsg\(\'(\d+)\'\);/i', $response['document'], $matches)) {
            $msgId = intval($matches[1]);
        }
        $msgList = [
            '用户名长度错误',
            '此用户名包含不可接受字符或被管理员屏蔽，请选择其它用户名',
            '为了避免论坛用户名混乱，用户名中禁止使用大写字母，请使用小写字母',
            '该用户名已经被注册，请选用其他用户名',
            '恭喜您，该用户名还未被注册，您可以使用这个用户名注册',
        ];
        if ($msgId + 1 > count($msgList)) $msgId = null;
        $type = $msgId === 4 ? 'success' : 'error';
        $msg = $msgId === null ? '服务端错误' : $msgList[$msgId];

        return ['type' => $type, 'msg' => $msg];
    }
}
