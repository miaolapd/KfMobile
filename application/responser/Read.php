<?php

namespace app\responser;

/**
 * 主题页面响应类
 * @package app\responser
 */
class Read extends Responser
{
    /**
     * 获取主题页面的响应数据
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
        $request = request();

        // 主题信息
        $pqThreadInfo = pq('td[colspan="2"]:contains("收藏本帖")')->eq(0);
        $pqForumNav = $pqThreadInfo->find('a[href^="thread.php?fid="]');
        $tid = intval(pq('input[name="tid"]')->val());
        $threadTitle = trim_strip(pq('table:not(.thread1) > tr:first-child > td[colspan="2"]')->eq(0)->text());
        $fid = intval(pq('input[name="fid"]')->val());
        $forumName = trim_strip($pqForumNav->eq($pqForumNav->length - 1)->text());
        $parentFid = 0;
        $parentForumName = '';
        $hitNum = 0;
        $replyNum = 0;
        $publishTime = '';
        $tuiNum = 0;
        $isSeeAll = pq('.readtext:first')->find('> table > tr > td > div > div:nth-child(2) > a:contains("全看")')->length > 0;
        if ($pqForumNav->length >= 2) {
            if (preg_match('/fid=(\d+)/', $pqForumNav->eq(0)->attr('href'), $matches)) {
                $parentFid = intval($matches[1]);
            }
            $parentForumName = trim_strip($pqForumNav->eq(0)->text());
        }
        if (preg_match('/点击：(\d+|-).+回复数：(\d+).+发表时间：(\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2})/', $pqThreadInfo->text(), $matches)) {
            $hitNum = $matches[1];
            $replyNum = intval($matches[2]);
            $publishTime = $matches[3];
        }
        if (preg_match('/推!\s*(\d+)/', pq('#read_tui')->text(), $matches)) {
            $tuiNum = intval($matches[1]);
        }

        // 分页导航
        $currentPageNum = 1;
        $maxPageNum = 1;
        $pageParam = [];
        $sf = '';
        $pqPages = pq('.pages:first');
        if (preg_match('/-\s*(\d+)\s*-/', $pqPages->find('li > a[href="javascript:;"]')->text(), $matches)) {
            $currentPageNum = intval($matches[1]);
        }
        if (preg_match('/(?<!\w)page=(\d+)/', $pqPages->find('li:last-child > a')->attr('href'), $matches)) {
            $maxPageNum = intval($matches[1]);
        }
        if (preg_match('/(?<!\w)sf=(\w+)/', $pqPages->find('li:first-child > a')->attr('href'), $matches)) {
            $sf = $matches[1];
        }
        $sf = empty($sf) ? input('sf', '') : $sf;
        $pageParamList = $request->except(['page', 'sf']);
        if (!empty($sf)) {
            $pageParamList['sf'] = $sf;
        }
        $pageParam = http_build_query($pageParamList);

        // 楼层
        $canBlockFloor = pq('a[href^="kf_fw_0ladmin.php"]')->length > 0;
        $floorList = [];
        foreach (pq('.readtext') as $floor) {
            $floorList[] = $this->floor(pq($floor));
        }
        $goodPostTips = '';
        $pqGoodPostTips = pq('a[id^="cztz"]:first')->parent()->contents()->eq(3);
        if ($pqGoodPostTips->length > 0) $goodPostTips = trim($pqGoodPostTips->get(0)->textContent);

        // 回帖表单
        $postContentName = pq('[name="atc_content"]')->attr('name');
        $postVerify = pq('input[name="verify"]')->val();
        $hasMoveThreadLink = pq('#ad_move')->length > 0;

        // 投票区域
        $voteTitle = '';
        $voteStatus = 'open';
        $voteTotalCount = 0;
        $maxVoteCount = 0;
        $voteList = [];
        $votedInfo = '';
        $voteLimitNum = 0;
        $pqVoteForm = pq('form[name="vote"]');
        if ($pqVoteForm->length > 0) {
            $pqSubmit = $pqVoteForm->find('input[type="submit"]');
            if (preg_match('/限选个数：(\d+)/', $pqSubmit->parent()->text(), $matches)) {
                $voteLimitNum = intval($matches[1]);
            }
            if (!$pqSubmit->length) {
                if ($pqVoteForm->find('b > a[href*="action=modify"]')->length > 0) $voteStatus = 'voted';
                else $voteStatus = 'close';
            }
            if ($pqVoteForm->find('input[name="voteaction"][value="modify"]')->length > 0) $voteStatus = 'modify';
            $pqVoteArea = $pqVoteForm->find('.thread1');
            $voteTitle = trim_strip($pqVoteArea->find('tr:first-child > td:first-child')->text());
            $voteTitle = str_replace('(本次投票已结束)', '<span class="badge badge-danger">已结束</span>', $voteTitle);
            $votedInfo = trim($pqVoteArea->find('tr:last-child > td')->html());
            $pqVoteItem = $pqVoteArea->children('tr');
            foreach ($pqVoteItem->slice(1, $pqVoteArea->length - 2) as $item) {
                $pqItem = pq($item);
                $itemType = '';
                $itemValue = '';
                $itemName = '';
                $itemVoteCount = 0;

                $pqItemName = $pqItem->find('td:first-child');
                $pqInput = $pqItemName->find('input');
                if ($pqInput->length > 0) {
                    $itemType = $pqInput->attr('type');
                    $itemValue = $pqInput->val();
                }
                $itemName = trim_strip($pqItemName->find('b')->text());

                if (preg_match('/(\d+|\*)/', $pqItem->find('td:nth-child(2)')->text(), $matches)) {
                    if ($matches[1] === '*') $itemVoteCount = -1;
                    else {
                        $itemVoteCount = intval($matches[1]);
                        $voteTotalCount += $itemVoteCount;
                        if ($maxVoteCount < $itemVoteCount) $maxVoteCount = $itemVoteCount;
                    }
                }

                $voteList[] = [
                    'itemType' => $itemType,
                    'itemValue' => $itemValue,
                    'itemName' => $itemName,
                    'itemVoteCount' => $itemVoteCount,
                ];
            }
        }

        $data = [
            'tid' => $tid,
            'threadTitle' => $threadTitle,
            'fid' => $fid,
            'forumName' => $forumName,
            'isSeeAll' => $isSeeAll,
            'parentFid' => $parentFid,
            'parentForumName' => $parentForumName,
            'hitNum' => $hitNum,
            'replyNum' => $replyNum,
            'publishTime' => $publishTime,
            'tuiNum' => $tuiNum,
            'sf' => $sf,
            'currentPageNum' => $currentPageNum,
            'prevPageNum' => $currentPageNum > 1 ? $currentPageNum - 1 : 1,
            'nextPageNum' => $currentPageNum < $maxPageNum ? $currentPageNum + 1 : $maxPageNum,
            'maxPageNum' => $maxPageNum,
            'pageParam' => $pageParam,
            'canBlockFloor' => $canBlockFloor,
            'floorList' => $floorList,
            'goodPostTips' => $goodPostTips,
            'postContentName' => $postContentName,
            'postVerify' => $postVerify,
            'hasMoveThreadLink' => $hasMoveThreadLink,
            'voteTitle' => $voteTitle,
            'voteStatus' => $voteStatus,
            'maxVoteCount' => $maxVoteCount,
            'voteTotalCount' => $voteTotalCount,
            'voteList' => $voteList,
            'votedInfo' => $votedInfo,
            'voteLimitNum' => $voteLimitNum,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取楼层的响应数据
     * @param \phpQueryObject $pqFloor
     * @return array 响应数据
     */
    protected function floor($pqFloor)
    {
        $matches = [];

        // 楼层顶部信息
        $floorNum = 0;
        $pqFloorTop = $pqFloor->find('table > tr > td:nth-child(2) > div:first-child > div:nth-child(2)');
        $pqFloorUser = $pqFloor->find('.readidms');
        $pid = $pqFloor->prev('.readlou')->prev('a')->attr('name');
        $floorNumText = $pqFloorTop->find('> span:first-child')->text();
        if (preg_match('/(\d+)楼/', $floorNumText, $matches)) {
            $floorNum = intval($matches[1]);
        }
        $isAdmin = strpos($floorNumText, '（管理成员）') > 0;
        $publishTime = trim_strip($pqFloorTop->find('> span:nth-child(2)')->text());
        $sign = trim_strip($pqFloorTop->find('> span:nth-child(3)')->text());

        // 楼层用户信息
        $uid = 0;
        $sf = '';
        $smColor = '';
        if (preg_match('/#\w+/', $pqFloor->attr('style'), $matches)) {
            $smColor = $matches[0];
        }
        $pqAvatar = $pqFloorUser->find('.readidmstop > img');
        $avatar = $pqAvatar->attr('src');
        if (strpos($avatar, 'none.gif') > 0) $avatar = '';
        elseif (!empty($avatar) && strpos($avatar, 'http') !== 0) $avatar = '/' . $avatar;

        $pqUserLink = $pqFloorUser->find('.readidmsbottom:eq(0) > a');
        if (preg_match('/uid=(\d+)(?:&sf=(\w+))?/', $pqUserLink->attr('href'), $matches)) {
            $uid = intval($matches[1]);
            $sf = $matches[2];
        }
        $userName = trim_strip($pqUserLink->text());

        $smLevel = trim_strip(str_replace(' ', '', $pqFloorUser->find('.readidmsbottom:eq(1) > span:nth-child(2)')->text()));
        $gameRank = trim_strip($pqFloorUser->find('.readidmsbottom:eq(2) > span:nth-child(2)')->text());

        $content = $this->getFloorContent($pqFloor->find('tr > td:nth-child(2) > div'));

        return [
            'pid' => $pid,
            'floorNum' => $floorNum,
            'isAdmin' => $isAdmin,
            'publishTime' => $publishTime,
            'sign' => $sign,
            'avatar' => $avatar,
            'uid' => $uid,
            'sf' => $sf,
            'userName' => $userName,
            'smLevel' => $smLevel,
            'gameRank' => $gameRank,
            'smColor' => $smColor,
            'content' => $content,
        ];
    }

