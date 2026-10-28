<?php

namespace app\responser;

/**
 * 我的物品页面响应类
 * @package app\responser
 */
class Item extends Responser
{
    /**
     * 获取物品商店页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function shop($extraData = [])
    {
        debug('begin');
        $doc = null;
        $initTime = 0;
        try {
            debug('initBegin');
            $doc = \phpQuery::newDocumentHTML($this->response['document']);
            debug('initEnd');
            $initTime = debug('initBegin', 'initEnd');
        } catch (\Exception $ex) {
            $this->handleError($ex);
        }
        $commonData = array_merge($this->getCommonData($doc), $extraData);
        $matches = [];

        // 物品列表
        $itemList = [];
        foreach (pq('.kf_fw_ig1 > tr:gt(0)') as $item) {
            $pqItem = pq($item);
            $itemId = 0;
            if (preg_match('/wp_(\d+)/', $pqItem->find('> td:nth-child(3)')->attr('id'), $matches)) {
                $itemId = $matches[1];
            }
            if (!$itemId) continue;
            $itemName = trim($pqItem->find('> td:first-child')->html());

            $price = trim($pqItem->find('> td:nth-child(2)')->html());
            $price = preg_replace_callback('/\d+/', function ($matches) {
                return number_format($matches[0]);
            }, $price);

            $intro = trim($pqItem->find('> td:nth-child(4)')->html());
            $intro = preg_replace_callback('/\d+/', function ($matches) {
                return number_format($matches[0]);
            }, $intro);

            $itemList[] = [
                'itemId' => $itemId,
                'itemName' => $itemName,
                'price' => $price,
                'intro' => $intro,
            ];
        }

        $data = [
            'itemList' => $itemList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
