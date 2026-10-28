<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 版块页面控制器
 * @package app\controller
 */
class Thread extends Base
{
    /**
     * 展示版块页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::get('thread.php', $request->param());
        $thread = new responser\Thread($response);
        $extraData = [
            'jpn' => input('fid/d', 0) === 98,
            'type' => input('type/d', 0),
            'orderway' => input('orderway', ''),
        ];
        $data = $thread->index($extraData);
        if ($request->isAjax()) return $data;
        else return $this->fetch($extraData['jpn'] ? 'Thread/jpn' : 'Thread/index', $data);
    }
}
