// ==UserScript==
// @name        发帖常用文本
// @version     1.0
// @trigger     end
// @author      喵拉布丁
// @homepage    read/682170/spid/14036917/sf/6d7
// @description 在发帖框旁会显示常用文本下拉列表，选择相应项目即可在发帖框内快速添加相应文本
// ==/UserScript==
'use strict';

(function () {
    if (pageId !== 'readPage' && pageId !== 'postPage') return;

    /**
     * 常用文本列表
     * 可在此增删自定义的常用文本，有三种定义方式：
     * 1. 只在标签内定义了文本的项目：
     *    常用文本下拉列表和发帖框里最终显示的均为标签内的文本，例：'<a class="dropdown-item" href="#">常用文本1</a>'
     * 2. 定义了data-value属性的项目：
     *    标签内的文本会显示在常用文本下拉列表内，而发帖框里最终显示的将是data-value属性里的文本
     *    例：'<a class="dropdown-item" data-value="这里是常用文本2！" href="#">常用文本2</a>'
     * 3. 定义了data-action属性的项目：
     *    标签内的文本会显示在常用文本下拉列表内，而发帖框里最终显示的将是经过（动作列表中与data-action相匹配的）自定义函数所处理过的文本
     *    例：'<a class="dropdown-item" data-action="动作标签" href="#">常用文本3...</a>'
     */
    var itemList = ['<a class="dropdown-item" href="#">感谢楼主的分享！</a>', '<a class="dropdown-item" data-value="恭喜楼主！[s:44]" href="#">恭喜楼主！</a>', '<a class="dropdown-item" data-action="隐藏内容" href="#">隐藏内容...</a>'];

    // 动作列表：用于定义常用文本列表中与data-action属性相匹配的自定义函数，返回经过自定义函数处理的字符串
    var actionList = {
        '隐藏内容': function _() {
            var num = parseInt(prompt('请输入神秘等级：', 300)); // 此处可以修改隐藏内容的预设神秘等级
            return !isNaN(num) ? '[hide=' + num + ']隐藏内容[/hide]' : '';
        }
    };

    var $node = $('\n<div class="' + (pageId === 'postPage' ? 'dropup mr-1' : 'dropdown ml-1') + '">\n  <button class="btn btn-secondary dropdown-toggle" id="commonPostTextDropdownBtn" type="button" data-toggle="dropdown" title="\u53D1\u5E16\u5E38\u7528\u6587\u672C"\n          aria-label="\u53D1\u5E16\u5E38\u7528\u6587\u672C" aria-haspopup="true" aria-expanded="false">\n    <i class="fa fa-list" aria-hidden="true"></i>\n  </button>\n  <div class="dropdown-menu common-post-text-dropdown-menu ' + (pageId === 'readPage' ? 'dropdown-menu-right' : '') + '" aria-labelledby="commonPostTextDropdownBtn">\n    ' + itemList.join('') + '\n  </div>\n</div>\n');
    if (pageId === 'postPage') {
        $('#smileDropdownBtn').parent().after($node);
    } else {
        $('#smileDropdownBtn').parent().before($node);
    }

    $node.find('.dropdown-menu').on('click', '.dropdown-item', function (e) {
        e.preventDefault();
        var $this = $(this);
        var text = '';
        var action = $this.data('action');
        if (action) {
            if (typeof actionList[action] === 'function') {
                text = actionList[action]();
            }
        } else {
            text = $this.data('value');
            text = text ? text : $.trim($this.text());
        }
        if (text) {
            var $postContent = $('#postContent');
            var content = $postContent.val();
            content += (content && !/\n$/.test(content) ? '\n' : '') + text;
            $postContent.val(content).focus();
            $postContent.get(0).selectionStart = content.length;
            $postContent.get(0).selectionEnd = content.length;
        }
    });
})();