<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 首页控制器
 * @package app\controller
 */
class Index extends Base
{
    /**
     * 首页
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::get('index.php', $request->param());
        $index = new responser\Index($response);
        $data = $index->index();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Index/index', $data);
    }

    /**
     * 自定义布局页面
     * @param Request $request
     * @return mixed
     */
    public function layout(Request $request)
    {
        $response = Proxy::get('diy_indexfidnum.php', $request->param());
        $responser = new responser\Responser($response);
        $data = $responser->response();
        return $this->fetch('Index/layout', $data);
    }

    /**
     * 修改布局
     * @param Request $request
     */
    public function changeLayout(Request $request)
    {
        $response = Proxy::get('diy_indexfidnum.php?do=2', $request->param());
        new responser\Responser($response);
        return error('修改布局失败');
    }
}
