/* 公共模块 */
'use strict';
import * as Util from './util';
import Const from './const';
import * as Dialog from './dialog';
import {read as readConfig, write as writeConfig} from './config';
import * as ConfigDialog from './configDialog';

/**
 * 处理主菜单
 */
export const handleMainMenu = function () {
    $('#mainMenuTogglerBtn').click(function () {
        let maxHeight = document.documentElement.clientHeight - $(this).closest('.navbar').outerHeight();
        if (maxHeight > 0) {
            $('#mainMenu').css('max-height', maxHeight + 'px');
        }
    });
    $('#sidebarMainMenuBtn').click(() => $('#mainMenuTogglerBtn').click());
};

/**
 * 处理主菜单链接
 */
export const handleMainMenuLink = function () {
    $('#mainMenu').find('[data-name="openConfigDialog"]').click(function (e) {
        e.preventDefault();
        $('#mainMenuTogglerBtn').click();
        ConfigDialog.show();
    });
};

/**
 * 显示侧边栏按钮组
 */
export const showSidebarBtnGroup = function () {
    $('.sidebar-btn-group').prop('hidden', false);
    if (Config.showSidebarRollBtnEnabled) $('#sidebarRollBtn').prop('hidden', false);
    if (Config.showSidebarMainMenuBtnEnabled) $('#sidebarMainMenuBtn').prop('hidden', false);
    if (Config.showSidebarForumListBtnEnabled) $('#sidebarForumListBtn').prop('hidden', false);
    if (Config.showSidebarSearchBtnEnabled) $('#sidebarSearchBtn').prop('hidden', false);
    if (Config.showSidebarHomePageBtnEnabled) $('#sidebarHomePageBtn').prop('hidden', false);
};

/**
 * 处理侧边栏的滚动到页顶/页底按钮
 */
