/* 发帖模块 */
'use strict';
import * as Util from './util';
import Const from './const';
import * as Msg from './msg';

/**
 * 处理编辑器按钮
 */
export const handleEditorBtns = function () {
    let textArea = $('#postContent').get(0);

    // 编辑器按钮
    $(document).on('click', '.editor-btn-group button[data-action]', function () {
        let action = $(this).data('action');
        let value = '';
        switch (action) {
            case 'link':
                value = prompt('请输入链接URL：', 'http://');
                break;
            case 'img':
                value = prompt('请输入图片URL：', 'http://');
                break;
            case 'sell':
                value = prompt('请输入出售金额：', 1);
                break;
            case 'hide':
                value = prompt('请输入神秘等级：', 1);
                break;
            case 'audio': {
                value = prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐的单曲地址，将自动转换为外链地址）', 'http://');
                let matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(value);
                if (matches) value = `https://music.miaola.work/163/${matches[1]}.mp3`;
                matches = /^https?:\/\/www\.xiami\.com\/song\/(\w+)/i.exec(value);
                if (matches) value = `https://music.miaola.work/xiami/${matches[1]}.mp3`;
            }
                break;
            case 'video': {
                value = prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，将自动转换为外链地址）', 'http://');
                let matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(value);
                if (matches) value = `https://video.miaola.work/youtube/${matches[1]}`;
                matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(value);
                if (matches) value = `https://video.miaola.work/youtube/${matches[1]}`;
            }
                break;
        }
        if (value === null) return;

        let selText = '';
        let code = '';
        switch (action) {
            case 'link':
                selText = Util.getSelText(textArea);
                code = `[url=${value}]${selText}[/url]`;
                break;
            case 'img':
                code = `[img]${value}[/img]`;
                break;
            case 'quote':
                selText = Util.getSelText(textArea);
                code = `[quote]${selText}[/quote]`;
                break;
            case 'code':
                selText = Util.getSelText(textArea);
                code = `[code]${selText}[/code]`;
                break;
            case 'sell':
                selText = Util.getSelText(textArea);
                code = `[sell=${value}]${selText}[/sell]`;
                break;
            case 'hide':
                selText = Util.getSelText(textArea);
                code = `[hide=${value}]${selText}[/hide]`;
                break;
            case 'bold':
                selText = Util.getSelText(textArea);
                code = `[b]${selText}[/b]`;
                break;
            case 'italic':
                selText = Util.getSelText(textArea);
                code = `[i]${selText}[/i]`;
                break;
            case 'underline':
                selText = Util.getSelText(textArea);
                code = `[u]${selText}[/u]`;
                break;
            case 'strike':
                selText = Util.getSelText(textArea);
                code = `[strike]${selText}[/strike]`;
                break;
            case 'super':
                selText = Util.getSelText(textArea);
                code = `[sup]${selText}[/sup]`;
                break;
            case 'sub':
                selText = Util.getSelText(textArea);
                code = `[sub]${selText}[/sub]`;
                break;
            case 'horizontal':
                code = `[hr]`;
                break;
            case 'align-left':
                selText = Util.getSelText(textArea);
                code = `[align=left]${selText}[/align]`;
                break;
            case 'align-center':
                selText = Util.getSelText(textArea);
                code = `[align=center]${selText}[/align]`;
                break;
            case 'align-right':
                selText = Util.getSelText(textArea);
                code = `[align=right]${selText}[/align]`;
                break;
            case 'fly':
                selText = Util.getSelText(textArea);
                code = `[fly]${selText}[/fly]`;
                break;
            case 'audio':
                code = `[audio]${value}[/audio]`;
                break;
            case 'video':
                code = `[video]${value}[/video]`;
                break;
        }
        if (!code) return;
        Util.addCode(textArea, code, selText);
        textArea.focus();
    });

    // 字号下拉菜单
    $('#fontSizeDropdownMenu').on('click', 'a', function (e) {
        e.preventDefault();
        let size = $(this).data('size');
        let selText = Util.getSelText(textArea);
        let code = `[size=${size}]${selText}[/size]`;
        Util.addCode(textArea, code, selText);
        textArea.focus();
    });

    // 颜色、背景颜色下拉菜单
    $('#colorDropdownMenu, #bgColorDropdownMenu').on('click', 'span', function () {
        let $this = $(this);
        let codeType = $this.parent().is('#bgColorDropdownMenu') ? 'backcolor' : 'color';
        let color = $this.data('color');
        let selText = Util.getSelText(textArea);
        let code = `[${codeType}=${color}]${selText}[/${codeType}]`;
        Util.addCode(textArea, code, selText);
        textArea.focus();
    });
};

