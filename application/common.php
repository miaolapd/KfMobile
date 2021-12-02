<?php
// 应用公共文件

/**
 * 获取经过序列化后的cookies字符串
 * @param array $cookies cookies数组
 * @param string $excludePrefix 要排除的cookies前缀
 * @return string 经过序列化后的cookies字符串
 */
function serialize_cookies($cookies, $excludePrefix = '')
{
    $result = '';
    foreach ($cookies as $key => $value) {
        if ($excludePrefix && strpos($key, $excludePrefix) === 0) continue;
        $result .= $key . '=' . $value . '; ';
    }
    return $result;
}

/**
 * 操作成功跳转的快捷方法
 * @param string $msg 提示信息
 * @param string $url 跳转的URL地址
 * @param int $wait 跳转等待时间，设为-1代表使用默认等待时间
 * @throws \think\exception\HttpResponseException
 */
function success($msg, $url = null, $wait = -1)
{
    controller('Msg')->successMsg($msg, $url, $wait);
}

/**
 * 操作错误跳转的快捷方法
 * @param string $msg 提示信息
 * @throws \think\exception\HttpResponseException
 */
function error($msg)
{
    controller('Msg')->errorMsg($msg);
}

/**
 * 将远端的URL转换为本站的URL
 * @param string $url 远端的URL
 * @return string 经过转换的URL
 */
function convert_url($url)
{
    $url = str_replace('&amp;', '&', $url);
    if ($url === '/' || $url === 'index.php') return url('/');
    elseif (strpos($url, '#') === 0 || strpos($url, 'javascript:') === 0) return $url;
    $matches = [];
    if (preg_match('/^\/?(\w+\.php)(?:\?(.+))?/i', $url, $matches)) {
        $path = strtolower($matches[1]);
        $params = isset($matches[2]) ? $matches[2] : '';
        $anchor = '';
        if (preg_match('/(.+)(#.+)/', $params, $matches)) {
            $params = $matches[1];
            $anchor = $matches[2];
        }

        if ($path === 'login.php') return url('Login/index');
        elseif ($path === 'thread.php') return url('Thread/index', $params);
        elseif ($path === 'read.php') return url('Read/index', $params) . $anchor;
        elseif ($path === 'search.php') return url('Search/index', $params);
        elseif ($path === 'guanjianci.php') return url('GuanJianCi/index', $params);
        elseif ($path === 'kf_growup.php') return url('GrowUp/index');
        elseif ($path === 'g_intro_index.php') return url('GameIntro/index');
        elseif ($path === 'g_intro.php') return url('GameIntro/game', $params);
        elseif ($path === 'g_intro_inc.php') return url('GameIntro/company', $params);
        elseif ($path === 'g_intro_adv.php') return url('GameIntro/type', $params);
        elseif ($path === 'g_intro_moe.php') return url('GameIntro/property', $params);
        elseif ($path === 'faq.php') return url('Faq/index', $params);
        elseif ($path === 'kf_smbox.php') return url('SmBox/index', $params);
        elseif ($path === 'kf_share.php') return url('Share/index', $params);
        elseif ($path === 'kf_no1.php') return url('Rank/index', $params);
        elseif ($path === 'kf_fw_ig_halo.php') return url('Fight/halo', $params);
        elseif ($path === 'kf_fw_ig_pklist.php') return url('Fight/rank', $params);
        elseif ($path === 'kf_fw_ig_shop.php') return url('Item/shop', $params);
        elseif ($path === 'kf_fw_ig_readme.php') return url('Fight/readme', $params);
        elseif ($path === 'profile.php') {
            if (strpos($params, 'action=favor') !== false)
                return url('Profile/favor', str_replace('action=favor', '', $params));
            elseif (strpos($params, 'action=friend') !== false)
                return url('Profile/friend', str_replace('action=friend', '', $params));
            elseif (strpos($params, 'action=modify') !== false)
                return url('Profile/modify', str_replace('action=modify', '', $params));
            elseif (strpos($params, 'action=show') !== false)
                return url('Profile/show', str_replace('action=show', '', $params));
        } elseif ($path === 'Personal.php') {
            if (strpos($params, 'action=post') !== false)
                return url('Personal/reply', str_replace('action=post', '', $params));
            else if (strpos($params, 'action') === false) return url('Personal/topic', $params);
        } elseif ($path === 'hack.php') {
            if (strpos($params, 'H_name=bank') !== false) {
                $params = str_replace('H_name=bank', '', $params);
                if (strpos($params, 'action=log') !== false) return url('Bank/log', str_replace('action=log', '', $params));
                else return url('Bank/index', $params);
            }
        } elseif ($path === 'message.php') {
            if (preg_match('/action=(\w+)/i', $params, $matches)) {
                if (in_array($matches[1], ['receivebox', 'sendbox', 'scout']))
                    return url('Message/index', $params);
                elseif (in_array($matches[1], ['read', 'readsnd', 'readscout']))
                    return url('Message/read', $params);
                elseif ($matches[1] === 'write')
                    return url('Message/write', str_replace('action=' . $matches[1], '', $params));
                elseif ($matches[1] === 'banned')
                    return url('Message/banned', str_replace('action=' . $matches[1], '', $params));
                else return url('Message/job', $params);
            } else {
                return url('Message/index', $params);
            }
        } elseif ($path === 'kf_fw_1wkfb.php') {
            if (preg_match('/ping=(\d+)/i', $params, $matches)) {
                $params = str_replace('ping=' . $matches[1], '', $params);
                switch (intval($matches[1])) {
                    case 2:
                        return url('SelfRate/waitCheck', $params);
                    case 3:
                        return url('SelfRate/my', $params);
                    case 4:
                        return url('SelfRate/complete', $params);
                    case 5:
                        return url('SelfRate/goodPostWaitCheck', $params);
                    case 6:
                        return url('SelfRate/goodPostComplete', $params);
                    case 7:
                        return url('SelfRate/disagree', $params);
                    case 8:
                        return url('SelfRate/disagreeComplete', $params);
                    case 9:
                        return url('SelfRate/banUser', $params);
                    default:
                        return url('SelfRate/latest', $params);
                }
            } elseif (preg_match('/do=(\d+)/i', $params, $matches)) {
                $params = str_replace('do=' . $matches[1], '', $params);
                switch (intval($matches[1])) {
                    case 2:
                        return url('SelfRate/check', $params);
                    default:
                        return url('SelfRate/rating', $params);
                }
            } else {
                return url('SelfRate/latest', $params);
            }
        }

        if (strpos($url, '/') !== 0) $url = '/' . $url;
        return $url;
    } elseif (preg_match('/^(https?:|\/)/', $url)) {
        return $url;
    }
    return url($url);
}

