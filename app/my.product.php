<?php
// 我的自定义配置
return [
    // 异常页面的模板文件（正式部署时建议使用此设置）
    'exception_tmpl' => APP_PATH . 'view' . DS . 'Msg' . DS . 'exception.html',
    // 是否使用CDN传输部分静态资源文件（如jQuery、Bootstrap脚本及Font Awesome字体文件等），默认值：false
    'static_file_cdn' => true,
    // 静态资源文件时间戳（正式部署时，在更新版本之后，可修改此设置以使浏览器强制更新资源文件）
    'static_file_timestamp' => '',
    // 网站统计脚本
    'stat_script' => '',
    // 电脑版的域名
    'pc_version_domain' => 'https://kf.miaola.work/',
    // 登录页面提示信息
    //'login_page_msg' => '',
    // 是否关闭网站，默认值：false
    //'site_close' => true,
    // 关闭网站的提示消息
    //'site_close_msg' => '网站维护中……',
];