/**
 * 检查发帖表单
 */
export const checkPostForm = function () {
    $('#postForm').submit(function () {
        let $postType = $('#postType');
        if ($postType.length > 0 && !$postType.val()) {
            alert('没有选择主题分类');
            $postType.focus();
            return false;
        }

        let $postTitle = $('[name="atc_title"]');
        if ($postTitle.length > 0) {
            let length = Util.getStrByteLen($postTitle.val());
            if (!length) {
                alert('标题不能为空');
                $postTitle.focus();
                return false;
            }
            else if (length > 100) {
                alert(`标题长度为 ${length} 字节(不可超过 100 字节)，请减少标题长度`);
                $postTitle.focus();
                return false;
            }
        }

        let $voteItemContent = $('#voteItemContent');
        if ($voteItemContent.length > 0) {
            if (!$voteItemContent.val().trim()) {
                alert('投票选项不能为空');
                $voteItemContent.focus();
                return false;
            }
        }

        let $postContent = $('#postContent');
        if ($postContent.length > 0) {
            let length = Util.getStrByteLen($postContent.val().trim());
            if (length < 12) {
                alert('文章内容少于 12 个字节');
                $postContent.focus();
                return false;
            }
            else if (length > 50000) {
                alert('文章内容大于 50000 个字节');
                $postContent.focus();
                return false;
            }
        }

        let $postGjc = $('#postGjc');
        if ($postGjc.length > 0 && Info.action === 'new' && !$postGjc.val().trim()) {
            alert('请在内容文本框的下方填写关键词，以方便搜索，也可以在标题中选择任意一个词填入');
            $postGjc.focus();
            return false;
        }
    });
};

/**
 * 处理附件按钮
 */
