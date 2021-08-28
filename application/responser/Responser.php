<?php

namespace app\responser;

use think\Cookie;

/**
 * 响应类
 * @package app\responser
 */
class Responser
{
    // 回应数据
    protected $response = null;
    // 跳转URL
    protected $jumpUrl = '';
    // 不检查登录状态
    protected $noCheckLogin = false;

    /**
     * 响应类构造方法
     * @param array $response 回应数据
     * @param array $extraData 额外参数
     */
    public function __construct($response, $extraData = [])
    {
        $this->response = $response;
        $this->jumpUrl = !empty($extraData['jumpUrl']) ? $extraData['jumpUrl'] : '';
        $this->noCheckLogin = !empty($extraData['noCheckLogin']) ? $extraData['noCheckLogin'] : false;
        $this->_initialize();
    }

    /**
     * 初始化
     */
    protected function _initialize()
    {
        $code = $this->response['code'];
        if ($code === 301 || $code === 302) {
            trace('跳转url：' . $this->response['location']);
            controller('Msg')->redirectUrl($this->response['location']);
        } elseif ($code !== 200) {
            error(
                '远端连接错误' .
                (empty($this->response['errorMsg']) ? '（' . $code . '）' : '：' . $this->response['errorMsg'])
            );
        }
        $this->setResponseCookies($this->response['cookies']);

        $document = $this->response['document'];
        $matches = [];
        if (preg_match(
            '/<span style="[^"]+">(.+?)<\/span><br\s*\/><a href="([^"]+)">如果您的浏览器没有自动跳转,请点击这里<\/a><\/div>/i',
            $document,
            $matches
        )) {
            $msg = $matches[1];
            $jumpUrl = $matches[2];
            trace('跳转url：' . $jumpUrl);
            $msg = preg_replace_callback(
                '/href="?([^>"]+)"?>/i',
                function ($matches) {
                    return 'class="alert-link" href="' . convert_url($matches[1]) . '">';
                },
                $msg
            );
            success($msg, !empty($this->jumpUrl) ? $this->jumpUrl : $jumpUrl);
        } elseif (preg_match('/操作提示<br\s*\/>\r\n(.+?)<br\s*\/>\r\n<a href="javascript:history\.go\(-1\);">/i', $document, $matches)) {
            error($matches[1]);
        }
    }

    /**
     * 设置服务器返回的cookies
     * @param array $cookies cookies数组
     * @param int $expire cookies保存时间
     */
    protected function setResponseCookies($cookies, $expire = 0)
    {
        $userAccountCookieName = config('const.kfCookiePrefix') . config('const.userAccountCookieName');
        foreach ($cookies as $key => $value) {
            if (strpos($value, 'deleted') === 0) {
                Cookie::delete($key, '');
            } else {
                if ($key === $userAccountCookieName) {
                    continue;
                } elseif (strpos($key, 'g_intro_') === 0) {
                    Cookie::set($key, $value, ['prefix' => '', 'expire' => 60 * 60 * 48, 'httponly' => '']);
                } else {
                    Cookie::set($key, $value, ['prefix' => '', 'expire' => $expire, 'httponly' => 'true']);
                }
            }
        }
    }

    /**
     * 获取页面通用数据
     * @param \phpQueryObject $doc 页面文档对象
     * @return array 页面通用数据
     */
    protected function getCommonData(\phpQueryObject $doc)
    {
        $matches = [];
        $request = request();

        $title = trim_strip(pq('title', $doc)->text());
        $keywords = trim_strip(pq('meta[name="keywords"]', $doc)->attr('content'));
        $description = trim_strip(pq('meta[name="description"]', $doc)->attr('content'));

        $pqUserMenu = pq('#kf_information > ul', $doc);

        $pqUserName = pq('#kf_topuser > a[href="javascript:;"]', $doc);
        $userName = '';
        if ($pqUserName->length > 0) $userName = trim_strip($pqUserName->contents()->get(0)->textContent);
        $userTitle = trim_strip($pqUserName->attr('title'));

        $pqUid = $pqUserMenu->find('> li > a[href^="profile.php?action=show&uid="]');
        $uid = 0;
        if (preg_match('/&uid=(\d+)/i', $pqUid->attr('href'), $matches)) $uid = intval($matches[1]);
        if (!$userName && !$this->noCheckLogin) {
            success('请登录', 'login/index');
        }

        $hasNewMsg = trim($pqUserMenu->find('a[href="message.php"]')->text()) === '有新消息';
        $hasNewAtTips = trim($pqUserMenu->find('a[href^="guanjianci.php"]')->text()) === '有人@我';
        $hasNewRateMsg = trim($pqUserMenu->find('a[href^="kf_fw_1wkfb.php"]')->text()) === '有新评分';

        $verify = '';
        if (preg_match('/&verify=(\w+)/', $pqUserMenu->find('a[href^="login.php?action=quit&verify="]')->attr('href'), $matches)) {
            $verify = $matches[1];
        }
        $safeId = '';
        if (preg_match('/&?safeid=(\w+)/', pq('a[href*="safeid="]:first', $doc)->attr('href'), $matches)) {
            $safeId = $matches[1];
        } else {
            $safeId = pq('input#safeid, input[name="safeid"]', $doc)->eq(0)->val();
        }
        $imgPath = '';
        if (preg_match('/var imgpath\s*=\s*\'(\d+)\';/', $this->response['document'], $matches)) {
            $imgPath = $matches[1];
        }

        $pcVersionUrl = str_replace(config('proxy_domain'), config('pc_version_domain'), $this->response['remoteUrl']);
        return [
            'title' => $title,
            'keywords' => $keywords,
            'description' => $description,
            'uid' => $uid,
            'userName' => $userName,
            'userTitle' => $userTitle,
            'hasNewMsg' => $hasNewMsg,
            'hasNewAtTips'=> $hasNewAtTips,
            'hasNewRateMsg' => $hasNewRateMsg,
            'verify' => $verify,
            'safeId' => $safeId,
            'imgPath' => $imgPath,
            'rootPath' => PUBLIC_PATH,
            'baseFile' => $request->baseFile(),
            'urlType' => config('url_common_param') ? 2 : 1,
            'urlParam' => http_build_query($request->param()),
            'pcVersionUrl' => $pcVersionUrl,
        ];
    }

    /**
     * 获取通用页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function response($extraData = [])
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
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        return array_merge($commonData);
    }

    /**
     * 处理文档解析错误
     * @param \Exception $ex 错误类
     * @throws \Exception
     */
    protected function handleError($ex)
    {
        if (!config('app_debug')) return error('文档解析错误');
        throw $ex;
    }
}
