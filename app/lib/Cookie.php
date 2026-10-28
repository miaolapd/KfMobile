<?php

namespace app\lib;

/**
 * Cookie 兼容层：复现 TP5 的“按调用指定前缀”语义
 */
class Cookie
{
    /**
     * 获取 Cookie
     * @param string $name 名称，空字符串表示获取全部
     * @param string|null $prefix 前缀，null 使用配置前缀，'' 表示原始名称
     * @return mixed
     */
    public static function get($name = '', $prefix = null)
    {
        $prefix = is_null($prefix) ? config('cookie.prefix') : $prefix;

        if ($name === '') {
            $cookies = request()->cookie();
            if ($prefix === '') {
                return $cookies;
            }

            $result = [];
            foreach ($cookies as $key => $value) {
                if (str_starts_with($key, $prefix)) {
                    $result[$key] = $value;
                }
            }
            return $result;
        }

        return request()->cookie($prefix . $name);
    }

    /**
     * 设置 Cookie
     * @param string $name
     * @param mixed $value
     * @param array|int|null $option
     */
    public static function set($name, $value, $option = [])
    {
        if (is_null($option)) {
            $option = [];
        } elseif (!is_array($option)) {
            $option = ['expire' => $option];
        }

        $prefix = array_key_exists('prefix', $option) ? $option['prefix'] : config('cookie.prefix');
        unset($option['prefix']);

        if (isset($option['httponly'])) {
            $option['httponly'] = (bool) $option['httponly'];
        }
        if (isset($option['secure'])) {
            $option['secure'] = (bool) $option['secure'];
        }

        app('cookie')->set($prefix . $name, (string) $value, $option);
    }

    /**
     * 删除 Cookie
     * @param string $name
     * @param string|null $prefix
     */
    public static function delete($name, $prefix = null)
    {
        $prefix = is_null($prefix) ? config('cookie.prefix') : $prefix;
        app('cookie')->delete($prefix . $name);
    }
}
