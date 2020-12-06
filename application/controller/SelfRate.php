<?php

namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 自助评分页面控制器
 * @package app\controller
 */
class SelfRate extends Base
{
    /**
     * 展示最近发布的分享帖页面
     * @param Request $request
     * @return mixed
     */
    public function latest(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=1', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->latest(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/latest', $data);
    }

    /**
     * 展示待检查的评分记录页面
     * @param Request $request
     * @return mixed
     */
    public function waitCheck(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=2', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->waitCheck(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/waitCheck', $data);
    }

    /**
     * 展示关于我的评分记录页面
     * @param Request $request
     * @return mixed
     */
    public function my(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=3', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->my(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/my', $data);
    }

    /**
     * 展示已完成的评分记录页面
     * @param Request $request
     * @return mixed
     */
    public function complete(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=4', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->complete(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/complete', $data);
    }

    /**
     * 展示自助评分奖励页面
     * @param Request $request
     * @return mixed
     */
    public function rating(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?do=1', $request->except('do'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->rating(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/rating', $data);
    }

    /**
     * 展示自助评分检查页面
     * @param Request $request
     * @return mixed
     */
    public function check(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?do=2', $request->except('do'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->check(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/check', $data);
    }

    /**
     * 提交
     * @param Request $request
     * @return mixed
     */
    public function submit(Request $request)
    {
        $do = intval(input('do/d', 0));
        if ($do < 3) return error('参数错误');
        $response = Proxy::get('kf_fw_1wkfb.php?do=' . $do, $request->except('do'));
        new responser\SelfRate($response);
        return error('提交失败');
    }

    /**
     * 展示待检查的优秀帖页面
     * @param Request $request
     * @return mixed
     */
    public function goodPostWaitCheck(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=5', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->goodPostWaitCheck(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/goodPostWaitCheck', $data);
    }

    /**
     * 展示已完成的优秀帖页面
     * @param Request $request
     * @return mixed
     */
    public function goodPostComplete(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=6', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->goodPostComplete(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/goodPostComplete', $data);
    }

    /**
     * 展示被异议的评分记录页面
     * @param Request $request
     * @return mixed
     */
    public function disagree(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=7', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->disagree(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/disagree', $data);
    }

    /**
     * 展示异议评分处理记录页面
     * @param Request $request
     * @return mixed
     */
    public function disagreeComplete(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=8', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->disagreeComplete(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/disagreeComplete', $data);
    }

    /**
     * 展示指定会员评分限制页面
     * @param Request $request
     * @return mixed
     */
    public function banUser(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=9', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->banUser(['action' => $request->action()]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/banUser', $data);
    }

    /**
     * 展示评分表内帖子搜索页面
     * @param Request $request
     * @return mixed
     */
    public function search(Request $request)
    {
        $response = Proxy::get('kf_fw_1wkfb.php?ping=10', $request->except('ping'));
        $selfRate = new responser\SelfRate($response);
        $data = $selfRate->search(['action' => $request->action(), 'keyword' => $request->param('ss')]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('SelfRate/search', $data);
    }
}
