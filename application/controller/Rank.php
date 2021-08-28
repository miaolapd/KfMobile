<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 论坛排行页面控制器
 * @package app\controller
 */
class Rank extends Base
{
    /**
     * 展示论坛排行页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $type = input('no1', '');
        if (!in_array($type, ['sm', 'cz', 'gz', 'ft', 'gx'])) $type = 'sm';
        $response = Proxy::get('kf_no1.php', $request->param());
        $rank = new responser\Rank($response);
        $data = $rank->index(['type' => $type]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('Rank/index', $data);
    }
}
