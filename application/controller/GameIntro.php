<?php
namespace app\controller;

use think\Request;
use app\lib\Proxy;
use app\responser;

/**
 * 游戏介绍页面控制器
 * @package app\controller
 */
class GameIntro extends Base
{
    /**
     * 展示游戏介绍首页
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $response = Proxy::get('g_intro_index.php', $request->param());
        $gameIntro = new responser\GameIntro($response);
        $data = $gameIntro->index();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GameIntro/index', $data);
    }

    /**
     * 展示游戏搜索页面
     * @param Request $request
     * @return mixed
     */
    public function search(Request $request)
    {
        $param = $request->except('k');
        $param['s'] = input('k', '');
        $response = Proxy::get('g_intro_s.php', $param);
        $gameIntro = new responser\GameIntro($response);
        $data = $gameIntro->search();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GameIntro/search', $data);
    }

    /**
     * 展示本月新作页面
     * @param Request $request
     * @return mixed
     */
    public function moon(Request $request)
    {
        $param = [];
        $param['g_moon_y'] = input('year/d', '');
        $param['g_moon_m'] = input('month/d', '');
        $response = Proxy::get('g_intro_moon.php', $param);
        $gameIntro = new responser\GameIntro($response);
        $data = $gameIntro->moon();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GameIntro/moon', $data);
    }

    /**
     * 展示游戏介绍页面
     * @param Request $request
     * @return mixed
     */
    public function game(Request $request)
    {
        $response = Proxy::get('g_intro.php', $request->param());
        $gameIntro = new responser\GameIntro($response);
        $data = $gameIntro->game();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GameIntro/game', $data);
    }

    /**
     * 展示游戏介绍缩略图
     * @param string $path 游戏介绍图片路径
     * @return mixed
     */
    public function thumb($path = '')
    {
        if (empty($path) || strpos($path, 'g_ys') !== 0) error('非法请求');
        $path = str_replace('-', '/', $path);
        trace('远端图片路径：' . $path);
        $thumbName = '';
        $thumbExt = '';
        $matches = [];
        if (preg_match('/g_ys\d+\/(.+)(\.\w+)$/', $path, $matches)) {
            $thumbName = md5($matches[1]);
            $thumbExt = $matches[2];
        }
        trace('缩略图名称：' . $thumbName . $thumbExt);
        if (empty($thumbExt) || !in_array($thumbExt, ['.jpg', '.jpeg', '.gif', '.png'])) error('非法请求');

        $thumbPath = CACHE_PATH . $thumbName . $thumbExt;
        if (!file_exists($thumbPath)) {
            make_thumb($path, $thumbName . $thumbExt);
        }

        $type = '';
        switch ($thumbExt) {
            case 'png':
                $type = 'image/png';
                break;
            case 'gif':
                $type = 'image/gif';
                break;
            default:
                $type = 'image/jpeg';
        }
        header('Content-Type: ' . $type);
        header('Expires: ' . gmdate("D, d M Y H:i:s", time() + 60 * 60 * 24 * 7) . ' GMT');
        echo file_get_contents($thumbPath);
        exit(0);
    }

    /**
     * 展示游戏公司介绍页面
     * @param Request $request
     * @return mixed
     */
    public function company(Request $request)
    {
        $response = Proxy::get('g_intro_inc.php', $request->param());
        $gameIntro = new responser\GameIntro($response);
        $data = $gameIntro->company();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GameIntro/company', $data);
    }

    /**
     * 展示游戏类型介绍页面
     * @param Request $request
     * @return mixed
     */
    public function type(Request $request)
    {
        $response = Proxy::get('g_intro_adv.php', $request->param());
        $gameIntro = new responser\GameIntro($response);
        $data = $gameIntro->type();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GameIntro/type', $data);
    }

    /**
     * 展示游戏属性介绍页面
     * @param Request $request
     * @return mixed
     */
    public function property(Request $request)
    {
        $response = Proxy::get('g_intro_moe.php', $request->param());
        $gameIntro = new responser\GameIntro($response);
        $data = $gameIntro->property();
        if ($request->isAjax()) return $data;
        else return $this->fetch('GameIntro/property', $data);
    }
}
