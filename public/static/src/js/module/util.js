/* 其它模块 */
'use strict';

/**
 * 设置Cookie
 * @param {string} name Cookie名称
 * @param {*} value Cookie值
 * @param {?Date} date Cookie有效期，留空则表示有效期为浏览器进程
 * @param {string} prefix Cookie名称前缀
 */
export const setCookie = function (name, value, date = null, prefix = Info.uid + '_' + Const.storagePrefix) {
    document.cookie = `${prefix}${name}=${encodeURI(value)}${!date ? '' : ';expires=' + date.toUTCString()};path=/;`;
};

/**
 * 获取Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 * @returns {?string} Cookie值
 */
export const getCookie = function (name, prefix = Info.uid + '_' + Const.storagePrefix) {
    let regex = new RegExp(`(^| )${prefix}${name}=([^;]*)(;|$)`);
    let matches = document.cookie.match(regex);
    if (!matches) return null;
    else return decodeURI(matches[2]);
};

/**
 * 删除Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 */
export const deleteCookie = function (name, prefix = Info.uid + '_' + Const.storagePrefix) {
    document.cookie = `${prefix}${name}=;expires=${getDate('-1d').toUTCString()};path=/;`;
};

/**
 * 获取在当前时间的基础上的指定（相对）时间量的Date对象
 * @param {string} value 指定（相对）时间量，+或-：之后或之前（相对于当前时间）；无符号：绝对值；Y：完整年份；y：年；M：月；d：天；h：小时；m：分；s：秒；ms：毫秒
 * @returns {?Date} 指定（相对）时间量的Date对象
 * @example
 * Tools.getDate('+2y') 获取2年后的Date对象
 * Tools.getDate('+3M') 获取3个月后的Date对象
 * Tools.getDate('-4d') 获取4天前的Date对象
 * Tools.getDate('5h') 获取今天5点的Date对象（其它时间量与当前时间一致）
 * Tools.getDate('2015Y') 获取年份为2015年的Date对象
 */
export const getDate = function (value) {
    let date = new Date();
    let matches = /^(-|\+)?(\d+)([a-zA-Z]{1,2})$/.exec(value);
    if (!matches) return null;
    let flag = typeof matches[1] === 'undefined' ? 0 : (matches[1] === '+' ? 1 : -1);
    let increment = flag === -1 ? -parseInt(matches[2]) : parseInt(matches[2]);
    let unit = matches[3];
    switch (unit) {
        case 'Y':
            date.setFullYear(increment);
            break;
        case 'y':
            date.setFullYear(flag === 0 ? increment : date.getFullYear() + increment);
            break;
        case 'M':
            date.setMonth(flag === 0 ? increment : date.getMonth() + increment);
            break;
        case 'd':
            date.setDate(flag === 0 ? increment : date.getDate() + increment);
            break;
        case 'h':
            date.setHours(flag === 0 ? increment : date.getHours() + increment);
            break;
        case 'm':
            date.setMinutes(flag === 0 ? increment : date.getMinutes() + increment);
            break;
        case 's':
            date.setSeconds(flag === 0 ? increment : date.getSeconds() + increment);
            break;
        case 'ms':
            date.setMilliseconds(flag === 0 ? increment : date.getMilliseconds() + increment);
            break;
        default:
            return null;
    }
    return date;
};

/**
 * 获取指定字符串的字节长度（1个GBK字符按2个字节来算）
 * @param {string} str 指定字符串
 * @returns {number} 字符串的长度
 */
export const getStrByteLen = function (str) {
    let len = 0;
    let cLen = 2;
    for (let i = 0; i < str.length; i++) {
        len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? cLen : 1;
    }
    return len;
};

/**
 * 获取当前域名的URL
 * @returns {string} 当前域名的URL
 */
export const getHostNameUrl = function () {
    return location.protocol + '//' + location.host;
};

/**
 * 添加BBCode
 * @param textArea 文本框
 * @param {string} code BBCode
 * @param {string} selText 选择文本
 */
export const addCode = function (textArea, code, selText = '') {
    let startPos = selText === '' ? code.indexOf(']') + 1 : code.indexOf(selText);
    if (typeof textArea.selectionStart !== 'undefined') {
        let prePos = textArea.selectionStart;
        textArea.value = textArea.value.substring(0, prePos) + code + textArea.value.substring(textArea.selectionEnd);
        textArea.selectionStart = prePos + startPos;
        textArea.selectionEnd = prePos + startPos + selText.length;
    }
    else {
        textArea.value += code;
    }
};

/**
 * 获取选择文本
 * @param textArea 文本框
 * @returns {string} 选择文本
 */
export const getSelText = function (textArea) {
    return textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
};

/**
 * 从URL查询字符串提取参数对象
 * @param {string} str URL查询字符串
 * @returns {Map} 参数集合
 */
