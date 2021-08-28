<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 等级经验页面控制器
 * @package app\controller
 */
class GrowUp extends Base
{
    /**
     * 展示等级经验页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::get('kf_growup.php', $request->param());
        $growUp = new responser\GrowUp($response);
        $data = $growUp->index();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GrowUp/index', $data);
    }

    /**
     * 领取每日奖励
     * @param Request $request
     */
    public function getBonus(Request $request)
    {
        $response = Proxy::get('kf_growup.php?ok=3', $request->param());
        new responser\Responser($response);
        return error('领取每日奖励失败');
    }

    /**
     * 更换ID颜色
     * @param Request $request
     */
    public function changeColor(Request $request)
    {
        $response = Proxy::get('kf_growup.php?ok=2', $request->param());
        new responser\Responser($response);
        return error('更换ID颜色失败');
    }
}
