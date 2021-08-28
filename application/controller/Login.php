<?php
namespace app\controller;

use think\Controller;
use think\Request;
use app\lib\Proxy;
use app\responser\Responser;

/**
 * 登录页面控制器
 * @package app\controller
 */
class Login extends Controller
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
     * 展示登录页面
     * @param bool $isRemote 是否获取远端页面
     * @param string|null $jumpUrl 跳转URL
     * @return mixed
     */
    public function index($isRemote = true, $jumpUrl = null)
    {
        if ($isRemote) {
            $response = Proxy::get('login.php');
            new Responser($response, ['noCheckLogin' => true]);
        }
        $this->assign([
            'jumpUrl' => !empty($jumpUrl) ? $jumpUrl : url('/'),
            'noInfo' => true,
            'pcVersionUrl' => config('pc_version_domain'),
        ]);
        return $this->fetch('Login/index');
    }

    /**
     * 登录
     * @param Request $request
     */
    public function login(Request $request)
    {
        if (!$request->isPost()) error('非法请求');

        $response = Proxy::post('login.php', $request->param());
        if ($response['code'] !== 200) {
            $this->error(
                '远端连接错误' .
                (empty($response['errorMsg']) ? '（' . $response['code'] . '）' : '：' . $response['errorMsg'])
            );
        }
        $cookies = $response['cookies'];
        $userCookieName = config('const.kfCookiePrefix') . config('const.userAccountCookieName');
        if (isset($cookies[$userCookieName])) {
            $expire = input('cktime', 0) ? 60 * 60 * 24 * 356 : 0;
            cookie($userCookieName, $cookies[$userCookieName], ['prefix' => '', 'expire' => $expire, 'httponly' => 'true']);
        }

        new Responser($response, ['jumpUrl' => input('jumpurl', '')]);
        return error('登录失败');
    }

    /**
     * 登出
     * @param Request $request
     */
    public function logout(Request $request)
    {
        $response = Proxy::get('login.php?action=quit&verify=' . $request->param('verify', ''));
        new Responser($response, ['jumpUrl' => url('/')]);
        return error('登出失败');
    }
}