export const extractQueryStr = function (str) {
    let params = new Map();
    for (let param of str.split('&')) {
        if (!param) continue;
        let [key, value] = param.split('=');
        params.set(key, typeof value !== 'undefined' ? value : '');
    }
    return params;
};

/**
 * 从参数对象中创建URL查询字符串
 * @param {Map} map 参数集合
 * @returns {string} URL查询字符串
 */
export const buildQueryStr = function (map) {
    let queryStr = '';
    for (let [key, value] of map) {
        if (Info.urlType === 2) {
            queryStr += (queryStr ? '&' : '') + key + '=' + value;
        }
        else {
            queryStr += (queryStr ? '/' : '') + key + '/' + value;
        }
    }
    return queryStr;
};

/**
 * 生成指定的URL
 * @param {string} action 控制器（小写）
 * @param {string} param 查询参数
 * @param {boolean} includeOtherParam 是否包括当前页面的其它查询参数
 * @param {[]} excludeParams 要排除当前页面的查询参数列表
 * @returns {string} URL 最终的URL
 */
export const makeUrl = function (action, param = '', includeOtherParam = false, excludeParams = []) {
    let url = '';
    let paramList = extractQueryStr(param);
    if (includeOtherParam) {
        paramList = new Map([...extractQueryStr(Info.urlParam).entries(), ...paramList.entries()]);
        for (let i in excludeParams) {
            paramList.delete(excludeParams[i]);
        }
    }
    if (!action.startsWith('/')) {
        if (location.pathname.startsWith(Info.baseFile)) url = Info.baseFile + '/';
        else url = Info.rootPath;
    }
    url += action;
    if (paramList.size > 0) {
        let queryStr = buildQueryStr(paramList);
        if (queryStr) {
            url += (Info.urlType === 2 ? '?' : '/') + queryStr;
        }
    }
    return url;
};

/**
 * 获取URL查询字符串中的指定参数
 * @param {string} name 参数名称
 * @returns {?string} 参数值
 */
export const getQueryParam = function (name) {
    return extractQueryStr(Info.urlParam).get(name);
};

/**
 * 解码HTML特殊字符
 * @param {string} str 待解码的字符串
 * @returns {string} 解码后的字符串
 */
export const decodeHtmlSpecialChar = function (str) {
    if (!str.length) return '';
    return str.replace(/<br\s*\/?>/gi, '\n')
        .replace(/&quot;/gi, '\"')
        .replace(/&#39;/gi, '\'')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&gt;/gi, '>')
        .replace(/&lt;/gi, '<')
        .replace(/&amp;/gi, '&');
};

/**
 * 去除HTML标签
 * @param html HTML代码
 * @returns {string} 去除HTML标签的文本
 */
export const removeHtmlTag = html => html ? html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '') : '';

/**
 * 全选
 * @param {jQuery} $nodes 想要全选的节点的jQuery对象
 */
export const selectAll = function ($nodes) {
    $nodes.prop('checked', true);
};

/**
 * 反选
 * @param {jQuery} $nodes 想要反选的节点的jQuery对象
 */
export const selectInverse = function ($nodes) {
    $nodes.each(function () {
        let $this = $(this);
        $this.prop('checked', !$this.prop('checked'));
    });
};

/**
 * 显示字段验证消息
 * @param {jQuery} $node 验证字段的jQuery对象
 * @param {string} type 验证类型
 * @param {string} msg 验证消息
 */
export const showValidationMsg = function ($node, type, msg = '') {
    if (type === 'error') type = 'danger';
    $node.removeClass('form-control-success form-control-warning form-control-danger');
    let $parent = $node.parent();
    $parent.removeClass('has-success has-warning has-danger');
    if ($.inArray(type, ['success', 'warning', 'danger'] > -1)) {
        $node.addClass('form-control-' + type).parent().addClass('has-' + type);
    }
    let $feedback = $parent.find('.form-control-feedback');
    if (type === 'wait') {
        $feedback.html(`<span class="text-muted"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> ${msg}</span>`);
    }
    else {
        $feedback.text(msg);
    }
};

/**
 * 获取对象A在对象B中的相对补集
 * @param {Object} a 对象A
 * @param {Object} b 对象B
 * @returns {Object} 相对补集
 */
export const getDifferenceSetOfObject = function (a, b) {
    let c = {};
    if ($.type(a) !== 'object' || $.type(b) !== 'object') return c;
    $.each(b, (key, data) => {
        if (key in a) {
            if (!deepEqual(a[key], data)) c[key] = data;
        }
    });
    return c;
};

/**
 * 深度比较两个对象是否相等
 * @param {*} a
 * @param {*} b
 * @returns {boolean} 是否相等
 */
