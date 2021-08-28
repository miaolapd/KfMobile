<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 我的页面控制器
 * @package app\controller
 */
class Personal extends Base
{
    /**
     * 展示我的主题页面
     * @param Request $request
     * @return mixed
     */
    public function topic(Request $request)
    {
        $response = Proxy::get('personal.php', $request->param());
        $personal = new responser\Personal($response);
        $data = $personal->topic();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Personal/topic', $data);
    }

    /**
     * 展示我的回复页面
     * @param Request $request
     * @return mixed
     */
    public function reply(Request $request)
    {
        $response = Proxy::get('personal.php?action=post&ptable=1', $request->param());
        $personal = new responser\Personal($response);
        $data = $personal->reply();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Personal/reply', $data);
    }
}
