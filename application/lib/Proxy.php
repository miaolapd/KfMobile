<?php

namespace app\lib;

use think\App;
use think\Cookie;

/**
 * 反向代理类
 * @package app\lib
 */
class Proxy
{
    /**
     * 获取服务器返回的cookies
     * @param string $header http头部信息
     * @return array cookies数组
     */
    public static function getResponseCookies($header)
    {
        $matches = [];
        if (preg_match_all('/Set-Cookie:\s*([^;]+)/i', $header, $matches)) {
            $cookies = [];
            foreach ($matches[1] as $str) {
                list($key, $value) = explode('=', $str, 2);
                $cookies[$key] = $value;
            }
            return $cookies;
        }
        return [];
    }

    /**
     * 发出请求
     * @param string $url 请求的URL
     * @param string|array|null $postData post数据
     * @param array|null $uploads 上传文件数据
     * @param array $extraData 额外数据
     * @return array 响应信息
     */
    protected static function request($url, $postData = null, $uploads = null, $extraData = [])
    {
        $remoteEncoding = config('remote_site_encoding');
        $siteEncoding = config('site_encoding');
        $url = (!empty($extraData['proxyDomain']) ? $extraData['proxyDomain'] : config('proxy_domain')) .
            mb_convert_encoding($url, $remoteEncoding, $siteEncoding);

        $cookies = Cookie::get('', '');
        unset($cookies[config('const.kfCookiePrefix') . 'ipfrom']);
        $clientIp = input('server.REMOTE_ADDR');
        $headers = [
            'Cookie: ' . serialize_cookies($cookies, config('cookie.prefix')),
            'X-Forwarded-For: ' . $clientIp,
            'Expect:',
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_USERAGENT, config('proxy_user_agent'));
        curl_setopt($ch, CURLOPT_REFERER, !empty($extraData['referer']) ? $extraData['referer'] : config('proxy_domain'));
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, config('proxy_connection_timeout'));
        curl_setopt($ch, CURLOPT_TIMEOUT, config('proxy_timeout'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
        curl_setopt($ch, CURLOPT_SAFE_UPLOAD, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        if (!config('verify_ssl_cert')) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        }

        if (!is_null($postData)) {
            curl_setopt($ch, CURLOPT_POST, true);
            if (is_array($postData)) {
                convert_array_encoding($postData, $remoteEncoding, $siteEncoding);
                foreach ($postData as $key => $data) {
                    if (is_array($data)) {
                        foreach ($data as $subKey => $subData) {
                            $postData[$key . '[' . $subKey . ']'] = $subData;
                        }
                        unset($postData[$key]);
                    }
                }
                if (!empty($uploads)) {
                    foreach ($uploads as $upload) {
                        $curlFile = new \CURLFile(
                            $upload['path'],
                            $upload['type'],
                            mb_convert_encoding($upload['fileName'], $remoteEncoding, $siteEncoding)
                        );
                        $postData[$upload['name']] = $curlFile;
                    }
                }
            } else {
                $postData = mb_convert_encoding($postData, $remoteEncoding, $siteEncoding);
            }
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        }

        debug('begin');
        $result = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $errorMsg = curl_error($ch);
        curl_close($ch);
        debug('end');
        trace('客户端IP：' . $clientIp);
        trace('客户端UA：' . input('server.HTTP_USER_AGENT', '无'));
        trace('获取远端页面用时：' . debug('begin', 'end') . 's');

        if (!empty($uploads)) {
            foreach ($uploads as $upload) {
                unlink($upload['path']);
            }
        }

        if (empty($result)) return ['code' => $code === 200 ? 502 : $code, 'errorMsg' => $errorMsg];
        list($header, $document) = explode("\r\n\r\n", $result, 2);
        if ($code === 200) {
            $document = mb_convert_encoding($document, $siteEncoding, $remoteEncoding);
            $document = str_ireplace(
                '<meta http-equiv="Content-Type" content="text/html; charset=gbk"',
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"',
                $document
            );
            $document = str_replace(rtrim(config('proxy_domain'), '/'), request()->domain(), $document);
            return [
                'code' => $code,
                'header' => $header,
                'cookies' => self::getResponseCookies($header),
                'document' => $document,
                'remoteUrl' => $url
            ];
        } elseif ($code === 301 || $code === 302) {
            $matches = [];
            $location = '';
            if (preg_match('/Location:\s*(\S+)/i', $header, $matches)) {
                $location = $matches[1];
            }
            return ['code' => $code, 'header' => $header, 'location' => $location];
        } else {
            return ['code' => $code, 'header' => $header, 'errorMsg' => $errorMsg];
        }
    }

    /**
     * 发出GET请求
     * @param string $url 请求的URL
     * @param string|array $data GET请求数据
     * @param array $extraData 额外数据
     * @return array 响应信息
     */
    public static function get($url, $data = null, $extraData = [])
    {
        if (!is_null($data)) {
            if (is_array($data)) {
                foreach ($data as &$value) {
                    $value = mb_convert_encoding($value, config('remote_site_encoding'), config('site_encoding'));
                }
                $data = http_build_query($data);
            }
            if ($data) $url .= (strpos($url, '?') === false ? '?' : '&') . $data;
        }
        trace('GET请求：' . $url);
        return self::request($url, null, null, $extraData);
    }

    /**
     * 发出POST请求
     * @param string $url 请求的URL
     * @param string|array $data POST请求数据
     * @param array|null $uploads 上传文件数据
     * @param array $extraData 额外数据
     * @return array 响应信息
     */
    public static function post($url, $data, $uploads = null, $extraData = [])
    {
        if (App::$debug && !preg_match('/login\.php|profile\.php\?action=modify/', $url))
            trace('POST请求：' . $url . '，请求数据：' . (is_string($data) ? $data : http_build_query($data)));
        else trace('POST请求：' . $url);
        return self::request($url, $data, $uploads, $extraData);
    }
}