export const deepEqual = function (a, b) {
    if (a === b) return true;
    if ($.type(a) !== $.type(b)) return false;
    if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
    if ($.isArray(a) && $.isArray(b) || $.type(a) === 'object' && $.type(b) === 'object') {
        if (a.length !== b.length) return false;
        for (var i in $.extend($.isArray(a) ? [] : {}, a, b)) {
            if (typeof a[i] === 'undefined' || typeof b[i] === 'undefined') return false;
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }
    return false;
};

/**
 * 复制文本
 * @param {jQuery} $target 要复制文本的目标元素
 * @param {?jQuery} $source 触发事件的源元素
 * @returns {boolean} 是否复制成功
 */
export const copyText = function ($target, $source = null) {
    if (!('execCommand' in document) || !$target.length) return false;
    let copyText = $target.data('copy-text');
    if (copyText) {
        $target = $(`<span class="text-hide">${copyText}</span>`).insertAfter($target);
    }
    let s = window.getSelection();
    s.selectAllChildren($target.get(0));
    let result = document.execCommand('copy');
    s.removeAllRanges();
    if (copyText) $target.remove();
    if (result && $source) {
        let msg = $source.data('copy-msg');
        $source.attr('title', msg ? msg : '已复制').on('hidden.bs.tooltip', function () {
            $(this).tooltip('dispose');
        }).tooltip('show');
    }
    return result;
};

/**
 * 获取指定用户名在关注或屏蔽列表中的索引号
 * @param {string} name 指定用户名
 * @param {Array} list 指定列表
 * @returns {number} 指定用户在列表中的索引号，-1表示不在该列表中
 */
export const inFollowOrBlockUserList = (name, list) => list.findIndex(data => data.name && data.name === name);

/**
 * 检测浏览器是否为Opera
 * @returns {boolean} 是否为Opera
 */
export const isOpera = () => typeof window.opera !== 'undefined';

/**
 * 检测浏览器是否为Edge
 * @returns {boolean} 是否为Edge
 */
export const isEdge = () => navigator.appVersion && navigator.appVersion.includes('Edge');

/**
 * HTML转义编码
 * @param {string} str 待编码的字符串
 * @returns {string} 编码后的字符串
 */
export const htmlEncode = function (str) {
    if (!str.length) return '';
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /g, '&nbsp;')
        .replace(/\'/g, '&#39;')
        .replace(/\"/g, '&quot;')
        .replace(/\n/g, '<br>');
};

/**
 * HTML转义解码
 * @param {string} str 待解码的字符串
 * @returns {string} 解码后的字符串
 */
export const htmlDecode = function (str) {
    if (!str.length) return '';
    return str.replace(/<br\s*\/?>/gi, '\n')
        .replace(/&quot;/gi, '\"')
        .replace(/&#39;/gi, '\'')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&gt;/gi, '>')
        .replace(/&lt;/gi, '<')
        .replace(/&amp;/gi, '&');
};

/**
 * 获取URL中的指定参数
 * @param {string} name 参数名称
 * @returns {?string} URL中的指定参数
 */
export const getUrlParam = function (name) {
    let regex = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let matches = Info.urlParam.match(regex);
    if (matches) return decodeURI(matches[2]);
    else return null;
};

/**
 * 去除不配对的BBCode
 * @param {string} content 引用内容
 * @returns {string} 去除了不配对BBCode的内容
 */
export const removeUnpairedBBCodeContent = function (content) {
    let startCodeList = [
        /\[color=.+?\]/g, /\[backcolor=.+?\]/g, /\[size=.+?\]/g, /\[font=.+?\]/g, /\[align=.+?\]/g, /\[b\]/g, /\[i\]/g, /\[u\]/g,
        /\[strike\]/g, /\[sup\]/g, /\[sub\]/g
    ];
    let endCodeList = [
        /\[\/color\]/g, /\[\/backcolor\]/g, /\[\/size\]/g, /\[\/font\]/g, /\[\/align\]/g, /\[\/b\]/g, /\[\/i\]/g, /\[\/u\]/g,
        /\[\/strike\]/g, /\[\/sup\]/g, /\[\/sub\]/g
    ];
    for (let i = 0; i < startCodeList.length; i++) {
        let startMatches = content.match(startCodeList[i]);
        let endMatches = content.match(endCodeList[i]);
        let startMatchesNum = startMatches ? startMatches.length : 0;
        let endMatchesNum = endMatches ? endMatches.length : 0;
        if (startMatchesNum !== endMatchesNum) {
            content = content.replace(startCodeList[i], '').replace(endCodeList[i], '');
        }
    }
    return content;
};

/**
 * 获取发帖人
 * @param {string} name 处理前的发帖人
 * @returns {string} 真实发帖人
 */
export const getFloorUserName = function (name) {
    name = $.trim(name);
    if (name.includes(' ')) {
        let arr = name.split(' ');
        return arr.length === 2 ? arr[1] : name;
    } else {
        return name;
    }
};