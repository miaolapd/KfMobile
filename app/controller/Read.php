<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 主题页面控制器
 * @package app\controller
 */
class Read extends Base
{
    /**
     * 展示主题页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $fpage = input('fpage/d', 0);
        $floor = input('floor/d', 0);
        $response = Proxy::get('read.php', $request->param());
        $read = new responser\Read($response);
        $data = $read->index();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Read/index', array_merge($data, ['fpage' => $fpage, 'floor' => $floor]));
    }

    /**
     * 屏蔽回帖
     * @param Request $request
     * @return mixed
     */
    public function blockFloor(Request $request)
    {
        $response = Proxy::get('kf_fw_0ladmin.php', $request->param(), ['referer' => input('server.HTTP_REFERER', '')]);
        new responser\Responser($response);
        return error('屏蔽回帖失败');
    }
}
