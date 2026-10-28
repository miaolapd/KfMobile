<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 关键词页面控制器
 * @package app\controller
 */
class GuanJianCi extends Base
{
    /**
     * 展示关键词页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::get('guanjianci.php', $request->param());
        $gjc = new responser\GuanJianCi($response);
        $data = $gjc->index();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GuanJianCi/index', $data);
    }
}
