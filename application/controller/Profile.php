<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 身份页面控制器
 * @package app\controller
 */
class Profile extends Base
{
    /**
     * 展示个人详细信息页面
     * @param Request $request
     * @return mixed
     */
    public function show(Request $request)
    {
        $response = Proxy::get('profile.php?action=show', $request->param());
        $profile = new responser\Profile($response);
        $data = $profile->show();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Profile/show', $data);
    }

    /**
     * 展示收藏夹页面
     * @param Request $request
     * @return mixed
     */
    public function favor(Request $request)
    {
        $type = input('type/d', -1);
        $func = 'get';
        if ($request->isPost()) $func = 'post';
        $response = Proxy::$func('profile.php?action=favor', $request->param());
        $profile = new responser\Profile($response);
        $data = $profile->favor(['type' => $type]);
        if ($request->isAjax()) return $data;
        else return $this->fetch('Profile/favor', $data);
    }

    /**
     * 展示好友列表页面
     * @param Request $request
     * @return mixed
     */
    public function friend(Request $request)
    {
        $func = 'get';
        if ($request->isPost()) $func = 'post';
        $response = Proxy::$func('profile.php?action=friend', $request->param());
        $profile = new responser\Profile($response);
        $data = $profile->friend();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Profile/friend', $data);
    }

    /**
     * 展示账号设置页面
     * @param Request $request
     * @return mixed
     */
    public function modify(Request $request)
    {
        $response = null;
        if ($request->isPost()) {
            $uploads = [];
            $file = $request->file('upload');
            if (!empty($file)) {
                if (!$file->checkExt(['jpg', 'gif', 'png'])) {
                    error('头像图片类型不匹配');
                }
                $upload = [];
                $upload['name'] = 'upload';
                $infoList = $file->getInfo();
                $upload['fileName'] = $infoList['name'];
                $upload['type'] = $infoList['type'];
                $info = $file->rule('uniqid')->move(TEMP_PATH);
                if ($info) {
                    $upload['path'] = TEMP_PATH . $info->getFilename();
                    $uploads[] = $upload;
                    unset($info);
                } else {
                    error('头像上传失败');
                }
            }
            $response = Proxy::post('profile.php?action=modify', $request->param(), $uploads);
        } else {
            $response = Proxy::get('profile.php?action=modify', $request->param());
        }
        $profile = new responser\Profile($response);
        $data = $profile->modify();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Profile/modify', $data);
    }
}
