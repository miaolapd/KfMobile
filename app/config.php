<?php
// 自定义应用配置（扁平键，供 config('xxx') 与模板 {$Think.config.xxx} 使用）
return [
    // 应用版本号
    'app_version' => '5.3',
    // 反向代理的KF目标域名
    'proxy_domain' => 'https://kf.miaola.work/',
    // 注册页面反向代理的KF目标域名
    'register_page_proxy_domain' => 'https://kf.miaola.work/',
    // 电脑版的域名
    'pc_version_domain' => 'https://kf.miaola.work/',
    // 反向代理的User Agent
    'proxy_user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:52.0) Gecko/20100101 Firefox/52.0',
    // 网站名称
    'site_name' => '绯月ScarletMoon',
    // 静态资源目录的路径
    'static_path' => 'static/dist/',
    // 是否使用CDN传输部分静态资源文件（如jQuery、Bootstrap脚本及Font Awesome字体文件等）
    'static_file_cdn' => false,
    // 静态资源文件时间戳
    'static_file_timestamp' => '',
    // 本站编码
    'site_encoding' => 'utf-8',
    // 远端网站编码
    'remote_site_encoding' => 'gbk',
    // 反向代理在尝试连接时的超时时间（秒)
    'proxy_connection_timeout' => 15,
    // 反向代理执行的超时时间（秒)
    'proxy_timeout' => 25,
    // 成功提示信息的等待时间
    'success_msg_wait' => 3,
    // 是否关闭网站
    'site_close' => false,
    // 关闭网站的提示消息
    'site_close_msg' => '网站维护中……',
    // 登录页面提示信息
    'login_page_msg' => '',
    // 顶部公告
    'top_announcement' => '',
    // 网站统计脚本
    'stat_script' => '',
    // 页面背景样式
    'bg_style' => '',
    // 获取远程内容时是否检测SSL证书（在windows下调试时可能需要关闭此选项）
    'verify_ssl_cert' => true,

    // 应用调试模式（供业务代码与模板使用，同时会同步到 TP8 的 App::debug()）
    'app_debug' => false,
    // 默认输出类型
    'default_return_type' => 'html',
    // 默认AJAX数据返回格式
    'default_ajax_return' => 'json',
    // URL普通方式参数（Responser 据此生成 window.Info.urlType）
    'url_common_param' => false,
    // 错误显示信息,非调试模式有效
    'error_message' => '页面错误！请稍后再试~~',
    // 显示错误信息
    'show_error_msg' => true,

    // 常量设置
    'const' => [
        // 页面背景图片列表
        'bgImageList' => [
            '1.jpg', '2.jpg', '3.png', '4.png', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
            '11.jpg', '12.jpg', '13.png', '14.png', '15.jpg'
        ],
        // KF Cookie前缀
        'kfCookiePrefix' => '2ed4e_',
        // 用户账户信息的Cookie名称
        'userAccountCookieName' => 'winduser',
        // 页面背景样式的Cookie名称
        'bgStyleCookieName' => 'bgStyle',
    ],
];