/**
 * 将KF其它域名的URL转换为当前域名
 * @param string $url 转换前的URL
 * @return string 转换后的URL
 */
function convert_to_current_domain_url($url)
{
    $url = str_replace(request()->domain() . '/', '/', $url);
    return preg_replace('/^https?:\/\/(?:[\w\.]+?\.)?(?:2dgal|ddgal|9gal|9baka|9moe|kfgal|2dkf|kfacg|ikfol|fygal|bakabbs|365gal|365galgame|kforz|kfmax|9shenmi|miaola|koyuki)\.\w+\/(.+)/i', '/$1', $url);
}

/**
 * 将字符串两端的空白字符删除并将HTML字符转义
 * @param string $str 字符串
 * @return string 经过转换后的字符串
 */
function trim_strip($str)
{
    return htmlspecialchars(trim($str));
}

/**
 * 通过指定数字获取指定颜色名称
 * @param int $num
 * @return string 颜色名称
 */
function get_color_from_number($num)
{
    switch ($num % 5) {
        case 1:
            return 'success';
        case 2:
            return 'info';
        case 3:
            return 'warning';
        case 4:
            return 'danger';
        default:
            return 'primary';
    }
}

/**
 * 替换通用HTML内容
 * @param string $html HTML内容
 * @return string 替换后的内容
 */
function replace_common_html_content($html)
{
    $html = preg_replace('/<strike>(.+?)<\/strike>/i', '<s>$1</s>', $html);
    $html = preg_replace_callback(
        '/href="([^"]+)"/i',
        function ($matches) {
            return 'href="' . convert_url(convert_to_current_domain_url($matches[1])) . '"';
        },
        $html
    );
    return $html;
}

/**
 * 替换楼层内容
 * @param string $html 楼层内容的HTML代码
 * @return string 替换后的楼层内容
 */
