<?php

namespace app\responser;

/**
 * 版块页面响应类
 * @package app\responser
 */
class Thread extends Responser
{
    /**
     * 获取版块页面的响应数据
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

        // 日本语版
        if ($extraData['jpn']) {
            $fid = 98;
            $forumName = '苍雪日本語版';
            $subForumList = [];
            foreach (pq('td.b_tit4')->parent('tr') as $subForum) {
                $pqSubForum = pq($subForum);

                $pqSubForumLink = $pqSubForum->find('a[href^="thread.php?fid="]');
                $subFid = 0;
                if (preg_match('/fid=(\d+)/i', $pqSubForumLink->attr('href'), $matches)) {
                    $subFid = intval($matches[1]);
                }
                $subForumName = trim_strip($pqSubForumLink->contents()->eq(0)->text());

                $pqSubForumThreadLink = $pqSubForum->find('a[href^="read.php?tid="]');
                $subTid = 0;
                if (preg_match('/tid=(\d+)/i', $pqSubForumThreadLink->attr('href'), $matches)) {
                    $subTid = intval($matches[1]);
                }
                $subThreadInfo = trim_strip($pqSubForumThreadLink->text());

                $subForumList[] = ['fid' => $subFid, 'forumName' => $subForumName, 'tid' => $subTid, 'threadInfo' => $subThreadInfo];
            }

            $data = [
                'fid' => $fid,
                'forumName' => $forumName,
                'subForumList' => $subForumList,
            ];
            debug('end');
            trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
            if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
            return array_merge($commonData, $data);
        }

        // 版块导航
        $fid = 0;
        $forumName = '';
        $parentFid = 0;
        $parentForumName = '';
        $subForumList = [];
        $pqForumList = pq('.b_tit5:first > li > a[href^="thread.php?fid="]');
        if (!$pqForumList->length) error('版块ID错误！');
        $pqCurrentForum = $pqForumList->eq($pqForumList->length - 1);
        if (preg_match('/fid=(\d+)/i', $pqCurrentForum->attr('href'), $matches)) {
            $fid = intval($matches[1]);
        }
        $forumName = trim_strip($pqCurrentForum->text());
        if ($pqForumList->length === 2) {
            $pqParentForum = $pqForumList->eq(0);
            if (preg_match('/fid=(\d+)/i', $pqParentForum->attr('href'), $matches)) {
                $parentFid = intval($matches[1]);
            }
            $parentForumName = trim_strip($pqParentForum->text());
        }
        $pqSubForumList = pq('td.b_tit4 > a[href^="thread.php?fid="]');
        foreach ($pqSubForumList as $subForum) {
            $pqSubForum = pq($subForum);
            $subFid = 0;
            if (preg_match('/fid=(\d+)/i', $pqSubForum->attr('href'), $matches)) {
                $subFid = intval($matches[1]);
            }
            $subForumName = trim_strip($pqSubForum->contents()->eq(0)->text());
            $subForumList[] = ['fid' => $subFid, 'forumName' => $subForumName];
        }

        // 版块规则
        $forumRule = '';
        $pqForumTopArea = pq('.b_tit5:first')->parent('td')->parent('tr')->parent('table');
        if ($pqForumTopArea->children('tr')->length === 3) {
            $pqForumRule = $pqForumTopArea->find('> tr:nth-child(2) > td');
            if (!$pqForumRule->find('form')->length) {
                $pqForumRule->find('a')->addClass('alert-link');
                $forumRule = str_replace('href="faq.php"', 'href="faq.php?id=101"', $pqForumRule->html());
                $forumRule = replace_common_html_content($forumRule);
                $forumRule = str_ireplace('color="blue"', '', $forumRule);
                $forumRule = str_ireplace('color="red"', 'class="text-danger"', $forumRule);
                $forumRule = preg_replace('/color="#?000000"/i', 'class="text-gray-dark"', $forumRule);
            }
        }

        // 主题分类
        $threadTypeList = [];
        $pqThreadTypeList = pq('.pages:eq(1) > li > a[href*="&type="]');
        foreach ($pqThreadTypeList as $threadType) {
            $pqThreadType = pq($threadType);
            $typeId = 0;
            $typeName = '';
            $typeColor = '#000';
            if (preg_match('/type=(\d+)/', $pqThreadType->attr('href'), $matches)) {
                $typeId = intval($matches[1]);
            }
            $typeName = trim_strip($pqThreadType->text());
            $typeColor = $pqThreadType->find('font')->attr('color');
            $threadTypeList[] = [
                'typeId' => $typeId,
                'typeName' => $typeName,
                'typeColor' => $typeColor,
            ];
        }

        // 分页导航
        $currentPageNum = 1;
        $totalPageNum = 1;
        $maxPageNum = 1;
        $pageParam = '';
        $pqPages = pq('.pages:first');
        if (preg_match('/-\s*(\d+)\s*-/', $pqPages->find('li > a[href="javascript:;"]')->text(), $matches)) {
            $currentPageNum = intval($matches[1]);
        }
        $pqEndPage = $pqPages->find('li:last-child > a');
        if (preg_match('/…(\d+)页/', $pqEndPage->text(), $matches)) {
            $totalPageNum = intval($matches[1]);
        }
        if (preg_match('/(?<!\w)page=(\d+)/', $pqEndPage->attr('href'), $matches)) {
            $maxPageNum = intval($matches[1]);
        }
        $pageParam = http_build_query($request->except('page'));

        // 主题列表
        $threadList = [];
        foreach (pq('.thread1 > tr:gt(2)') as $item) {
            $pqItem = pq($item);
            if (!$pqItem->find('td:nth-child(2) > .threadtit1')->length) continue;

            // 主题状态
            $pqStatusCell = $pqItem->find('td:first-child');
            $status = '';
            $isRating = false;
            $status = trim_strip($pqStatusCell->find('a')->text());
            if ($status === '新') $status = '';
            $isRating = preg_match('/background:#B9FFB9/i', $pqStatusCell->attr('style')) > 0;

            // 主题链接
            $pqThreadLinkCell = $pqItem->find('td:nth-child(2) > .threadtit1');
            $typeName = '';
            $typeColor = '#000';
            $pqThreadType = $pqThreadLinkCell->find('a[href*="type="] > font');
            if ($pqThreadType->length > 0) {
                $typeName = trim_strip($pqThreadType->text());
                $typeColor = $pqThreadType->attr('color');
            }
            $isNewWorks = $pqThreadLinkCell->find('font:contains("[新作]")')->length > 0;
            $pqThreadLink = $pqThreadLinkCell->find('a[href^="read.php?tid="]');
            $threadUrl = convert_url($pqThreadLink->attr('href'));
            if (preg_match('/tid=(\d+)/i', $pqThreadLink->attr('href'), $matches)) {
                $tid = intval($matches[1]);
            }
            $threadName = trim($pqThreadLink->html());

            // 主题回复数和点击数
            $pqThreadNumCell = $pqItem->find('td:nth-child(3) a');
            $replyNum = 0;
            $hitNum = '-';
            $replyNum = intval(trim($pqThreadNumCell->contents()->eq(0)->text()));
            $hitNum = trim_strip($pqThreadNumCell->find('span:last')->text());

            // 主题作者、最后回复人、发表时间、最后回复时间
            $pqThreadInfoCell = $pqItem->find('td:last-child');
            $authorUid = '';
            $sf = '';
            $author = '';
            $publishTime = '';
            $lastReplier = '';
            $lastReplyTime = '';
            $isNewThread = false;
            $pqAuthor = $pqThreadInfoCell->find('a.bl');
            if (preg_match('/uid=(\d+)(?:&sf=(\w+))?/', $pqAuthor->attr('href'), $matches)) {
                $authorUid = intval($matches[1]);
                $sf = $matches[2];
            }
            $author = trim_strip($pqAuthor->text());
            $pqThreadInfoContents = $pqThreadInfoCell->contents();
            if (preg_match('/(\d+(:|-)\d+)/', $pqThreadInfoContents->eq(1)->text(), $matches)) {
                $publishTime = $matches[1];
            }
            if (preg_match('/(\S+)\s*\|\s*(\d+(:|-)\d+)/', trim($pqThreadInfoContents->eq($pqThreadInfoContents->length - 1)->text()), $matches)) {
                $lastReplier = $matches[1];
                $lastReplyTime = $matches[2];
            }
            $isNewThread = strpos($publishTime, ':') && strpos($lastReplyTime, ':');

            $threadList[] = [
                'status' => $status,
                'isRating' => $isRating,

                'typeName' => $typeName,
                'typeColor' => $typeColor,
                'isNewWorks' => $isNewWorks,
                'threadUrl' => $threadUrl,
                'threadName' => $threadName,

                'replyNum' => $replyNum,
                'hitNum' => $hitNum,

                'authorUid' => $authorUid,
                'sf' => $sf,
                'author' => $author,
                'publishTime' => $publishTime,
                'lastReplier' => $lastReplier,
                'lastReplyTime' => $lastReplyTime,
                'isNewThread' => $isNewThread,
            ];
        }

        $data = [
            'fid' => $fid,
            'forumName' => $forumName,
            'parentFid' => $parentFid,
            'parentForumName' => $parentForumName,
            'subForumList' => $subForumList,
            'forumRule' => $forumRule,
            'threadTypeList' => $threadTypeList,
            'threadTypeParam' => http_build_query($request->except(['page', 'type'])),
            'threadSortByParam' => http_build_query($request->except(['page', 'orderway'])),
            'currentPageNum' => $currentPageNum,
            'prevPageNum' => $currentPageNum > 1 ? $currentPageNum - 1 : 1,
            'nextPageNum' => $currentPageNum < $maxPageNum ? $currentPageNum + 1 : $maxPageNum,
            'totalPageNum' => $totalPageNum,
            'maxPageNum' => $maxPageNum,
            'pageParam' => $pageParam,
            'threadList' => $threadList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
