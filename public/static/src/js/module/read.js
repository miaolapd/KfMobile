/* 主题模块 */
'use strict';
import * as Util from './util';
import Const from './const';
import {write as writeConfig} from './config';
import * as Msg from './msg';

/**
 * 处理复制楼层跳转链接按钮
 */
export const handleCopyFloorLinkBtn = function () {
    $(document).on('click', '.floor-num', function (e) {
        e.preventDefault();
        let $this = $(this);
        let link = Util.getHostNameUrl() + $this.attr('href');
        $this.data('copy-text', link);
        if (!Util.copyText($this, $this)) {
            prompt('本楼的跳转链接：', link);
        }
    });
};

/**
 * 处理快速回复按钮
 */
export const handleFastReplyBtn = function () {
    $(document).on('click', '.fast-reply-btn', function () {
        let $article = $(this).closest('article');
        let floor = $article.data('floor');
        let userName = Util.getFloorUserName($article.data('username'));
        $('#postGjc').val(userName);
        let postContent = $('#postContent').get(0);
        postContent.value = `[quote]回 ${floor}楼(${userName}) 的帖子[/quote]\n`;
        postContent.selectionStart = postContent.value.length;
        postContent.selectionEnd = postContent.value.length;
        postContent.focus();
    });
};

/**
 * 处理提交优秀帖按钮
 */
export const handleGoodPostBtn = function () {
    $(document).on('click', '.handle-post-btn', function () {
        let $this = $(this);
        if ($this.data('wait')) return;
        let $floor = $(this).closest('.read-floor');
        let pid = $floor.data('pid');

        let tips = '是否提交本楼层为优秀帖子？';
        if (Info.goodPostTips) tips += `\n（${Info.goodPostTips}）`;
        if (!confirm(tips)) return;

        $this.data('wait', true);
        $.post('/diy_read_cztz.php', `tid=${Info.tid}&pid=${pid}&safeid=${Info.safeId}`)
            .done(function (html) {
                if (/已将本帖操作为优秀帖|该楼层已经是优秀帖/.test(html)) {
                    let $content = $floor.find('.read-content');
                    if (!$content.find('.fieldset-alert:contains("本帖为优秀帖")').length) {
                        $content.prepend('<fieldset class="fieldset fieldset-alert"><legend>↓</legend>本帖为优秀帖</fieldset>');
                    }
                }
                alert(html);
            }).always(() => $this.removeData('wait'));
    });
};

/**
 * 处理屏蔽回帖按钮
 */
export const handleBlockFloorBtn = function () {
    $(document).on('click', '.block-floor', () => confirm('确认要屏蔽该回帖？本操作不可恢复！（屏蔽后该回帖将对大家不可见）'));
};

/**
 * 处理购买帖子按钮
 */
export const handleBuyThreadBtn = function () {
    $(document).on('click', '.buy-thread-btn', function (e) {
        e.preventDefault();
        let $this = $(this);
        let pid = $this.data('pid');
        let price = $this.data('price');
        if (price > 5 && !confirm(`此贴售价${price}KFB，是否购买？`)) return;
        let $wait = Msg.wait('正在购买帖子&hellip;');
        $.get(Util.makeUrl('job/buytopic', `tid=${Info.tid}&pid=${pid}&verify=${Info.verify}&t=${new Date().getTime()}`),
            function ({msg}) {
                Msg.remove($wait);
                if (msg === '操作完成') {
                    location.reload();
                }
                else if (msg.includes('您已经购买此帖')) {
                    alert('你已经购买过此帖');
                    location.reload();
                }
                else {
                    alert('帖子购买失败');
                }
            });
    });
};

/**
 * 复制购买人名单
 */
export const copyBuyThreadList = function () {
    $(document).on('change', '.buy-thread-list', function () {
        let $this = $(this);
        if ($this.val() !== 'copyList') return;
        let list = $this.find('option').map(function (index) {
            let name = $(this).text();
            if (index === 0 || index === 1 || name.includes('-'.repeat(11))) return null;
            else return name;
        }).get().join('\n');
        $this.get(0).selectedIndex = 0;
        if (!list) {
            alert('暂时无人购买');
            return;
        }

        let $dialog = $(`
<div class="modal fade" id="buyThreadListDialog" tabindex="-1" role="dialog" aria-labelledby="buyThreadListDialogTitle"
     aria-hidden="true">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="buyThreadListDialogTitle">购买人名单</h5>
        <button class="close" data-dismiss="modal" type="button" aria-label="关闭">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <textarea class="form-control" name="buyThreadListContent" rows="14" aria-label="购买人名单">${list}</textarea>
        </div>
      </div>
    </div>
  </div>
</div>
`).appendTo('body');
        $dialog.on('shown.bs.modal', function () {
            $dialog.find('[name="buyThreadListContent"]').select().focus();
        }).on('hidden.bs.modal', function () {
            $dialog.remove();
        }).modal('show');
    });
};

/**
 * 处理楼层内的图片
 */
export const handleFloorImage = function () {
    $(document).on('click', '.img', function () {
        let $this = $(this);
        if ($this.parent().is('a') || this.naturalWidth <= $this.closest('.read-content').width()) return;
        location.href = $this.attr('src');
    });
};

/**
 * 跳转到指定楼层
 */
export const gotoFloor = function () {
    if (Info.floor && Info.floor > 0) {
        let hashName = $(`article[data-floor="${Info.floor}"]`).prev('a').attr('name');
        if (hashName) location.hash = '#' + hashName;
    }
};

