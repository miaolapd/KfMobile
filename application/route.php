<?php
// 路由配置
return [
    // 首页
    '/' => 'Index/index',
    // 登录页面
    'login$' => 'Login/index',
    // 版块页面
    'thread/:fid' => ['Thread/index', [], ['fid' => '\d+']],
    // 主题页面
    'read/:tid' => ['Read/index', [], ['tid' => '\d+']],
    // 关键词页面
    'gjc/:gjc' => 'GuanJianCi/index',
    // 个人详细信息页面
    'user/uid/:uid' => ['Profile/show', [], ['uid' => '\d+']],
    'user/username/:username' => 'Profile/show',
    // 论坛排行页面
    'rank' => 'Rank/index',
    // 最新共享页面
    'share' => 'Share/index',
    // 游戏介绍页面
    'game/:id' => ['GameIntro/game', [], ['id' => '\d+']],
    // 帮助页面
    'faq/:id' => ['Faq/index', [], ['id' => '\d+']],
];
