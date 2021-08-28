/* 首页模块 */
'use strict';
import * as Util from './util';
import Const from './const';
import {read as readConfig, write as writeConfig} from './config';

/**
 * 处理首页的@提醒按钮
 */
export const handleAtTipsBtn = function () {
    $('#atTips').click(function () {
        let $this = $(this);
        let time = $this.data('time');
        let cookieValue = Util.getCookie(Const.atTipsTimeCookieName);
        if (!time || time === cookieValue) return;
        if (!cookieValue) {
            let curDate = new Date().getDate().toString();
            Util.setCookie(Const.prevAtTipsTimeCookieName, curDate.padStart(2, '0') + '日00时00分');
        }
        else if (cookieValue !== time) {
            Util.setCookie(Const.prevAtTipsTimeCookieName, cookieValue);
        }
        Util.setCookie(Const.atTipsTimeCookieName, time, Util.getDate(`+${Const.atTipsTimeExpires}d`));
        $this.removeClass('btn-outline-danger').addClass('btn-outline-primary');
    });
};

/**
 * 处理首页主题链接面板
 */
export const handleIndexThreadPanel = function () {
    if (Config.activeNewReplyPanel) {
        $(`a[data-toggle="tab"][href="${Config.activeNewReplyPanel}"]:not(:contains("综合"))`).tab('show');
    }
    if (Config.activeNewPublishPanel) {
        $(`a[data-toggle="tab"][href="${Config.activeNewPublishPanel}"]:not(:contains("综合"))`).tab('show');
    }
    if (Config.activeNewExtraPanel) {
        $(`a[data-toggle="tab"][href="${Config.activeNewExtraPanel}"]`).tab('show');
    }

    $(document).on('shown.bs.tab', '[data-toggle="tab"]', function (e) {
        let $target = $(e.target);
        let targetPanel = $target.attr('href');
        let typeName = '';
        if (targetPanel.includes('newReplyPanel')) typeName = 'activeNewReplyPanel';
        else if (targetPanel.includes('newPublishPanel')) typeName = 'activeNewPublishPanel';
        else if (targetPanel.includes('newExtraPanel')) typeName = 'activeNewExtraPanel';
        if (typeName && Config[typeName] !== targetPanel) {
            readConfig();
            Config[typeName] = targetPanel;
            writeConfig();
        }
    });
};

/**
 * 处理选择页面背景
 */
export const handleSelectBg = function () {
    $('#selectBgImage').on('click', '[data-id]', function () {
        let $this = $(this);
        let id = $this.data('id');
        let fileName = $this.data('filename');
        let path = $this.parent().data('path');
        if (!id || !fileName || !path) return;
        if (confirm('是否选择此背景图片？')) {
            Util.setCookie(Const.bgStyleCookieName, id, Util.getDate(`+${Const.bgStyleExpires}d`), Const.storagePrefix);
            $('body, .modal-content').css('background-image', 'url("' + path + fileName + '")');
            alert('背景已更换（图片可能需要一定时间加载）');
        }
    }).on('click', '[data-color]', function () {
        let $this = $(this);
        let color = $this.data('color');
        if (!color) return;
        if (confirm('是否选择此背景颜色？')) {
            Util.setCookie(Const.bgStyleCookieName, color, Util.getDate(`+${Const.bgStyleExpires}d`), Const.storagePrefix);
            $('body, .modal-content').css('background', color);
            alert('背景已更换');
        }
    });

    $('#customBgStyle').click(function () {
        let value = Util.getCookie(Const.bgStyleCookieName, Const.storagePrefix);
        if (!value || parseInt(value)) value = '';
        value = prompt(
            '请输入背景图片URL、颜色代码或CSS样式：\n（例：http://xxx.com/abc.jpg 或 #fcfcfc，留空表示恢复默认背景）\n' +
            '（注：建议选择简洁、不花哨、偏浅色系的背景图片或颜色）',
            value
        );
        if (value === null) return;
        let $bg = $('body, .modal-content, .dialog-content');
        if ($.trim(value) === '') {
            Util.deleteCookie(Const.bgStyleCookieName, Const.storagePrefix);
            alert('背景已恢复默认');
            location.reload();
        }
        else if (/^https?:\/\/[^"']+/.test(value)) {
            Util.setCookie(Const.bgStyleCookieName, value, Util.getDate(`+${Const.bgStyleExpires}d`), Const.storagePrefix);
            $bg.css('background-image', 'url("' + value + '")');
            alert('背景已更换（图片可能需要一定时间加载）');
        }
        else if (/^#[0-9a-f]{6}$/i.test(value)) {
            Util.setCookie(Const.bgStyleCookieName, value, Util.getDate(`+${Const.bgStyleExpires}d`), Const.storagePrefix);
            $bg.css('background', value.toLowerCase());
            alert('背景已更换');
        }
        else if (!/[<>{}]/.test(value)) {
            value = value.replace(';', '');
            Util.setCookie(Const.bgStyleCookieName, value, Util.getDate(`+${Const.bgStyleExpires}d`), Const.storagePrefix);
            $bg.css('background', value);
            alert('背景已更换（图片可能需要一定时间加载）');
        }
        else {
            alert('格式不正确');
        }
    });
};
