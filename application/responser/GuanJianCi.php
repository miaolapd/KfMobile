<?php
namespace app\responser;

/**
 * 关键词页面响应类
 * @package app\responser
 */
class GuanJianCi extends Responser
{
    /**
     * 获取关键词页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function index($extraData = [])
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

        // 关键词
        $gjc = '';
        if (preg_match('/含有关键词 “(.+)” 的内容/', pq('.kf_share1 tr:first')->text(), $matches)) {
            $gjc = trim_strip($matches[1]);
        }

        // 关键词帖子列表
        $threadList = [];
        foreach (pq('.kf_share1:eq(1) > tr:gt(0)') as $item) {
            $pqItem = pq($item);
            $time = trim_strip($pqItem->find('td:first-child')->text());
            $type = trim_strip($pqItem->find('td:nth-child(2)')->text());
            $pqThread = $pqItem->find('td:nth-child(3) > a');
            $threadUrl = convert_url($pqThread->attr('href'));
            $threadName = trim_strip($pqThread->text());
            $publisher = trim_strip($pqItem->find('td:nth-child(4)')->text());
            $threadList[] = [
                'time' => $time,
                'type' => $type,
                'threadUrl' => $threadUrl,
                'threadName' => $threadName,
                'publisher' => $publisher,
            ];
        }

        $data = [
            'gjc' => $gjc,
            'threadList' => $threadList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
