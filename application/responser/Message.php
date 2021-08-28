<?php
namespace app\responser;

/**
 * 短消息页面响应类
 * @package app\responser
 */
class Message extends Responser
{
    /**
     * 获取短消息页面的响应数据
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
        $commonData = array_merge($this->getCommonData($doc), $this->getHeaderData(), $extraData);
        $matches = [];
        $request = request();

        // 分页导航
        $currentPageNum = 1;
        $maxPageNum = 1;
        $pageParam = '';
        $pqPages = pq('.pages:first');
        if (preg_match('/-\s*(\d+)\s*-/', $pqPages->find('li > a[href="javascript:;"]')->text(), $matches)) {
            $currentPageNum = intval($matches[1]);
        }
        $pqEndPage = $pqPages->find('li:last-child > a');
        if (preg_match('/(?<!\w)page=(\d+)/', $pqEndPage->attr('href'), $matches)) {
            $maxPageNum = intval($matches[1]);
        }
        $pageParam = http_build_query($request->except('page'));

        // 信箱状态
        $msgBoxInfo = pq('form[name="del"]')->prev('div')->prev('div')->find('> table > tr:first-child > td')->html();
        $msgBoxInfo = str_replace('信箱状态：', '<b>信箱状态：</b>', $msgBoxInfo);
        $msgBoxInfo = str_replace(
            '<font color="red">[信箱已满，请删除一些，以查看最新消息]</font>',
            '<br><span class="text-danger">(信箱已满，请删除一些，以查看最新消息)</span>',
            $msgBoxInfo
        );

        // 短消息列表
        $messageList = [];
        foreach (pq('.thread1 > tr:gt(0):not(:last)') as $item) {
            $pqItem = pq($item);
            $no = trim_strip($pqItem->find('td:first-child')->text());

            $pqMsgLink = $pqItem->find('td:nth-child(2) > a');
            $mid = 0;
            if (preg_match('/mid=(\d+)/i', $pqMsgLink->attr('href'), $matches)) {
                $mid = intval($matches[1]);
            }
            $msgTitle = trim_strip($pqMsgLink->text());

            $pqSendUserLink = $pqItem->find('td:nth-child(3) > a');
            $sendUid = 0;
            if (preg_match('/uid=(\d+)/i', $pqSendUserLink->attr('href'), $matches)) {
                $sendUid = intval($matches[1]);
            }
            $sendUserName = trim_strip($pqSendUserLink->text());

            $pqReceiveUserLink = $pqItem->find('td:nth-child(4) > a');
            $receiveUid = 0;
            if (preg_match('/uid=(\d+)/i', $pqReceiveUserLink->attr('href'), $matches)) {
                $receiveUid = intval($matches[1]);
            }
            $receiveUserName = trim_strip($pqReceiveUserLink->text());

            $sendTime = trim_strip($pqItem->find('td:nth-child(5)')->text());

            $unRead = false;
            $canSelect = false;
            $canEdit = false;
            if ($extraData['action'] === 'receivebox' || $extraData['action'] === 'scout') {
                $unRead = trim($pqItem->find('td:nth-child(6)')->text()) === '否';
            }
            $canSelect = $pqItem->find(
                    sprintf('td:nth-child(%d) > input[type="checkbox"]', $extraData['action'] === 'sendbox' ? 6 : 7)
                )->length > 0;
            if ($extraData['action'] === 'scout') {
                $canEdit = $pqItem->find('td:nth-child(8) > a[href*="edmid"]')->length > 0;
            }

            $messageList[] = [
                'no' => $no,
                'mid' => $mid,
                'msgTitle' => $msgTitle,
                'sendUid' => $sendUid,
                'sendUserName' => $sendUserName,
                'receiveUid' => $receiveUid,
                'receiveUserName' => $receiveUserName,
                'sendTime' => $sendTime,
                'unRead' => $unRead,
                'canSelect' => $canSelect,
                'canEdit' => $canEdit,
            ];
        }

        $data = [
            'currentPageNum' => $currentPageNum,
            'prevPageNum' => $currentPageNum > 1 ? $currentPageNum - 1 : 1,
            'nextPageNum' => $currentPageNum < $maxPageNum ? $currentPageNum + 1 : $maxPageNum,
            'maxPageNum' => $maxPageNum,
            'pageParam' => $pageParam,
            'msgBoxInfo' => $msgBoxInfo,
            'messageList' => $messageList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取屏蔽列表页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function banned($extraData = [])
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
        $commonData = array_merge($this->getCommonData($doc), $this->getHeaderData(), $extraData);
        $matches = [];

        // 屏蔽列表
        $bannedList = trim_strip(pq('textarea[name="banidinfo"]')->val());

        $data = [
            'bannedList' => $bannedList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取查看消息页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function read($extraData = [])
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
        $commonData = array_merge($this->getCommonData($doc), $this->getHeaderData(), $extraData);
        $matches = [];

        // 短消息信息
        $pqArea = pq('.thread2');
        $mid = 0;
        $toWhere = '';
        if (preg_match('/towhere=(\w+)&delids=(\d+)/i', $pqArea->find('a[href*="delids="]')->attr('href'), $matches)) {
            $toWhere = $matches[1];
            $mid = intval($matches[2]);
        }
        $toUid = 0;
        if (preg_match('/touid=(\d+)/i', $pqArea->find('a[href*="touid="]')->attr('href'), $matches)) {
            $toUid = intval($matches[1]);
        }
        $msgUserName = trim_strip($pqArea->find('tr:nth-child(2) > td:last-child')->text());
        $msgTitle = trim_strip($pqArea->find('tr:nth-child(3) > td:last-child')->text());
        $sendTime = trim_strip($pqArea->find('tr:nth-child(4) > td:last-child')->text());

        // 短消息内容
        $pqMsgContent = $pqArea->find('tr:nth-child(5) > td:last-child');
        Read::handleFloorElements($pqMsgContent);
        $msgContent = replace_floor_content(replace_common_html_content($pqMsgContent->html()));
        $msgContent = preg_replace('/<\/blockquote>\n?<br>(<br>)?/i', '</blockquote>', $msgContent);
        $isTransfer = false;
        if ($msgUserName === 'SYSTEM' && $msgTitle === '收到了他人转账的贡献') {
            $isTransfer = true;
            $msgContent = preg_replace_callback(
                '/会员\[(.+?)\]通过论坛银行功能给你转帐(\d+(?:\.\d+)?)贡献/',
                function ($matches) {
                    return sprintf(
                        '会员[<a class="not-click-link" href="%s" target="_blank" data-not-click="true">%s</a>]通过论坛银行功能给你转帐 ' .
                        '<b class="d-inline-block text-orange">%s</b> 贡献',
                        url('Profile/show', 'username=' . $matches[1]),
                        $matches[1],
                        $matches[2]
                    );
                },
                $msgContent
            );
        }

        $data = [
            'mid' => $mid,
            'toWhere' => $toWhere,
            'toUid' => $toUid,
            'msgUserName' => $msgUserName,
            'msgTitle' => $msgTitle,
            'sendTime' => $sendTime,
            'msgContent' => $msgContent,
            'isTransfer' => $isTransfer,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取发送消息页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function write($extraData = [])
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
        $commonData = array_merge($this->getCommonData($doc), $this->getHeaderData(), $extraData);
        $matches = [];

        $paArea = pq('.thread2');
        $sendUserName = trim_strip($paArea->find('input[name="pwuser"]')->val());
        $msgTitle = trim_strip($paArea->find('input[name="msg_title"]')->val());
        $msgContent = ltrim(htmlspecialchars($paArea->find('#atc_content')->val()));
        $msgContent = str_replace('&amp;', '&', $msgContent);
        $msgContent = str_replace("\xc2\xa0", " ", $msgContent);
        $msgContent = preg_replace('/\n\n$/', "\n", $msgContent);
        $editMid = intval(pq('input[name="edmid"]')->val());
        if (is_nan($editMid)) $editMid = 0;

        $data = [
            'sendUserName' => $sendUserName,
            'msgTitle' => $msgTitle,
            'msgContent' => $msgContent,
            'editMid' => $editMid,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取头部的响应数据
     * @return array 头部的响应数据
     */
    protected function getHeaderData()
    {
        // 清空信箱验证code
        $clearMsgBoxVerifyCode = '';
        if (preg_match('/message\.php\?action=clear&ckcode=(\w+)\'\);/i', $this->response['document'], $matches)) {
            $clearMsgBoxVerifyCode = $matches[1];
        }
        return ['clearMsgBoxVerifyCode' => $clearMsgBoxVerifyCode];
    }
}
