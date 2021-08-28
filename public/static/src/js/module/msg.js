/* 消息模块 */
'use strict';

/**
 * 显示消息
 * @param {string|Object} options 消息或设置对象
 * @param {string} [options.msg] 消息
 * @param {number} [options.duration={@link Config.defShowMsgDuration}] 消息显示时间（秒），-1为永久显示
 * @param {boolean} [options.clickable=true] 消息框可否手动点击消除
 * @param {boolean} [options.preventable=false] 是否阻止点击网页上的其它元素
 * @param {number} [duration] 消息显示时间（秒），-1为永久显示
 * @example
 * show('<span class="mr-3">使用道具</span><span class="text-item">神秘系数<em class="text-warning">+1</em></span>', -1);
 * show({
 *   msg: '<span class="mr-3">抽取神秘盒子</span><span class="text-item">KFB<em class="text-warning">+8</em></span>',
 *   duration: 20,
 *   clickable: false,
 * });
 * @returns {jQuery} 消息框对象
 */
export const show = function (options, duration) {
    let settings = {
        msg: '',
        duration: Config.defShowMsgDuration,
        clickable: true,
        preventable: false,
    };
    if ($.type(options) === 'object') {
        $.extend(settings, options);
    }
    else {
        settings.msg = options;
        settings.duration = typeof duration === 'undefined' ? Config.defShowMsgDuration : duration;
    }

    let $container = $('.msg-container');
    let isFirst = $container.length === 0;
    if (!isFirst && !$('.mask').length) {
        if ($container.height() >= $(window).height() * 0.8) {
            destroy();
            isFirst = true;
        }
    }
    if (settings.preventable && !$('.mask').length) {
        $('<div class="mask"></div>').appendTo('body');
    }
    if (isFirst) {
        $container = $('<div class="container msg-container"></div>').appendTo('body');
    }

    let $msg = $(`<div class="msg">${settings.msg}</div>`).appendTo($container);
    $msg.on('click', '.stop-action', function (e) {
        e.preventDefault();
        $(this).text('正在停止&hellip;').closest('.msg').data('stop', true);
    });
    if (settings.clickable) {
        $msg.css('cursor', 'pointer').click(function () {
            hide($(this));
        }).find('a').click(function (e) {
            e.stopPropagation();
        });
    }
    if (settings.preventable) $msg.attr('preventable', true);
    $msg.slideDown('normal');
    if (settings.duration > -1) {
        setTimeout(() => {
            hide($msg);
        }, settings.duration * 1000);
    }
    return $msg;
};

/**
 * 显示等待消息
 * @param {string} msg 消息
 * @param {boolean} preventable 是否阻止点击网页上的其它元素
 * @returns {jQuery} 消息框对象
 */
export const wait = function (msg, preventable = true) {
    msg += '<i class="fa fa-spinner fa-spin fa-lg fa-fw ml-3" aria-label="等待中" aria-hidden="true"></i>';
    return show({msg, duration: -1, clickable: false, preventable});
};

/**
 * 隐藏指定消息框
 * @param {jQuery} $msg 消息框对象
 */
export const hide = function ($msg) {
    $msg.slideUp('normal', function () {
        remove($(this));
    });
};

/**
 * 移除指定消息框
 * @param {jQuery} $msg 消息框对象
 */
export const remove = function ($msg) {
    let $container = $msg.parent();
    $msg.remove();
    if (!$('.msg').length) {
        $container.remove();
        $('.mask').remove();
    }
    else if (!$('.msg[preventable]').length) {
        $('.mask').remove();
    }
};

/**
 * 销毁所有消息框
 */
export const destroy = function () {
    $('.msg-container').remove();
    $('.mask').remove();
};
