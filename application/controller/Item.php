<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 我的物品页面控制器
 * @package app\controller
 */
class Item extends Base
{
    /**
     * 展示物品商店页面
     * @param Request $request
     * @return mixed
     */
    public function shop(Request $request)
    {
        $response = Proxy::get('kf_fw_ig_shop.php');
        $item = new responser\Item($response);
        $data = $item->shop();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Item/shop', $data);
    }
}