/**
 * 处理快速跳转到指定楼层按钮
 */
export const handleFastGotoFloorBtn = function () {
    $('.fast-goto-floor').click(function (e) {
        e.preventDefault();
        let action = $(this).data('url');
        if (!action) return;
        let floor = parseInt(prompt('你要跳转到哪一层楼？'));
        if (!floor || floor <= 0) return;
        location.href = Util.makeUrl(action, `page=${Math.floor(floor / Config.perPageFloorNum) + 1}&floor=${floor}`);
    });
};

/**
 * 处理推帖子按钮
 */
export const handleTuiThreadBtn = function () {
    $('.tui-btn').click(function (e) {
        e.preventDefault();
        let $this = $(this);
        if ($this.data('wait')) return;
        $this.data('wait', true);
        $.ajax({
            type: 'POST',
            url: '/diy_read_tui.php',
            data: `tid=${Info.tid}&safeid=${Info.safeId}`,
            success: function (msg) {
                let matches = /<span.+?\+\d+!<\/span>\s*(\d+)/i.exec(msg);
                if (matches) {
                    let $num = $this.find('span:first');
                    $num.text('+1');
                    setTimeout(() => {
                        $num.text(matches[1]);
                    }, 1000);
                }
                else if (/已推过/.test(msg)) {
                    alert('已推过');
                }
                else {
                    alert('操作失败');
                }
            },
            error: function () {
                alert('操作失败');
            },
            complete: function () {
                $this.removeData('wait');
            }
        });
    });
};

/**
 * 处理复制代码按钮
 */
export const handleCopyCodeBtn = function () {
    $(document).on('click', '.copy-code', function (e) {
        e.preventDefault();
        let $this = $(this);
        if (Util.copyText($this.next('pre'), $this)) return;

        let code = $this.data('code');
        if (code) {
            $this.text('复制代码').removeData('code');
            $this.next('textarea').remove();
            $this.after(`<pre class="pre-scrollable">${code}</pre>`);
        }
        else {
            let $pre = $this.next('pre');
            let html = $pre.html();
            $this.text('还原代码').data('code', html);
            html = Util.decodeHtmlSpecialChar(html);
            let height = $pre.height();
            if (height < 50) height = 50;
            if (height > 340) height = 340;
            $pre.remove();
            $(`<textarea class="form-control code-textarea" style="height: ${height}px" wrap="off">${html}</textarea>`)
                .insertAfter($this).select().focus();
        }
    });
};

/**
 * 获取当前页面选中的多重引用数据
 * @returns {{}[]} 多重引用数据列表
 */
const getCheckedMultiQuoteData = function () {
    let quoteList = [];
    $('.multi-quote-check:checked').each(function () {
        let $article = $(this).closest('article');
        quoteList.push({floor: $article.data('floor'), pid: $article.data('pid'), userName: Util.getFloorUserName($article.data('username'))});
    });
    return quoteList;
};

/**
 * 绑定多重引用复选框点击事件
 */
export const bindMultiQuoteCheckClick = function () {
    $(document).on('click', '.multi-quote-check', function () {
        let data = localStorage[Const.multiQuoteStorageName];
        if (data) {
            try {
                data = JSON.parse(data);
                if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) data = null;
                else if (!('tid' in data) || data.tid !== Info.tid || $.type(data.quoteList) !== 'object') data = null;
            }
            catch (ex) {
                data = null;
            }
        }
        else {
            data = null;
        }
        let quoteList = getCheckedMultiQuoteData();
        if (!data) {
            localStorage.removeItem(Const.multiQuoteStorageName);
            data = {tid: Info.tid, quoteList: {}};
        }
        if (quoteList.length > 0) data.quoteList[Info.currentPageNum] = quoteList;
        else delete data.quoteList[Info.currentPageNum];
        localStorage[Const.multiQuoteStorageName] = JSON.stringify(data);
    });
};

/**
 * 添加用户自定义备注
 */
export const addUserMemo = function () {
    if ($.isEmptyObject(Config.userMemoList)) return;
    $('.read-floor').each(function () {
        let $this = $(this);
        let userName = Util.getFloorUserName($this.data('username'));
        let key = Object.keys(Config.userMemoList).find(name => name === userName);
        if (!key) return;
        $this.find('.floor-user').after(
            `<span class="tips font-size-sm" data-toggle="tooltip" title="备注：${Config.userMemoList[key]}">[?]</span>`
        );
    });
};

/**
 * 替换附件标签
 */
export const replaceAttachLabel = function () {
    $('.attach-label').each(function () {
        let $this = $(this);
        if ($this.closest('.blockquote').length > 0) return;
        let aid = $this.data('aid');
        let pid = $this.closest('.read-floor').data('pid');
        $this.replaceWith(`<img class="img" src="/job.php?action=download&pid=${pid}&tid=${Info.tid}&aid=${aid}" alt="[附件图片]">`);
    });
};

/**
 * 处理一键移动主题按钮
 */
export const handleMoveThreadBtn = function () {
    $('#moveThreadBtn').click(function (e) {
        e.preventDefault();
        if (!confirm('是否将该主题移到[无限制资源区]？')) return;
        $.post('/diy_admin_read.php', `tid=${Info.tid}&safeid=${Info.safeId}`, function (msg) {
            alert(msg);
            location.reload();
        });
    });
};