export const handleAttachBtns = function () {
    $(document).on('click', '.attach-area a[data-action]', function (e) {
        e.preventDefault();
        let $this = $(this);
        let $area = $this.closest('.attach-area');
        let action = $this.data('action');
        let id = $area.data('id');
        if (!id) return;
        if (action === 'insert') {
            let type = $this.data('type');
            let textArea = $('#postContent').get(0);
            let code = `[${type === 'new' ? 'upload' : 'attachment'}=${id}]`;
            Util.addCode(textArea, code);
            textArea.focus();
        }
        else if (action === 'update') {
            $area.find('.attach-info').prop('hidden', true).after(
                `<label><input name="replace_${id}" type="file" aria-label="选择附件"></label>`
            );
            $this.data('action', 'cancel').text('取消').blur();
            if (!$(document).data('attachUpdateAlert')) {
                alert('本反向代理服务器为了提高性能对图片设置了缓存，更新附件图片后可能需等待最多30分钟才能看到效果');
                $(document).data('attachUpdateAlert', true);
            }
        }
        else if (action === 'cancel') {
            $area.find('.attach-info').prop('hidden', false).next('label').remove();
            $this.data('action', 'update').text('更新').blur();
        }
        else if (action === 'delete') {
            $area.remove();
        }
    });

    $(document).on('change', '[type="file"]', function () {
        let $this = $(this);
        let matches = /\.(\w+)$/.exec($this.val());
        if (!matches || !['jpg', 'gif', 'png', 'torrent'].includes(matches[1].toLowerCase())) {
            alert('附件类型不匹配');
            return;
        }

        let type = $this.data('type');
        if (type === 'new') {
            $this.removeData('type').parent().next().prop('hidden', false);

            let $newAttachArea = $('#newAttachArea');
            let totalNum = $newAttachArea.find('[type="file"]').length;
            if (totalNum >= 5) return;
            let $lastAttachArea = $newAttachArea.find('[type="file"]:last').closest('.attach-area');
            let id = parseInt($lastAttachArea.data('id'));
            if (!id) return;
            id++;
            $(`
<div class="form-group row font-size-sm attach-area" data-id="${id}">
  <div class="col-12 col-form-label">
    <label>
      <input name="attachment_${id}" data-type="new" type="file" aria-label="选择附件">
    </label>
    <span hidden>
      <a data-action="insert" data-type="new" href="#">插入</a>&nbsp;
      <a data-action="delete" href="#">删除</a>
    </span>
  </div>
  <div class="col-4">
    <label class="sr-only" for="atc_downrvrc${id}">神秘系数</label>
    <input class="form-control form-control-sm" id="atc_downrvrc${id}" name="atc_downrvrc${id}" data-toggle="tooltip" 
type="number" value="0" min="0" title="神秘系数" placeholder="神秘系数">
  </div>
  <div class="col-8">
    <label class="sr-only" for="atc_desc${id}">描述</label>
    <input class="form-control form-control-sm" id="atc_desc${id}" name="atc_desc${id}" data-toggle="tooltip" type="text" 
title="描述" placeholder="描述">
  </div>
</div>
`).insertAfter($lastAttachArea).find('[data-toggle="tooltip"]').tooltip({'container': 'body'});
        }
    });
};

/**
 * 插入表情代码
 * @param {jQuery} $node 想要绑定的节点的jQuery对象
 */
export const addSmileCode = function ($node) {
    $('.smile-panel').on('click', 'img', function () {
        $('.smile-panel').addClass('open');
        let textArea = $node.get(0);
        if (!textArea) return;
        let code = `[s:${$(this).data('id')}]`;
        Util.addCode(textArea, code, '');
        textArea.blur();
    }).parent().on('shown.bs.dropdown', function () {
        $('.smile-panel img').each(function () {
            let $this = $(this);
            if (!$this.attr('src')) {
                $this.attr('src', $this.data('src'));
            }
        });
    }).on('hide.bs.dropdown', function (e) {
        let $relatedTarget = $(e.relatedTarget);
        if (!$relatedTarget.data('open')) $relatedTarget.removeData('open');
        else return e.preventDefault();
    });

    $('#smileDropdownBtn').click(function () {
        let $this = $(this);
        $this.data('open', !$this.data('open'));
    });
};

/**
 * 处理多重回复和多重引用
 * @param {number} type 处理类型，1：多重回复；2：多重引用
 */
