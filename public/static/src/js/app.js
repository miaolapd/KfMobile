'use strict';
import {init as initConfig} from './module/config';
import * as Util from './module/util';
import Const from './module/const';
import * as Msg from './module/msg';
import * as Dialog from './module/dialog';
import * as Script from './module/script';
import * as Public from './module/public';
import * as Index from './module/index';
import * as Read from './module/read';
import * as Post from './module/post';
import * as Other from './module/other';
import * as ConfigDialog from './module/configDialog';

// 页面ID
window.pageId = $('body').attr('id');

/**
 * 导出模块
 */
const exportModule = function () {
    try {
        window.Util = require('./module/util');
        window.Const = require('./module/const').default;
        window.Msg = require('./module/msg');
        window.Dialog = require('./module/dialog');
        window.Script = require('./module/script');
        window.Public = require('./module/public');
        window.Index = require('./module/index');
        window.Read = require('./module/read');
        window.Post = require('./module/post');
        window.Other = require('./module/other');
        const Conf = require('./module/config');
        window.readConfig = Conf.read;
        window.writeConfig = Conf.write;
    }
    catch (ex) {
        console.log(ex);
    }
};

/**
 * 初始化
 */
const init = function () {
    if (pageId === 'loginPage') return;
    let startTime = new Date();
    exportModule();
    if (pageId === 'registerPage') {
        Other.handleRegisterPage();
        return;
    }
    initConfig();

    if (Config.customCssEnabled && Config.customCssContent) {
        $('head').append(`<style>${Config.customCssContent}</style>`);
    }
    if (Config.customScriptEnabled) {
        Script.runCustomScript('start');
    }

    Public.preventCloseWindow();
    Public.handleMainMenu();
    Public.handleMainMenuLink();
    if (Config.showSidebarBtnGroupEnabled) {
        Public.showSidebarBtnGroup();
    }
    Public.handleSidebarRollBtn();
    Public.handleSearchDialog();
    Public.fillCommonForumPanel();
    Public.showEditCommonForumDialog();
    if ($('.page-input').length > 0) {
        Public.handlePageInput();
    }
    Public.bindFastSubmitShortcutKey();

    if (pageId === 'indexPage') {
        Index.handleAtTipsBtn();
        Index.handleIndexThreadPanel();
        Index.handleSelectBg();
    }
    else if (pageId === 'readPage') {
        Read.gotoFloor();
        if (Config.threadContentFontSize > 0) {
            $('head').append(`<style>.read-content { font-size: ${Config.threadContentFontSize}px; }</style>`);
        }
        Read.handleFastGotoFloorBtn();
        Read.handleTuiThreadBtn();
        Read.handleCopyFloorLinkBtn();
        Read.handleFastReplyBtn();
        Read.handleGoodPostBtn();
        Read.handleBlockFloorBtn();
        Read.handleBuyThreadBtn();
        Read.copyBuyThreadList();
        Read.replaceAttachLabel();
        Read.handleFloorImage();
        Post.checkPostForm();
        Read.handleCopyCodeBtn();
        Post.addSmileCode($('#postContent'));
        Post.addRedundantKeywordWarning();
        Read.bindMultiQuoteCheckClick();
        Post.handleClearMultiQuoteDataBtn();
        Read.handleMoveThreadBtn();
        $('.multi-reply-btn').click(() => Post.handleMultiQuote(1));
        if (Config.userMemoEnabled) {
            Read.addUserMemo();
        }
        Script.handleInstallScriptLink();
    }
    else if (pageId === 'postPage') {
        Post.addRedundantKeywordWarning();
        Post.checkPostForm();
        Post.handleEditorBtns();
        Post.addSmileCode($('#postContent'));
        Post.handleAttachBtns();
        Post.handleClearMultiQuoteDataBtn();
        if (Info.multiQuote) Post.handleMultiQuote(2);
        $('#postTitleFormatArea').on('change', '[type="text"], [type="checkbox"]', () => Post.specialPostTitleChange());
    }
    else if (pageId === 'gjcPage') {
        Other.highlightUnReadAtTipsMsg();
    }
    else if (pageId === 'userPage') {
        Other.handleUserPageBtns();
        Other.handleProfilePage();
    }
    else if (pageId === 'gameIntroSearchPage') {
        Other.handleGameIntroSearchArea();
    }
    else if (['gameIntroPage', 'gameIntroCompanyPage', 'gameIntroTypePage', 'gameIntroPropertyPage'].includes(pageId)) {
        Other.tuiGame();
    }
    else if (pageId === 'favorPage') {
        Other.bindFavorPageBtnsClick();
    }
    else if (pageId === 'friendPage') {
        Other.bindFriendPageBtnsClick();
    }
    else if (pageId === 'modifyPage') {
        Other.syncPerPageFloorNum();
        Other.assignBirthdayField();
        Other.handleUploadAvatarFileBtn();
    }
    else if (pageId === 'bankPage') {
        Other.transferKfbAlert();
    }
    else if (pageId === 'messagePage') {
        Other.bindMessageActionBtnsClick();
    }
    else if (pageId === 'readMessagePage') {
        Read.handleFloorImage();
        Read.handleCopyCodeBtn();
    }
    else if (pageId === 'writeMessagePage') {
        Post.addSmileCode($('#msgContent'));
    }
    else if (pageId === 'selfRateRatingPage') {
        Other.showSelfRateErrorSizeSubmitWarning();
    }
    else if (pageId === 'haloPage') {
        $('#buyHaloBtns').on('click', 'a', function () {
            if (!confirm(`是否${$(this).text().trim()}提升一次战力光环？`)) return false;
            localStorage.removeItem('pd_tmp_log_' + Info.uid);
        });
    }
    else if (pageId === 'itemShopPage') {
        Other.handleBuyItemBtns();
        Other.showMyInfoInItemShop();
    }

    if (Config.blockUserEnabled) Public.blockUsers();
    if (Config.blockThreadEnabled) Public.blockThread();
    if (Config.followUserEnabled) Public.followUsers();
    if (Config.kfSmileEnhanceExtensionEnabled && ['readPage', 'postPage', 'writeMessagePage'].includes(pageId)) {
        $('body').append(
            `<script src="${Info.rootPath}${Info.staticPath}js/userScript/KfEmotion.min.user.js?ts=${Info.resTimestamp}"></script>`
        );
    }
    if(Config.adminMemberEnabled) {
        $('a[data-not-click="true"]').removeClass('not-click-link');
    }
    if (location.host.endsWith('.miaola.info')) {
        $('.change-domain-tips').show();
    }

    if (Config.customScriptEnabled) {
        Script.runCustomScript('end');
    }
    $('[data-toggle="tooltip"]').tooltip({'container': 'body'});
    console.log(`脚本加载完毕，耗时：${new Date() - startTime}ms`);
};

$(document).ready(init);
