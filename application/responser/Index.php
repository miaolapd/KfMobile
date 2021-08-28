<?php

namespace app\responser;

/**
 * 首页响应类
 * @package app\responser
 */
class Index extends Responser
{
    /**
     * 获取首页的响应数据
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

        // 功能区
        $kfb = 0;
        $gongXian = 0;
        if (preg_match('/(-?\d+)KFB\s*\|\s*(-?\d+(?:\.\d+)?)贡献/', pq('a.rightbox1[title="网站虚拟货币"]')->text(), $matches)) {
            $kfb = intval($matches[1]);
            $gongXian = floatval($matches[2]);
        }
        $pqSmArea = pq('a.rightbox1[href="kf_growup.php"]');
        $smLevel = 0;
        $smRank = '';
        if (preg_match('/神秘(-?\d+)级\s*\(系数排名第\s*(\d+\+?)\s*位\)/', $pqSmArea->text(), $matches)) {
            $smLevel = intval($matches[1]);
            $smRank = $matches[2];
        }
        $smTips = $pqSmArea->attr('title');

        // 最新回复 & 最新主题
        $newReplyList = [];
        $newPublishList = [];
        $pqPanelTitleList = pq('.indexlbtit2tit');
        foreach ($pqPanelTitleList as $panelTitleNode) {
            $pqPanelTitleNode = pq($panelTitleNode);
            $panelTitle = trim($pqPanelTitleNode->text());
            $pqPanel = $pqPanelTitleNode->parent('li')->parent('ul');

            if (mb_strpos($panelTitle, '最新回复') > 0) {
                $currentList = &$newReplyList;
                $index = count($currentList);
                $title = mb_ereg_replace('最新回复', '', $panelTitle);
                if ($title == '综合') $title = $title . ($index + 1);
                $currentList[$index] = [
                    'title' => $title,
                    'data' => [],
                ];
            } else {
                $currentList = &$newPublishList;
                $index = count($currentList);
                $title = mb_ereg_replace('最新主题', '', $panelTitle);
                if ($title == '综合') $title = $title . ($index + 1);
                $currentList[$index] = [
                    'title' => $title,
                    'data' => [],
                ];
            }

            foreach ($pqPanel->find('> li.indexlbtit2 > a') as $i => $link) {
                $pqLink = pq($link);
                if ($i !== 0 && $i % 11 === 0) {
                    $index++;
                    $title = mb_ereg_replace(mb_strpos($panelTitle, '最新回复') > 0 ? '最新回复' : '最新主题', '', $panelTitle);
                    if ($title == '综合') $title = $title . ($index + 1);
                    $currentList[$index] = [
                        'title' => $title,
                        'data' => [],
                    ];
                }

                $threadUrl = $pqLink->attr('href');
                $threadTitle = $pqLink->find('.indexlbtit2_t')->text();
                $threadTime = $pqLink->find('.indexlbtit2_s')->text();
                $linkData = [
                    'threadUrl' => convert_url($threadUrl),
                    'threadTitle' => $threadTitle,
                    'threadTime' => $threadTime,
                ];
                $currentList[$index]['data'][] = $linkData;
            }
        }


        // 内部管理 & 最新被推
        $newExtraList = [];
        $pqPanelTitleList = pq('.rightlbtit_tit');
        foreach ($pqPanelTitleList as $panelTitleNode) {
            $pqPanelTitleNode = pq($panelTitleNode);
            $panelTitle = trim($pqPanelTitleNode->text());
            $pqPanel = $pqPanelTitleNode->parent('li')->parent('ul');

            $index = count($newExtraList);
            $newExtraList[$index] = [
                'title' => $panelTitle == '内部管理专用' ? '内部管理' : '最新被推',
                'data' => [],
            ];

            foreach ($pqPanel->find('> li.rightlbtit > a') as $i => $link) {
                $pqLink = pq($link);
                $threadUrl = $pqLink->attr('href');
                $threadTitle = $pqLink->find('.rightlbtit_t')->text();
                $threadTime = $pqLink->find('.rightlbtit_s')->text();
                $linkData = [
                    'threadUrl' => convert_url($threadUrl),
                    'threadTitle' => $threadTitle,
                    'threadTime' => $threadTime,
                ];
                $newExtraList[$index]['data'][] = $linkData;
            }
        }

        $data = [
            'kfb' => $kfb,
            'gongXian' => $gongXian,
            'smLevel' => $smLevel,
            'smRank' => $smRank,
            'smTips' => $smTips,
            'newReplyList' => $newReplyList,
            'newPublishList' => $newPublishList,
            'newExtraList' => $newExtraList,
            'pcVersionUrl' => $commonData['pcVersionUrl'] . '?nomible=1',
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