export const handleSidebarRollBtn = function () {
    $(window).scroll(function () {
        let $btn = $('#sidebarRollBtn');
        if ($(window).scrollTop() > 640) {
            if ($btn.data('direction') === 'top') return;
            $btn.data('direction', 'top').attr('aria-label', '滚动到页顶')
                .find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
        else {
            if ($btn.data('direction') === 'bottom') return;
            $btn.data('direction', 'bottom').attr('aria-label', '滚动到页底')
                .find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        }
    });

    $('#sidebarRollBtn').click(function () {
        let scrollTop = $(this).data('direction') === 'bottom' ? $('body').height() : 0;
        $('body, html').animate({scrollTop: scrollTop});
    });
};

/**
 * 处理搜索对话框
 */
export const handleSearchDialog = function () {
    let $searchDialog = $('#searchDialog');
    $searchDialog.find('#searchType > option[value="username"]').prop('hidden', !Config.adminMemberEnabled);

    $searchDialog.on('shown.bs.modal', function () {
        $('#searchKeyword').select().focus();
    }).find('form').submit(function () {
        let $this = $(this);
        let $searchKeyword = $this.find('#searchKeyword');
        let searchType = $this.find('#searchType').val();
        let keyword = $.trim($searchKeyword.val());
        if (searchType === 'gjc') {
            $this.attr('action', Util.makeUrl('gjc/' + keyword));
        }
        else if (searchType === 'username') {
            $this.attr('action', Util.makeUrl('user/username/' + keyword));
        }
        else {
            $this.attr('action', Util.makeUrl('search'));
            $searchKeyword.attr('name', searchType === 'author' ? 'pwuser' : 'keyword');
            if (searchType === 'title') {
                if (keyword.length && Util.getStrByteLen(keyword) <= 2) {
                    $searchKeyword.val(keyword + ' ' + keyword);
                }
            }
        }
    });

    $searchDialog.find('[name="searchRange"]').on('click', function () {
        let value = 'all';
        if ($(this).val() === 'current') value = Info.fid;
        $searchDialog.find('[name="f_fid"]').val(value);
    });

    let $current = $searchDialog.find('[name="searchRange"][value="current"]');
    let $currentBox = $current.closest('.form-check-inline');
    $searchDialog.find('#searchType').change(function () {
        let searchType = $(this).val();
        if (!$current.data('enabled')) return;
        let disabled = searchType === 'gjc' || searchType === 'username';
        $current.prop('disabled', disabled);
        if (disabled) $currentBox.addClass('disabled');
        else $currentBox.removeClass('disabled');
    });

    if (pageId === 'threadPage' || pageId === 'readPage') {
        $current.prop('disabled', false).data('enabled', true).click();
        $currentBox.removeClass('disabled');
    }
};

/**
 * 处理分页导航
 */
export const handlePageInput = function () {
    $(document).on('click', '.page-input', function (e) {
        e.preventDefault();
        if (Info.maxPageNum && Info.maxPageNum <= 1) return;
        let action = $(this).data('url');
        if (!action) return;
        let excludeParams = $(this).data('exclude');
        if (excludeParams) excludeParams = excludeParams.split(',');
        else excludeParams = [];
        let num = parseInt(
            prompt(`要跳转到第几页？${Info.maxPageNum ? `（共${Info.maxPageNum}页）` : ''}`, Info.currentPageNum)
        );
        if (num && num > 0) {
            location.href = Util.makeUrl(action, 'page=' + num, true, excludeParams);
        }
    });
};

/**
 * 绑定快速提交的快捷键
 */
export const bindFastSubmitShortcutKey = function () {
    $('[data-fast-submit="true"]').keydown(function (e) {
        if (e.keyCode === 13 && e.ctrlKey) {
            $(this).closest('form').submit();
        }
    });
};

/**
 * 显示编辑常用版块对话框
 */
export const showEditCommonForumDialog = function () {
    $(document).on('click', '.edit-common-forum-btn', function (e) {
        e.preventDefault();
        const dialogName = 'editCommonForumDialog';
        if ($('#' + dialogName).length > 0) return;
        readConfig();

        let commonForumList = Config.commonForumList.length > 0 ? Config.commonForumList : Const.commonForumList;
        let commonForumListHtml = '';
        for (let {fid, name} of commonForumList) {
            commonForumListHtml += `<span class="btn btn-outline-primary" data-fid="${fid}">${name}</span>`;
        }
        let availableForumListHtml = '';
        for (let {fid, name} of Const.availableForumList) {
            if (commonForumList.find(elem => elem.fid === fid)) continue;
            availableForumListHtml += `<span class="btn btn-outline-primary" data-fid="${fid}">${name}</span>`;
        }

        let bodyContent = `
<p class="font-size-sm text-muted">
  请将可用版块内的版块按钮拖拽到常用版块内（或相反）
</p>
<fieldset class="fieldset mb-3 py-2">
  <legend>常用版块</legend>
  <div class="edit-forum-list d-flex flex-wrap" id="editCommonForumList">${commonForumListHtml}</div>
</fieldset>
<fieldset class="fieldset mb-3 py-2">
  <legend>可用版块</legend>
  <div class="edit-forum-list d-flex flex-wrap" id="editAvailableForumList">${availableForumListHtml}</div>
</fieldset>`;
        let footerContent = `
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>
<button class="btn btn-danger" name="reset" type="button">重置</button>`;
        let $dialog = Dialog.create(dialogName, '编辑常用版块', bodyContent, footerContent);

        const dragulaInit = function () {
            let drake = dragula($dialog.find('.edit-forum-list').get(), {revertOnSpill: true});
            drake.on('drag', function () {
                $dialog.find('.dialog-body').css('overflow-y', 'hidden');
            }).on('drop', function () {
                $dialog.find('.dialog-body').css('overflow-y', 'auto');
            }).on('cancel', function () {
                $dialog.find('.dialog-body').css('overflow-y', 'auto');
            });
        };

        let $dragulaScriptPath = $('[name="dragulaScriptPath"]');
        let dragulaScriptPath = $dragulaScriptPath.val();
        if (dragulaScriptPath) {
            $.getScript(dragulaScriptPath, dragulaInit);
            $dragulaScriptPath.val('');
        }
        else {
            dragulaInit();
        }

        $dialog.submit(function (e) {
            e.preventDefault();
            Config.commonForumList = [];
            $('#editCommonForumList').children('.btn').each(function () {
                let $this = $(this);
                let fid = parseInt($this.data('fid'));
                let name = $this.text().trim();
                if (!fid || !name) return;
                Config.commonForumList.push({fid: fid, name: name});
            });
            writeConfig();
            alert('设置已保存');
            Dialog.close(dialogName);
            location.reload();
        }).find('[name="reset"]').click(function () {
            if (!confirm('是否重置？')) return;
            Config.commonForumList = [];
            writeConfig();
            alert('设置已重置');
            Dialog.close(dialogName);
            location.reload();
        });

        Dialog.show(dialogName);
    });
};

/**
 * 填充常用版块面板
 */
export const fillCommonForumPanel = function () {
    let commonForumList = Config.commonForumList.length > 0 ? Config.commonForumList : Const.commonForumList;
    let html = '';
    for (let [index, {fid, name}] of commonForumList.entries()) {
        if (index === 0 || index % 3 === 0) html += '<div class="row mb-3">';
        html += `
<div class="col-4">
  <a class="btn btn-outline-primary btn-block" href="${Util.makeUrl('thread')}/${fid}">${name}</a>
</div>`;
        if (index === commonForumList.length - 1 || index % 3 === 2) html += '</div>';
    }
    $('.common-forum-panel').html(html);
};

/**
 * 在操作进行时阻止关闭页面
 */
export const preventCloseWindow = function () {
    window.addEventListener("beforeunload", function (e) {
        if ($('.mask').length > 0) {
            let msg = '正在进行操作中，确定要关闭页面吗？';
            e.returnValue = msg;
            return msg;
        }
    });
};

/**
 * 显示通用的导入/导出设置对话框
 * @param {string} title 对话框标题
 * @param {string} configName 设置名称
 * @param {?function} [callback] 回调方法
 * @param {?function} [callbackAfterSubmit] 在提交之后的回调方法
 */
export const showCommonImportOrExportConfigDialog = function (title, configName, callback, callbackAfterSubmit) {
    const dialogName = 'pdCommonImOrExConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    let bodyContent = `
<p class="font-size-sm">
  <b>导入设置：</b>将设置内容粘贴到文本框中并点击保存按钮即可<br>
  <b>导出设置：</b>复制文本框里的内容并粘贴到别处即可
</p>
<div class="form-group">
  <textarea class="form-control font-size-sm" name="commonConfig" rows="10" aria-label="设置内容" style="word-break: break-all;"></textarea>
</div>`;
    let footerContent = `
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>`;
    let $dialog = Dialog.create(dialogName, `导入或导出${title}`, bodyContent, footerContent);

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        let options = $.trim($dialog.find('[name="commonConfig"]').val());
        if (!options) return;
        try {
            options = JSON.parse(options);
        }
        catch (ex) {
            alert('设置有错误');
            return;
        }
        if (!options || $.type(options) !== $.type(Config[configName])) {
            alert('设置有错误');
            return;
        }
        Config[configName] = options;
        writeConfig();
        alert('设置已导入');
        Dialog.close(dialogName);
        if (typeof callbackAfterSubmit === 'function') callbackAfterSubmit();
        else location.reload();
    });
    Dialog.show(dialogName);
    $dialog.find('[name="commonConfig"]').val(JSON.stringify(Config[configName])).select().focus();
    if (typeof callback === 'function') callback($dialog);
};

/**
 * 关注用户
 */
export const followUsers = function () {
    if (!Config.followUserList.length) return;
    if (pageId === 'indexPage' && Config.highlightFollowUserThreadInHPEnabled) {
        $('.thread-link').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.data('author'), Config.followUserList) > -1) {
                $this.addClass('text-danger');
            }
        });
    }
    else if (pageId === 'threadPage') {
        $('.thread-link').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.data('author'), Config.followUserList) > -1) {
                $this.closest('.thread-list-item').find('.thread-footer-column a:first').addClass('text-danger');
                if (Config.highlightFollowUserThreadLinkEnabled) $this.addClass('text-danger');
            }
        });
    }
    else if (pageId === 'readPage') {
        $('.read-floor').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList(Util.getFloorUserName($this.data('username')), Config.followUserList) > -1) {
                $this.find('.floor-num').addClass('text-danger');
            }
        });
    }
    else if (pageId === 'gjcPage' || pageId === 'sharePage' || pageId === 'searchPage') {
        $('.thread-list-group').find('a[data-author]').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.data('author'), Config.followUserList) > -1) {
                $this.addClass('text-danger');
            }
        });
    }
};

/**
 * 屏蔽用户
 */
export const blockUsers = function () {
    if (!Config.blockUserList.length) return;
    let num = 0;
    if (pageId === 'indexPage') {
        $('.thread-link').each(function () {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList($this.data('author'), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type <= 1) {
                num++;
                $this.closest('.thread-link-group').remove();
            }
        });
    }
    else if (pageId === 'threadPage') {
        if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(Info.fid)) return;
        else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(Info.fid)) return;
        $('.thread-link').each(function () {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList($this.data('author'), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type <= 1) {
                num++;
                $this.closest('.thread-list-item').remove();
            }
        });
    }
    else if (pageId === 'readPage') {
        if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(Info.fid)) return;
        else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(Info.fid)) return;
        $('.read-floor').each(function () {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList(Util.getFloorUserName($this.data('username')), Config.blockUserList);
            if (index > -1) {
                let floor = parseInt($this.data('floor'));
                if (Config.blockUserList[index].type === 2 && floor === 0) return;
                else if (Config.blockUserList[index].type === 1 && floor > 0) return;
                num++;
                $this.closest('.read-floor').remove();
            }
        });
        $('.read-content').find('.blockquote > p').each(function () {
            let $this = $(this);
            let content = $this.text().trim();
            for (let data of Config.blockUserList) {
                if (data.type === 1) continue;
                try {
                    let regex1 = new RegExp(`^引用(第\\d+楼|楼主)${data.name}于`, 'i');
                    let regex2 = new RegExp(`^回\\s*\\d+楼\\(${data.name}\\)\\s*的帖子`, 'i');
                    if (regex1.test(content) || regex2.test(content)) {
                        $this.html(`<mark class="help" data-toggle="tooltip" title="被屏蔽用户：${data.name}">该用户已被屏蔽</mark>`);
                    }
                }
                catch (ex) {
                }
            }
        });
    }
    else if (pageId === 'gjcPage' && Config.blockUserAtTipsEnabled) {
        $('.thread-list-group').find('a[data-author]').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.data('author'), Config.blockUserList) > -1) {
                num++;
                $this.closest('.thread-list-item').remove();
            }
        });
    }
    if (num > 0) console.log(`【屏蔽用户】共有${num}个主题或回复被屏蔽`);
};

/**
 * 屏蔽主题
 */
export const blockThread = function () {
    if (!Config.blockThreadList.length) return;

    /**
     * 是否屏蔽主题
     * @param {string} title 主题标题
     * @param {string} userName 用户名
     * @param {number} fid 版块ID
     * @returns {boolean} 是否屏蔽
     */
    const isBlock = function (title, userName, fid = 0) {
        for (let {keyWord, includeUser, excludeUser, includeFid, excludeFid} of Config.blockThreadList) {
            let regex = null;
            if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
                try {
                    regex = eval(keyWord);
                }
                catch (ex) {
                    console.log(ex);
                    continue;
                }
            }
            if (userName) {
                if (includeUser) {
                    if (!includeUser.includes(userName)) continue;
                }
                else if (excludeUser) {
                    if (excludeUser.includes(userName)) continue;
                }
            }
            if (fid) {
                if (includeFid) {
                    if (!includeFid.includes(fid)) continue;
                }
                else if (excludeFid) {
                    if (excludeFid.includes(fid)) continue;
                }
            }
            if (regex) {
                if (regex.test(title)) return true;
            }
            else {
                if (title.toLowerCase().includes(keyWord.toLowerCase())) return true;
            }
        }
        return false;
    };

    let num = 0;
    if (pageId === 'indexPage') {
        $('.thread-link').each(function () {
            let $this = $(this);
            if (isBlock($this.text().trim(), $this.data('author'))) {
                num++;
                $this.closest('.thread-link-group').remove();
            }
        });
    }
    else if (pageId === 'threadPage') {
        $('.thread-link').each(function () {
            let $this = $(this);
            if (isBlock($this.attr('title'), $this.data('author'), Info.fid)) {
                num++;
                $this.closest('.thread-list-item').remove();
            }
        });
    }
    else if (pageId === 'readPage') {
        if (Info.currentPageNum !== 1) return;
        let $topFloor = $('.read-floor[data-floor="0"]');
        if (!$topFloor.length) return;
        if (isBlock($('.thread-title').text().trim(), Util.getFloorUserName($topFloor.data('username')), Info.fid)) {
            num++;
            $topFloor.remove();
        }
    }
    if (num > 0) console.log(`【屏蔽主题】共有${num}个主题被屏蔽`);
};
