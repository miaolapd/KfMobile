<?php
namespace app\responser;

/**
 * 银行页面响应类
 * @package app\responser
 */
class Bank extends Responser
{
    /**
     * 获取银行页面的响应数据
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

        // 银行信息
        $pqBank = pq('.bank1');
        $bankHtml = $pqBank->html();
        $gongXian = 0;
        $minTransferNum = 0;
        $maxTransferNum = PHP_INT_MAX;
        $cash = 0;
        $currentDeposit = 0;
        $fixedDeposit = 0;
        $fixedDepositExpires = 90; // 定期存款期限
        $interest = 0;
        $interestRate = 0;
        $fee = 0;
        if (preg_match('/你所拥有的贡献：(-?\d+(?:\.\d+)?)/', $bankHtml, $matches)) {
            $gongXian = floatval($matches[1]);
        }
        if (preg_match('/\(注意你转账的是贡献，最小\[(\d+(?:\.\d+)?)\]，最大\[(\d+(?:\.\d+)?)\]，超过最大值请分多次转账\)/', $bankHtml, $matches)) {
            $minTransferNum = floatval($matches[1]);
            $maxTransferNum = floatval($matches[2]);
        }
        if (preg_match('/当前所持：(-?\d+)KFB/', $bankHtml, $matches)) {
            $cash = intval($matches[1]);
        }
        if (preg_match('/活期存款：(-?\d+)KFB/', $bankHtml, $matches)) {
            $currentDeposit = intval($matches[1]);
        }
        if (preg_match('/定期存款：(-?\d+)KFB/', $bankHtml, $matches)) {
            $fixedDeposit = intval($matches[1]);
        }
        if (preg_match('/可获利息：(\d+)/', $bankHtml, $matches)) {
            $interest = intval($matches[1]);
        }
        if (preg_match('/定期利息：([\d+\.]+)%/', $bankHtml, $matches)) {
            $interestRate = floatval($matches[1]);
        }
        if ($fixedDeposit > 0) {
            $expectedInterest = floor($fixedDeposit * $interestRate / 100 * $fixedDepositExpires);
        }
        if (preg_match('/手续费([\d+\.]+)%/', $bankHtml, $matches)) {
            $fee = floatval($matches[1]);
        }

        $data = [
            'gongXian' => $gongXian,
            'minTransferNum' => $minTransferNum,
            'maxTransferNum' => $maxTransferNum,
            'cash' => $cash,
            'currentDeposit' => $currentDeposit,
            'fixedDeposit' => $fixedDeposit,
            'interest' => $interest,
            'interestRate' => $interestRate,
            'fee' => $fee,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取银行日志页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function log($extraData = [])
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

        // 操作记录列表
        $logList = [];
        foreach (pq('.bank1 > tr:gt(1):not(:last)') as $item) {
            $pqItem = pq($item);
            $no = trim_strip($pqItem->find('td:first-child')->text());
            $type = trim_strip($pqItem->find('td:nth-child(2)')->text());
            $description = $pqItem->find('td:nth-child(3) > div')->html();
            $description = preg_replace_callback(
                '/<b>(.+?)<\/b>/i',
                function ($matches) {
                    return sprintf('<b>%s</b>', $matches[1]);
                },
                $description
            );
            $actionTime = trim_strip($pqItem->find('td:nth-child(4)')->text());
            $ip = trim_strip($pqItem->find('td:nth-child(5)')->text());
            $logList[] = [
                'no' => $no,
                'type' => $type,
                'description' => $description,
                'actionTime' => $actionTime,
                'ip' => $ip,
            ];
        }

        $data = [
            'currentPageNum' => $currentPageNum,
            'prevPageNum' => $currentPageNum > 1 ? $currentPageNum - 1 : 1,
            'nextPageNum' => $currentPageNum < $maxPageNum ? $currentPageNum + 1 : $maxPageNum,
            'maxPageNum' => $maxPageNum,
            'pageParam' => $pageParam,
            'logList' => $logList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
