<?php
namespace app\responser;

/**
 * 帮助页面响应类
 * @package app\responser
 */
class Faq extends Responser
{
    /**
     * 获取帮助页面的响应数据
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

        $faqId = $extraData['id'];

        $pqArea = pq('.kf_gd1')->parent();

        // 问题列表
        $questionList = [];
        $questionTitle = '';
        foreach ($pqArea->find('> .kf_gd1 > tr > td > a') as $item) {
            $pqItem = pq($item);
            $id = 0;
            $title = '';
            if (preg_match('/id=(\d+)/i', $pqItem->attr('href'), $matches)) {
                $id = intval($matches[1]);
            }
            $title = trim_strip($pqItem->text());
            if ($id == $faqId) {
                $questionTitle = $title;
            }
            $questionList[] = ['id' => $id, 'title' => $title];
        }


        // 问题内容
        $pqArea->find('> .kf_gd1:first')->remove();
        $pqArea->find('> .line')->remove();
        if ($pqArea->find('> .kf_gd2')->length > 0) {
            $pqContentCell = $pqArea->find('> .kf_gd2 > tr > td');
        }
        else {
            $pqContentCell = $pqArea;
        }
        $pqContentCell = $this->handleSpecialFaq($faqId, $pqContentCell);

        $questionContent = replace_common_html_content($pqContentCell->html());

        $data = [
            'faqId' => $faqId,
            'questionList' => $questionList,
            'questionTitle' => $questionTitle,
            'questionContent' => $questionContent,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 处理特殊帮助内容
     * @param string $faqId 当前帮助ID
     * @param \phpQueryObject $pqContentCell
     * @return \phpQueryObject 帮助内容节点
     */
    protected function handleSpecialFaq($faqId, $pqContentCell) {
        // 处理评分奖励规则
        if ($faqId == '102') {
            $pqTable = $pqContentCell->find('> .kf_gd1');
            $pqTable->addClass('table table-responsive table-bordered table-striped');

            $pqTable->wrapInner('<tbody></tbody>');

            $pqTableHeader = $pqTable->find('> tbody > tr:first-child');
            $pqTableHeader->prependTo($pqTable);
            $pqTableHeader->wrap('<thead class="thead-light faq-thead"></thead>');
            $pqTableHeader->html(preg_replace('/\btd\b/', 'th', $pqTableHeader->html()));

            foreach ($pqTable->find('> tbody > tr > td:first-child') as $item) {
                $pqItem = pq($item);
                $cellContent = $pqItem->text();
                $pqItem->replaceWith('<th>' . $cellContent . '</th>');
            }
        }

        return $pqContentCell;
    }
}
