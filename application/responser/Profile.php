<?php
namespace app\responser;

/**
 * 身份页面响应类
 * @package app\responser
 */
class Profile extends Responser
{
    /**
     * 获取个人详细信息页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function show($extraData = [])
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

        $pqLog = pq('.log1');
        // 基本信息
        $profileUid = 0;
        $profileUserName = '';
        $profileAvatar = '';
        if (preg_match('/^(.+)\s详细信息/', $pqLog->find('tr:first-child > td:first-child')->text(), $matches)) {
            $profileUserName = trim_strip($matches[1]);
        }
        $pqSecondLine = $pqLog->find('tr:last-child');
        $pqAvatarCell = $pqSecondLine->find('td:first-child');
        $profileAvatar = $pqAvatarCell->find('div > img.pic')->attr('src');
        if (strpos($profileAvatar, 'none.gif')) $profileAvatar = '';
        elseif (strpos($profileAvatar, 'http') !== 0) $profileAvatar = '/' . $profileAvatar;
        if (preg_match('/authorid=(\d+)/i', $pqAvatarCell->find('a[href^="search.php?authorid="]'), $matches)) {
            $profileUid = intval($matches[1]);
        }

        // 详细信息
        $pqDetailsHtml = $pqSecondLine->find('td:nth-child(2)')->html();
        $pqDetailsHtml .= $pqSecondLine->find('td:nth-child(3)')->html();
        $profileDetails = explode('<br>', $pqDetailsHtml);
        foreach ($profileDetails as &$line) {
            $line = str_replace("\r\n", "", $line);
            $line = str_replace("\t", "", $line);
            $line = preg_replace('/([^<>]+?)：/', '<strong>$1：</strong>', trim($line), 1);
            $line = preg_replace_callback(
                '/\(\s*<b>(在线|离线)<\/b>\s*\)/',
                function ($matches) {
                    $isOnline = false;
                    if (trim($matches[1]) === '在线') $isOnline = true;
                    return sprintf('<span class="badge badge-%s ml-1">%s</span>', $isOnline ? 'success' : 'secondary', $isOnline ? '在线' : '离线');
                },
                $line
            );
            $line = preg_replace(
                '/(系统等级：<\/strong>)(\S+)/',
                '$1<span class="text-danger">$2</span>',
                $line
            );
            $line = preg_replace(
                '/(注册时间：<\/strong>)(\d+-\d+-\d+)/',
                '$1<span id="registerDate" data-toggle="tooltip">$2</span>',
                $line
            );
            $line = preg_replace_callback(
                '/(-?\d+)\s*(帖|KFB|小时|级)/',
                function ($matches) {
                    return sprintf('<span data-num="%d">%s</span>&nbsp;%s', $matches[1], number_format(intval($matches[1])), $matches[2]);
                },
                $line
            );
            $line = preg_replace_callback(
                '/(-?\d+(?:\.\d+)?)\s*\(见注1\)/',
                function ($matches) {
                    return sprintf('<span data-num="%s">%s</span>&nbsp;<span class="text-secondary">(见注1)</span>', $matches[1], $matches[1]);
                },
                $line
            );
        }

        $data = [
            'profileUid' => $profileUid,
            'profileUserName' => $profileUserName,
            'profileAvatar' => $profileAvatar,
            'profileDetails' => $profileDetails,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取收藏夹页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function favor($extraData = [])
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

        // 收藏夹目录列表
        $catalogList = [];
        foreach (pq('#cate_tid > tr:gt(1) a:not([href*="job=deltype"])') as $item) {
            $pqItem = pq($item);
            $id = 0;
            $catalogName = '';
            if (preg_match('/type=(\d+)/i', $pqItem->attr('href'), $matches)) {
                $id = intval($matches[1]);
            }
            $catalogName = trim_strip($pqItem->text());
            $catalogList[] = ['id' => $id, 'name' => $catalogName];
        }

        // 帖子列表
        $threadList = [];
        foreach (pq('form[name="form"]:last > table > tr:gt(0)') as $item) {
            $pqItem = pq($item);
            $tid = 0;
            $threadTitle = '';
            $fid = 0;
            $threadForum = '';
            $authorUid = 0;
            $author = '';

            $pqThreadLink = $pqItem->find('> td:first-child > a');
            $oriThreadLink = $pqThreadLink->attr('href');
            $threadLink = convert_url($oriThreadLink);
            if (preg_match('/tid=(\d+)/i', $oriThreadLink, $matches)) {
                $tid = intval($matches[1]);
            }
            $threadTitle = trim($pqThreadLink->html());

            $pqForumLink = $pqItem->find('> td:nth-child(2) > a');
            if (preg_match('/fid=(\d+)/i', $pqForumLink->attr('href'), $matches)) {
                $fid = intval($matches[1]);
            }
            $threadForum = trim_strip($pqForumLink->text());

            $pqAuthorLink = $pqItem->find('> td:nth-child(3) > a');
            if (preg_match('/uid=(\d+)/i', $pqAuthorLink->attr('href'), $matches)) {
                $authorUid = intval($matches[1]);
            }
            $author = trim_strip($pqAuthorLink->text());

            $threadList[] = [
                'tid' => $tid,
                'threadLink' => $threadLink,
                'threadTitle' => $threadTitle,
                'fid' => $fid,
                'threadForum' => $threadForum,
                'authorUid' => $authorUid,
                'author' => $author,
            ];
        }

        $data = [
            'catalogList' => $catalogList,
            'threadList' => $threadList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取好友列表页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function friend($extraData = [])
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

        // 好友列表
        $friendList = [];
        foreach (pq('.f_one:not(:last)') as $item) {
            $pqItem = pq($item);
            $isOnline = trim($pqItem->find('> td:nth-child(2) > b')->text()) === '在线';
            $pqFriendLink = $pqItem->find('> td:nth-child(3) > a');
            $friendUid = 0;
            $friendName = trim_strip($pqFriendLink->text());
            if (preg_match('/uid=(\d+)/i', $pqFriendLink->attr('href'), $matches)) {
                $friendUid = intval($matches[1]);
            }
            $description = $pqItem->find('> td:nth-child(4) > input')->val();
            $addTime = trim_strip($pqItem->find('> td:nth-child(5)')->text());
            $friendList[] = [
                'isOnline' => $isOnline,
                'uid' => $friendUid,
                'name' => $friendName,
                'description' => $description,
                'addTime' => $addTime,
            ];
        }

        $data = [
            'friendList' => $friendList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取账号设置页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function modify($extraData = [])
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

        // 设置字段
        $data = [];
        foreach (pq('input[type="text"], input[type="radio"]:checked, select, input[type="hidden"]') as $item) {
            $pqItem = pq($item);
            $name = $pqItem->attr('name');
            if (empty($name)) continue;
            $data[$name] = trim_strip($pqItem->val());
        }

        // 头像
        $data['avatar'] = pq('img[name="useravatars"]')->attr('src');
        if (strpos($data['avatar'], 'http') !== 0) $data['avatar'] = '/' . $data['avatar'];
        $data['avatarWidth'] = trim_strip(pq('input[name="uploadurl[1]"]')->val());
        $data['avatarHeight'] = trim_strip(pq('input[name="uploadurl[2]"]')->val());
        if (preg_match('/整形优惠券(\d+)x20/', pq('span:contains("整形优惠券")')->html(), $matches)) {
            $data['couponNum'] = intval($matches[1]);
            if ($data['couponNum'] > 3) $data['couponNum'] = 3;
        }

        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