function replace_floor_content($html)
{
    $html = preg_replace('/<img src="(\d+\/)/i', '<img class="smile" alt="[表情]" src="/$1', $html);
    $html = preg_replace('/border="0" onclick="[^"]+" onload="[^"]+"/i', 'class="img" alt="[图片]"', $html);
    $html = preg_replace('/\[attachment=(\d+)\]/', '<span class="attach-label" data-aid="$1">$0</span>', $html);
    $html = preg_replace(
        '/\[audio\]([^\[]+)\[\/audio\](?!<\/fieldset>)/',
        '<audio src="$1" controls="controls" preload="none">[你的浏览器不支持audio标签]</audio>',
        $html
    );
    $html = preg_replace(
        '/\[video\]([^\[]+)\[\/video\](?!<\/fieldset>)/',
        '<video src="$1" controls="controls" preload="none">[你的浏览器不支持video标签]</video>',
        $html
    );
    return $html;
}

/**
 * 生成游戏介绍图片的缩略图
 * @param string $path 图片路径
 * @param string $thumbPath 缩略图路径
 * @throws \Exception
 */
function make_thumb($path, $thumbPath)
{
    try {
        $content = file_get_contents(config('game_image_domain') . $path);
        $md5Path = md5($path);
        $fp = fopen(TEMP_PATH . $md5Path, 'w+');
        fwrite($fp, $content);
        fclose($fp);

        $image = \think\Image::open(TEMP_PATH . $md5Path);
        if (!file_exists(CACHE_PATH) && !mkdir(CACHE_PATH, 0755, true)) {
            exception('创建缩略图缓存目录失败');
        }
        $maxWidth = config('const.thumbMaxWidth');
        $maxHeight = config('const.thumbMaxHeight');
        if ($image->width() <= $maxWidth && $image->height() <= $maxHeight) {
            $image->save(CACHE_PATH . $thumbPath, null, 90);
        } else {
            $image->thumb($maxWidth, $maxHeight)->save(CACHE_PATH . $thumbPath, null, 90);
        }
        trace('保存缩略图至：' . CACHE_PATH . $thumbPath);
        unlink(TEMP_PATH . $md5Path);
    } catch (\Exception $ex) {
        if (config('app_debug')) throw $ex;
        else error('获取图片失败');
    }
}

/**
 * 将数组中的字符串转换为指定编码
 * @param array $arr 数组
 * @param string $toEncoding 目标编码
 * @param string $fromEncoding 源编码
 */
function convert_array_encoding(&$arr, $toEncoding, $fromEncoding)
{
    foreach ($arr as &$value) {
        if (is_string($value)) {
            $value = mb_convert_encoding($value, $toEncoding, $fromEncoding);
        } elseif (is_array($value)) {
            convert_array_encoding($value, $toEncoding, $fromEncoding);
        }
    }
}

/**
 * 设置页面背景样式
 * @param int|string $bgStyle 背景图片ID或样式
 */
function set_bg_style($bgStyle)
{
    if (empty($bgStyle)) return;
    $style = '';
    $bgImageList = config('const.bgImageList');
    if (preg_match('/[<>{}\r\n]/', trim($bgStyle))) return;
    if (is_numeric(intval($bgStyle)) && $bgStyle >= 1 && $bgStyle <= count($bgImageList)) {
        $style = 'background-image: url("' . PUBLIC_PATH . config('static_path') . 'img/bg/' . $bgImageList[$bgStyle - 1] . '")';
    } elseif (preg_match('/^https?:\/\/[^"\']+/', $bgStyle)) {
        $style = 'background-image: url("' . $bgStyle . '")';
    } elseif (preg_match('/^#[0-9a-f]{6}$/i', $bgStyle)) {
        $style = 'background: ' . strtolower($bgStyle);
    } else {
        $style = 'background: ' . $bgStyle;
    }
    if (!empty($style)) {
        config('bg_style', '<style>body, .modal-content, .dialog-content { ' . $style . '; }</style>');
    }
}

/**
 * 获取或设置用户Cookie
 * @param int $uid 用户ID
 * @param string $name Cookie名称
 * @param string|null $value Cookie值（设为null表示删除该Cookie）
 * @param int $expire Cookie有效期
 * @return mixed
 */
function user_cookie($uid, $name, $value = '', $expire = 0)
{
    $prefix = $uid . '_' . config('cookie.prefix');
    if ($value === '') {
        return \think\Cookie::get($name, $prefix);
    } elseif (is_null($value)) {
        \think\Cookie::delete($name, $prefix);
    } else {
        \think\Cookie::set($name, $value, ['prefix' => $prefix, 'expire' => $expire, 'httponly' => '']);
    }
}