<?php

namespace app\responser;

/**
 * 注册页面响应类
 * @package app\responser
 */
class Register extends Responser
{
    /**
     * 获取注册页面的响应数据
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

        // 隐藏字段
        $data = [];
        foreach (pq('input[type="hidden"]') as $item) {
            $pqItem = pq($item);
            $name = $pqItem->attr('name');
            if (empty($name)) continue;
            $data[$name] = trim_strip($pqItem->val());
        }

        // 用户名检查函数
        $data['nameCheckFunc'] = '';
        if (preg_match('/(function namecheck\(\) \{[\s\S]+\})\r\nfunction retmsg/i', $this->response['document'], $matches)) {
            $data['nameCheckFunc'] = str_replace('if(username == lastname){', 'if(false && username == lastname){', $matches[1]);
            $data['nameCheckFunc'] = str_replace('document.checkForm.submit();', '', $data['nameCheckFunc']);
        }

        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
