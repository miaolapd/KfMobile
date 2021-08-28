<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 最新共享页面控制器
 * @package app\controller
 */
class Share extends Base
{
    /**
     * 展示最新共享页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $type = input('ti', '');
        if (!in_array($type, ['16', '41', '67', '68', '92', '127', 'cn'])) $type = 'all';
        $response = Proxy::get('kf_share.php', $request->param());
        $share = new responser\Share($response);
        $data = $share->index(['type' => $type]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('Share/index', $data);
    }
}
