<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 发表帖子页面控制器
 * @package app\controller
 */
class Post extends Base
{
    /**
     * 展示发表帖子页面
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::get('post.php', $request->param());
        $post = new responser\Post($response);
        $data = $post->index();
        if ($request->isAjax()) return $data;
        else return $this->fetch('Post/index', array_merge($data, ['multiQuote' => input('multiquote', 0)]));
    }

    /**
     * 发表帖子
     * @param Request $request
     */
    public function post(Request $request)
    {
        if (!$request->isPost()) error('非法请求');

        $uploads = [];
        $files = $request->file();
        if (!empty($files)) {
            foreach ($files as $key => $file) {
                if (!$file->checkExt(['jpg', 'gif', 'png', 'torrent'])) {
                    error('附件类型不匹配');
                }
            }
            foreach ($files as $key => $file) {
                $upload = [];
                $upload['name'] = $key;
                $infoList = $file->getInfo();
                $upload['fileName'] = $infoList['name'];
                $upload['type'] = $infoList['type'];
                $info = $file->rule('uniqid')->move(TEMP_PATH);
                if ($info) {
                    $upload['path'] = TEMP_PATH . $info->getFilename();
                    $uploads[] = $upload;
                    unset($info);
                } else {
                    error('文件上传失败');
                }
            }
        }

        $response = Proxy::post('post.php', $request->param(), $uploads);
        new responser\Responser($response);
        return error('发帖失败');
    }
}
