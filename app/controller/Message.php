<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 短消息页面控制器
 * @package app\controller
 */
class Message extends Base
{
    /**
     * 展示短消息页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $action = input('action', 'receivebox');
        if (!in_array($action, ['receivebox', 'sendbox', 'scout'])) $action = 'receivebox';
        $param = $request->param();
        $param['action'] = $action;
        $response = Proxy::get('message.php', $param);
        $message = new responser\Message($response);
        $data = $message->index(['action' => $action]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('Message/index', $data);
    }

    /**
     * 任务
     * @param Request $request
     * @return mixed
     */
    public function job(Request $request)
    {
        $func = 'get';
        if ($request->isPost()) $func = 'post';
        $response = Proxy::$func('message.php', $request->param());
        new responser\Responser($response);
        return error('操作失败');
    }

    /**
     * 展示屏蔽列表页面
     * @param Request $request
     * @return mixed
     */
    public function banned(Request $request)
    {
        $response = Proxy::get('message.php?action=banned', $request->param());
        $message = new responser\Message($response);
        $data = $message->banned(['action' => 'banned']);
        if ($request->isAjax()) return $data;
        else return $this->fetch('Message/banned', $data);
    }

    /**
     * 展示查看消息页面
     * @param Request $request
     * @return mixed
     */
    public function read(Request $request)
    {
        $action = input('action', 'read');
        if (!in_array($action, ['read', 'readsnd', 'readscout'])) $action = 'read';
        $param = $request->param();
        $param['action'] = $action;
        $response = Proxy::get('message.php', $param);
        $message = new responser\Message($response);
        $data = $message->read(['action' => $action]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('Message/read', $data);
    }

    /**
     * 展示发送消息页面
     * @param Request $request
     * @return mixed
     */
    public function write(Request $request)
    {
        $response = Proxy::get('message.php?action=write', $request->param());
        $message = new responser\Message($response);
        $data = $message->write(['action' => 'write']);
        if ($request->isAjax()) return $data;
        else return $this->fetch('Message/write', $data);
    }
}
