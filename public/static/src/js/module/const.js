/* 常量模块 */
'use strict';

// 通用存储数据名称前缀
const storagePrefix = 'kf_';

/**
 * 常量类
 */
const Const = {
    // at提醒时间的Cookie有效期（天）
    atTipsTimeExpires: 3,
    // 页面背景样式的Cookie有效期（天）
    bgStyleExpires: 365,

    // 通用存储数据名称前缀
    storagePrefix: storagePrefix,
    // 存储多重引用数据的LocalStorage名称
    multiQuoteStorageName: storagePrefix + 'multiQuote',
    // at提醒时间的Cookie名称
    atTipsTimeCookieName: 'atTipsTime',
    // 上一次at提醒时间的Cookie名称
    prevAtTipsTimeCookieName: 'prevAtTipsTime',
    // 页面背景样式的Cookie名称
    bgStyleCookieName: 'bgStyle',

    // 常用版块列表
    commonForumList: [
        {fid: 106, name: '新作动态'},
        {fid: 41, name: '网盘下载'},
        {fid: 16, name: 'BT下载'},
        {fid: 52, name: '游戏讨论'},
        {fid: 84, name: '动漫讨论'},
        {fid: 67, name: 'CG下载'},
        {fid: 5, name: '自由讨论'},
        {fid: 56, name: '个人日记'},
        {fid: 57, name: '同人漫本'},
    ],
    // 可用版块列表
    availableForumList: [
        {fid: 106, name: '新作动态'},
        {fid: 52, name: '游戏讨论'},
        {fid: 41, name: '网盘下载'},
        {fid: 67, name: 'CG下载'},
        {fid: 16, name: 'BT下载'},
        {fid: 9, name: '无限资源'},
        {fid: 102, name: '游戏推荐'},
        {fid: 24, name: '疑难互助'},
        {fid: 57, name: '同人漫本'},
        {fid: 84, name: '动漫讨论'},
        {fid: 92, name: '动画下载'},
        {fid: 127, name: '漫画小说'},
        {fid: 68, name: 'ACG音乐'},
        {fid: 163, name: 'LIVE资源'},
        {fid: 94, name: '原创绘画'},
        {fid: 87, name: '实物交流'},
        {fid: 86, name: '电子产品'},
        {fid: 115, name: '文字作品'},
        {fid: 96, name: '图片来源'},
        {fid: 36, name: '寻求资源'},
        {fid: 5, name: '自由讨论'},
        {fid: 56, name: '个人日记'},
        {fid: 4, name: '意见投诉'},
        {fid: 93, name: '内部管理'},
        {fid: 125, name: '水楼林立'},
        {fid: 181, name: '私人日记'},
        {fid: 98, name: '日本语版'},
        {fid: 99, name: '意見箱'},
        {fid: 112, name: '掲示板'},
        {fid: 100, name: '創作感想'},
    ],
};

export default Const;