export const handleMultiQuote = function (type = 1) {
    let data = localStorage[Const.multiQuoteStorageName];
    if (!data) return;
    try {
        data = JSON.parse(data);
    }
    catch (ex) {
        return;
    }
    if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) return;
    let {tid, quoteList} = data;
    if (!Info.tid || tid !== Info.tid || $.type(quoteList) !== 'object') return;
    if (type === 2 && !Info.fid) return;
    let list = [];
    for (let data of Object.values(quoteList)) {
        if (!Array.isArray(data)) continue;
        for (let quote of data) {
            list.push(quote);
        }
    }
    if (!list.length) {
        localStorage.removeItem(Const.multiQuoteStorageName);
        return;
    }

    let keywords = new Set();
    let content = '';
    let $keywords = $('[name="diy_guanjianci"]');
    if (type === 2) {
        Msg.wait(`<span class="mr-3">正在获取引用内容中&hellip;</span>剩余：<em class="text-warning countdown-num">${list.length}</em>`);
        $(document).clearQueue('MultiQuote');
    }
    $.each(list, function (index, data) {
        if (typeof data.floor === 'undefined' || typeof data.pid === 'undefined') return;
        keywords.add(data.userName);
        if (type === 2) {
            $(document).queue('MultiQuote', function () {
                $.get(Util.makeUrl(
                    'post/index',
                    `action=quote&fid=${Info.fid}&tid=${tid}&pid=${data.pid}&article=${data.floor}&t=${new Date().getTime()}`
                ), function ({postContent}) {
                    content += postContent ? postContent + (index === list.length - 1 ? '' : '\n') : '';
                    let $countdownNum = $('.countdown-num:last');
                    $countdownNum.text(parseInt($countdownNum.text()) - 1);
                    if (index === list.length - 1) {
                        Msg.destroy();
                        $('#postContent').val(content).focus();
                        $keywords.trigger('change');
                    }
                    else {
                        setTimeout(() => $(document).dequeue('MultiQuote'), 100);
                    }
                });
            });
        }
        else {
            content += `[quote]回 ${data.floor}楼(${data.userName}) 的帖子[/quote]\n`;
        }
    });
    for (let [index, quote] of list.entries()) {
    }
    $keywords.val([...keywords].join(','));
    $('#postForm').submit(function () {
        localStorage.removeItem(Const.multiQuoteStorageName);
    });
    if (type === 2) {
        $(document).dequeue('MultiQuote');
    }
    else {
        $('#postContent').val(content).focus();
        $keywords.trigger('change');
    }
};

/**
 * 处理清除多重引用数据按钮
 */
export const handleClearMultiQuoteDataBtn = function () {
    $('.clear-multi-quote-data-btn').click(function (e) {
        e.preventDefault();
        if (!confirm('是否清除多重引用数据？')) return;
        localStorage.removeItem(Const.multiQuoteStorageName);
        $('[name="diy_guanjianci"]').val('');
        $('#postContent').val('');
    });
};

/**
 * 添加多余关键词警告
 */
export const addRedundantKeywordWarning = function () {
    $('input[name="diy_guanjianci"]').change(function () {
        let $this = $(this);
        let keywords = $.trim($this.val()).split(',').filter(str => str);
        if (keywords.length > 5) {
            alert('所填关键词已超过5个，多余的关键词将被忽略');
            $this.select().focus();
        }
    });
};


/**
 * 特殊发帖标题格式变化
 */
export const specialPostTitleChange = function () {
    let wangPanType = $.trim($('#wangPanType').val());
    let fileSize = $.trim($('#fileSize').val());
    let expiryDate = $.trim($('#expiryDate').val());
    let fileFormat = $.trim($('#fileFormat').val());
    let ziGou = $('#ziGou').prop('checked') ? '[自购]' : '';
    let xinZuo = $('#xinZuo').prop('checked') ? '[新作]' : '';
    let fileTitle = $.trim($('#fileTitle').val());
    let now = new Date();
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');

    let previewTitle = `[${month}.${day}]${ziGou}${xinZuo}${fileTitle}[${wangPanType}${expiryDate}][${fileSize}]${fileFormat ? `[${fileFormat}]` : ''}`;
    let realTitle = `[${month}.${day}]${ziGou}${fileTitle}[${wangPanType}${expiryDate}][${fileSize}]${fileFormat ? `[${fileFormat}]` : ''}`;

    let titleLength = Util.getStrByteLen(realTitle);
    if(titleLength > 100) {
        $('#previewTitle').text(`标题总长度为${titleLength}字节(不可超过100字节)，请减少标题长度`).addClass('text-danger');
    }
    else {
        $('#previewTitle').text(previewTitle).removeClass('text-danger');
    }
    $('#realTitle').val(realTitle);
};