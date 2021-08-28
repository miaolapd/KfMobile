<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 搜索页面控制器
 * @package app\controller
 */
class Search extends Base
{
    /**
     * 展示搜索页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::post('search.php', $request->param());
        $search = new responser\Search($response);
        $data = $search->index();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Search/index', $data);
    }
}
