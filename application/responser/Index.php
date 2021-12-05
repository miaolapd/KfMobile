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
        $pqSmArea = pq('.k_ale.k_ale_blue');
        $smLevel = trim($pqSmArea->find('> .k_lh40:first-child > .k_f32')->text());
        $smTips = $pqSmArea->find('> .k_lh40:first-child > span:nth-child(2)')->attr('title');
        $smCoefficient = trim($pqSmArea->find('> .k_lh40:nth-child(2) > .k_f24:first-child')->text());
        $smRank = trim($pqSmArea->find('> .k_lh40:nth-child(2) > .k_f24:nth-child(2)')->text());

        $kfb = 0;
        $gongXian = 0;
        if (preg_match('/(-?\d+)KFB\s*\|\s*(-?\d+(?:\.\d+)?)贡献/', $pqSmArea->next('.k_ale')->find('> a:first-child'), $matches)) {
            $kfb = intval($matches[1]);
            $gongXian = floatval($matches[2]);
        }

        // 最新回复
        $newReplyList = [];
        $pqNewReplyList = pq('.indexlbtc');
        foreach ($pqNewReplyList as $newReplyNode) {
            $pqNewReplyNode = pq($newReplyNode);
            $pqLink = $pqNewReplyNode->find('> a');

            $threadTitle = '';
            if (preg_match('/《(.+?)》/', $pqLink->attr('title'), $matches)) {
                $threadTitle = trim_strip($matches[1]);
            }
            $threadUrl = $pqLink->attr('href');
            $threadForumName = trim($pqLink->find('> .indexlbtc_t > .indexlbtc_l')->text());
            $threadForumName = mb_substr($threadForumName, 1, 2);
            $threadReplyNum = trim($pqLink->find('> .indexlbtc_t > .indexlbtc_h')->text());
            $threadTime = trim($pqLink->find('> .indexlbtc_s')->text());
            $threadAuthor = $pqLink->attr('uname');

            $linkData = [
                'threadUrl' => convert_url($threadUrl),
                'threadTitle' => $threadTitle,
                'threadForumName' => $threadForumName,
                'threadReplyNum' => $threadReplyNum,
                'threadTime' => $threadTime,
                'threadAuthor' => $threadAuthor,
            ];
            $newReplyList[] = $linkData;
        }
        $newReplyPerPageNum = 11; // 每页帖子数量
        $newReplyPageCount = ceil(count($newReplyList) / $newReplyPerPageNum);

        // 最新发表
        $newPublishList = [];
        $pqNewPublishPanel = pq('.rightboxa:nth-type(2)');
        foreach ($pqNewPublishPanel->find('> a') as $newPublishNode) {
            $pqNewPublishNode = pq($newPublishNode);
            $pqLink = $pqNewPublishNode->find('> a');

            $threadUrl = $pqLink->attr('href');
            $threadTitle = $pqLink->find('.righttita')->text();
            $threadTime = $pqLink->find('.k_fr')->text();

            $linkData = [
                'threadUrl' => convert_url($threadUrl),
                'threadTitle' => $threadTitle,
                'threadTime' => $threadTime,
            ];
            $newPublishList[] = $linkData;
        }

        // 最新发表 & 最新被推 & 内部管理
        $newExtraList = [];
        $pqPanelList = pq('.rightboxa');
        foreach ($pqPanelList as $panelNode) {
            $pqPanel = pq($panelNode);
            $panelTitle = trim($pqPanel->find('.k_f18')->text());

            $index = count($newExtraList);
            $tabTitle = $panelTitle == '内部管理区' ? '内部管理' : ($panelTitle == '最新被推帖' ? '最新被推' : '最新发表');
            $newExtraList[$index] = [
                'title' => $tabTitle,
                'data' => [],
            ];

            foreach ($pqPanel->find('> a') as $i => $link) {
                $pqLink = pq($link);
                $threadUrl = $pqLink->attr('href');
                $threadTitle = $pqLink->find('.righttita')->text();
                $threadTime = $pqLink->find('.k_fr')->text();
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
            'smCoefficient' => $smCoefficient,
            'smRank' => $smRank,
            'smTips' => $smTips,
            'newReplyPageCount' => $newReplyPageCount,
            'newReplyPerPageNum' => $newReplyPerPageNum,
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
