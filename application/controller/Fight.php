<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 争夺页面控制器
 * @package app\controller
 */
class Fight extends Base
{
    /**
     * 展示争夺排行页面
     * @param Request $request
     * @return mixed
     */
    public function rank(Request $request)
    {
        $response = Proxy::get('kf_fw_ig_pklist.php');
        $fight = new responser\Fight($response);
        $data = $fight->rank();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Fight/rank', $data);
    }

    /**
     * 展示战力光环页面
     * @param Request $request
     * @return mixed
     */
    public function halo(Request $request)
    {
        $response = Proxy::get('kf_fw_ig_halo.php');
        $fight = new responser\Fight($response);
        $data = $fight->halo();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Fight/halo', $data);
    }

    /**
     * 提升战力光环
     * @param Request $request
     * @return mixed
     */
    public function buyHalo(Request $request)
    {
        $response = Proxy::get('kf_fw_ig_halo.php?do=buy', $request->param());
        new responser\Responser($response);
        return error('提升战力光环失败');
    }

    /**
     * 展示争夺帮助说明页面
     * @param Request $request
     * @return mixed
     */
    public function readme(Request $request)
    {
        $response = Proxy::get('kf_fw_ig_readme.php');
        $fight = new responser\Fight($response);
        $data = $fight->readme();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Fight/readme', $data);
    }
}