    /**
     * 获取楼层内容
     * @param \phpQueryObject $pqFloor
     * @return string 楼层内容
     */
    protected function getFloorContent($pqFloor)
    {
        // 替换楼层内容
        $floorHtml = '';
        if (preg_match('/^\s*<div[\s\S]+?<\/div>\s*<div[\s\S]+?<\/div>([\s\S]+)$/', $pqFloor->html(), $matches)) {
            $floorHtml = $matches[1];
        }
        $pqFloor->html(replace_floor_content(replace_common_html_content($floorHtml)));

        $this::handleFloorElements($pqFloor);

        // 处理编辑标志
        foreach ($pqFloor->find('div[id^="alert_"]') as $node) {
            $pqNode = pq($node);
            $pqNode->replaceWith('<div class="floor_edit_mark">' . $pqNode->html() . '</div>');
        }

        // 处理附件节点
        $pqFloor->find('div[id^="att_"]')->addClass('attach')->removeAttr('style');

        return $pqFloor->html();
    }

    /**
     * 处理楼层内的各元素
     * @param \phpQueryObject $pqFloor
     */
    public static function handleFloorElements(&$pqFloor)
    {
        // 处理fieldset节点
        foreach ($pqFloor->find('fieldset') as $node) {
            $pqNode = pq($node);
            self::handleFieldsetElement($pqNode);
        }

        // 处理表格节点
        $pqFloor->find('table')->addClass('table table-bordered table-sm')->removeAttr('style');
    }

