<?php

namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 银行页面控制器
 * @package app\controller
 */
class Bank extends Base
{
    /**
     * 展示银行页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::get('hack.php?H_name=bank', $request->param());
        $bank = new responser\Bank($response);
        $data = $bank->index();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Bank/index', $data);
    }

    /**
     * 银行服务
     * @param Request $request
     */
    public function service(Request $request)
    {
        if (!$request->isPost()) error('非法请求');
        $response = Proxy::post('hack.php?H_name=bank', $request->param());
        new responser\Responser($response);
        return error('操作失败');
    }

    /**
     * 展示银行日志页面
     * @param Request $request
     * @return mixed
     */
    public function log(Request $request)
    {
        $to = empty(input('to', '')) ? 0 : 1;
        $response = Proxy::get('hack.php?H_name=bank&action=log', $request->param());
        $bank = new responser\Bank($response);
        $data = $bank->log(['to' => $to]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('Bank/log', $data);
    }
}
