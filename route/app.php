<?php
// 路由配置

use think\facade\Route;

// 首页
Route::rule('/', 'Index/index');
// 登录页面
Route::rule('login', 'Login/index')->completeMatch();
// 版块页面
Route::rule('thread/:fid', 'Thread/index')->pattern(['fid' => '\d+']);
// 主题页面
Route::rule('read/:tid', 'Read/index')->pattern(['tid' => '\d+']);
// 关键词页面
Route::rule('gjc/:gjc', 'GuanJianCi/index');
// 个人详细信息页面
Route::rule('user/uid/:uid', 'Profile/show')->pattern(['uid' => '\d+']);
Route::rule('user/username/:username', 'Profile/show');
// 论坛排行页面
Route::rule('rank', 'Rank/index');
// 最新共享页面
Route::rule('share', 'Share/index');
// 帮助页面
Route::rule('faq/:id', 'Faq/index')->pattern(['id' => '\d+']);