    /**
     * 处理楼层内的Fieldset元素
     * @param \phpQueryObject $pqNode
     */
    public static function handleFieldsetElement($pqNode)
    {
        foreach ($pqNode->find('fieldset') as $subNode) {
            self::handleFieldsetElement(pq($subNode));
        }

        $pqNode->addClass('fieldset');
        if ($pqNode->is('.read_fds')) {
            $pqNode->removeClass('read_fds')->addClass('fieldset-alert');
            if ($pqNode->find('legend:contains("我的其他帖子")')->length > 0) {
                $pqNode->addClass('my-other-thread-list');
            }
        } elseif ($pqNode->find('legend:contains("Quote:")')->length > 0) {
            $pqNode->replaceWith(
                '<blockquote class="blockquote"><p>' . str_replace('<legend>Quote:</legend>', '', $pqNode->html()) . '</p></blockquote>'
            );
        } elseif ($pqNode->find('legend:contains("此帖售价")')->length > 0) {
            $pqLegend = $pqNode->find('legend');
            $buyInfo = '';
            $price = 0;
            $matches = [];
            if (preg_match('/此帖售价\s*(\d+)\s*KFB,已有\s*(\d+)\s*人购买/i', $pqLegend->html(), $matches)) {
                $price = intval($matches[1]);
                $buyInfo = sprintf('售价 %d KFB，有 %d 人购买', $price, $matches[2]);
            }
            $pqLegend->contents()->get(0)->textContent = $buyInfo;
            $pqLegend->find('select')->addClass('custom-select custom-select-sm w-auto buy-thread-list')
                ->find('option:first-child')->text('名单')
                ->after('<option value="copyList">复制名单</option>');
            $pqBuyBtn = $pqLegend->find('input[type="button"]');
            $pid = 0;
            if (preg_match('/pid=(\w+)/i', $pqBuyBtn->attr('onclick'), $matches)) {
                $pid = $matches[1];
            }
            $pqBuyBtn->replaceWith(
                sprintf(
                    '<button class="btn btn-warning btn-sm buy-thread-btn" data-pid="%s" data-price="%d" type="button">' .
                    '<i class="fa fa-shopping-cart" aria-hidden="true"></i> 购买</button>',
                    $pid,
                    $price
                )
            );
            $pqNode->find('b:contains("购买后可见本内容")')->addClass('font-size-sm');
        } elseif ($pqNode->find('legend:contains("Copy code")')->length > 0) {
            $pqNode->find('legend')->remove();
            $codeHtml = $pqNode->html();
            $pqNode->replaceWith(
                '<div class="code-area"><a class="copy-code" href="#" title="复制代码" role="button">复制代码</a>' .
                '<pre class="pre-scrollable">' . $codeHtml . '</pre></div>'
            );
        } elseif ($pqNode->find('legend:contains("提示")')->length > 0) {
            $pqNode->addClass('font-size-sm');
        }
    }
}
