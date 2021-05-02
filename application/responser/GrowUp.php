<?php
namespace app\responser;

/**
 * 等级经验页面响应类
 * @package app\responser
 */
class GrowUp extends Responser
{
    /**
     * 获取等级经验页面的响应数据
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

        $pqArea = pq('#alldiv > .drow:nth-child(3) > .dcol:nth-child(2) > div:first');

        // 等级经验
        $expInfo = '';
        $expPercent = 0;
        $expInfo = $pqArea->find('> div:first')->html();
        $expInfo = preg_replace('/神秘系数\s*(\d+)\s*\|\s*/', '神秘系数 [ <b>$1</b> ] | <br class="d-sm-none">', $expInfo);
        $pgExpProgress = $pqArea->find('> div:eq(1) > div:first');
        if (preg_match('/(\d+)%/', $pgExpProgress->find('> div:last > span')->text(), $matches)) {
            $expPercent = intval($matches[1]);
        }

        // 每日奖励
        $dailyBonusList = [];
        foreach (pq('div[class^="gro_"]') as $node) {
            $pqNode = pq($node);
            $info = trim($pqNode->html());
            $isComplete = $pqNode->hasClass('gro_divlv');
            $dailyBonusList[] = ['info' => $info, 'isComplete' => $isComplete];
        }
        $getBonusText = trim(pq('a[href^="kf_growup.php?ok=3&safeid="]:contains("你可以领取")')->html());
        $getBonusText = str_replace('经验 +', '经验 +<br>', $getBonusText);
        $getBonusText = str_replace(' 请点击这里', '', $getBonusText);

        // 自定义ID颜色
        $colorList = [];
        foreach (pq('table[width="860"]:last > tr:gt(0) > td') as $node) {
            $pqNode = pq($node);
            $color = '';
            $colorId = 0;
            $colorLevel = 0;
            if (preg_match('/background-color:([#\w]+);/', $pqNode->attr('style'), $matches)) {
                $color = $matches[1];
            }
            if (preg_match('/color=(\d+)/', $pqNode->find('a')->attr('href'), $matches)) {
                $colorId = intval($matches[1]);
            } else if (preg_match('/需(\d+)神秘等级/', $pqNode->find('span')->text(), $matches)) {
                $colorLevel = intval($matches[1]);
            }
            $colorList[] = ['color' => $color, 'id' => $colorId, 'level' => $colorLevel];
        }

        $data = [
            'expInfo' => $expInfo,
            'expPercent' => $expPercent,
            'dailyBonusList' => $dailyBonusList,
            'getBonusText' => $getBonusText,
            'colorList' => $colorList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
