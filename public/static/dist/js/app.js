(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _config = require('./module/config');

var _util = require('./module/util');

var Util = _interopRequireWildcard(_util);

var _const = require('./module/const');

var _const2 = _interopRequireDefault(_const);

var _msg = require('./module/msg');

var Msg = _interopRequireWildcard(_msg);

var _dialog = require('./module/dialog');

var Dialog = _interopRequireWildcard(_dialog);

var _script = require('./module/script');

var Script = _interopRequireWildcard(_script);

var _public = require('./module/public');

var Public = _interopRequireWildcard(_public);

var _index = require('./module/index');

var Index = _interopRequireWildcard(_index);

var _read = require('./module/read');

var Read = _interopRequireWildcard(_read);

var _post = require('./module/post');

var Post = _interopRequireWildcard(_post);

var _other = require('./module/other');

var Other = _interopRequireWildcard(_other);

var _configDialog = require('./module/configDialog');

var ConfigDialog = _interopRequireWildcard(_configDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 页面ID
window.pageId = $('body').attr('id');

/**
 * 导出模块
 */
var exportModule = function exportModule() {
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
        var Conf = require('./module/config');
        window.readConfig = Conf.read;
        window.writeConfig = Conf.write;
    } catch (ex) {
        console.log(ex);
    }
};

/**
 * 初始化
 */
var init = function init() {
    if (pageId === 'loginPage') return;
    var startTime = new Date();
    exportModule();
    if (pageId === 'registerPage') {
        Other.handleRegisterPage();
        return;
    }
    (0, _config.init)();

    if (Config.customCssEnabled && Config.customCssContent) {
        $('head').append('<style>' + Config.customCssContent + '</style>');
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
    } else if (pageId === 'readPage') {
        Read.gotoFloor();
        if (Config.threadContentFontSize > 0) {
            $('head').append('<style>.read-content { font-size: ' + Config.threadContentFontSize + 'px; }</style>');
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
        $('.multi-reply-btn').click(function () {
            return Post.handleMultiQuote(1);
        });
        if (Config.userMemoEnabled) {
            Read.addUserMemo();
        }
        Script.handleInstallScriptLink();
    } else if (pageId === 'postPage') {
        Post.addRedundantKeywordWarning();
        Post.checkPostForm();
        Post.handleEditorBtns();
        Post.addSmileCode($('#postContent'));
        Post.handleAttachBtns();
        Post.handleClearMultiQuoteDataBtn();
        if (Info.multiQuote) Post.handleMultiQuote(2);
        $('#postTitleFormatArea').on('change', '[type="text"], [type="checkbox"]', function () {
            return Post.specialPostTitleChange();
        });
    } else if (pageId === 'gjcPage') {
        Other.highlightUnReadAtTipsMsg();
    } else if (pageId === 'userPage') {
        Other.handleUserPageBtns();
        Other.handleProfilePage();
    } else if (pageId === 'gameIntroSearchPage') {
        Other.handleGameIntroSearchArea();
    } else if (['gameIntroPage', 'gameIntroCompanyPage', 'gameIntroTypePage', 'gameIntroPropertyPage'].includes(pageId)) {
        Other.tuiGame();
    } else if (pageId === 'favorPage') {
        Other.bindFavorPageBtnsClick();
    } else if (pageId === 'friendPage') {
        Other.bindFriendPageBtnsClick();
    } else if (pageId === 'modifyPage') {
        Other.syncPerPageFloorNum();
        Other.assignBirthdayField();
        Other.handleUploadAvatarFileBtn();
    } else if (pageId === 'bankPage') {
        Other.transferKfbAlert();
    } else if (pageId === 'messagePage') {
        Other.bindMessageActionBtnsClick();
    } else if (pageId === 'readMessagePage') {
        Read.handleFloorImage();
        Read.handleCopyCodeBtn();
    } else if (pageId === 'writeMessagePage') {
        Post.addSmileCode($('#msgContent'));
    } else if (pageId === 'selfRateRatingPage') {
        Other.showSelfRateErrorSizeSubmitWarning();
    } else if (pageId === 'haloPage') {
        $('#buyHaloBtns').on('click', 'a', function () {
            if (!confirm('\u662F\u5426' + $(this).text().trim() + '\u63D0\u5347\u4E00\u6B21\u6218\u529B\u5149\u73AF\uFF1F')) return false;
            localStorage.removeItem('pd_tmp_log_' + Info.uid);
        });
    } else if (pageId === 'itemShopPage') {
        Other.handleBuyItemBtns();
        Other.showMyInfoInItemShop();
    }

    if (Config.blockUserEnabled) Public.blockUsers();
    if (Config.blockThreadEnabled) Public.blockThread();
    if (Config.followUserEnabled) Public.followUsers();
    if (Config.kfSmileEnhanceExtensionEnabled && ['readPage', 'postPage', 'writeMessagePage'].includes(pageId)) {
        $('body').append('<script src="' + Info.rootPath + Info.staticPath + 'js/userScript/KfEmotion.min.user.js?ts=' + Info.resTimestamp + '"></script>');
    }
    if (Config.adminMemberEnabled) {
        $('a[data-not-click="true"]').removeClass('not-click-link');
    }
    if (location.host.endsWith('.miaola.info')) {
        $('.change-domain-tips').show();
    }

    if (Config.customScriptEnabled) {
        Script.runCustomScript('end');
    }
    $('[data-toggle="tooltip"]').tooltip({ 'container': 'body' });
    console.log('\u811A\u672C\u52A0\u8F7D\u5B8C\u6BD5\uFF0C\u8017\u65F6\uFF1A' + (new Date() - startTime) + 'ms');
};

$(document).ready(init);

},{"./module/config":2,"./module/configDialog":3,"./module/const":4,"./module/dialog":5,"./module/index":6,"./module/msg":7,"./module/other":8,"./module/post":9,"./module/public":10,"./module/read":11,"./module/script":12,"./module/util":13}],2:[function(require,module,exports){
/* 配置模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalize = exports.clear = exports.write = exports.read = exports.init = exports.Config = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 配置名称
var name = 'kf_config';

/**
 * 配置类
 */
var Config = exports.Config = {
    // 当前激活的最新回复面板
    activeNewReplyPanel: '#newReplyPanel1',
    // 当前激活的最新发表面板
    activeNewPublishPanel: '#newPublishPanel1',
    // 当前激活的其它帖子面板
    activeNewExtraPanel: '#newExtraPanel1',
    // 常用版块列表
    commonForumList: [],

    // 是否显示侧边栏按钮组，true：开启；false：关闭
    showSidebarBtnGroupEnabled: true,
    // 是否显示侧边栏的滚动到页顶/页底按钮，true：开启；false：关闭
    showSidebarRollBtnEnabled: true,
    // 是否显示侧边栏的主菜单按钮，true：开启；false：关闭
    showSidebarMainMenuBtnEnabled: false,
    // 是否显示侧边栏的版块列表按钮，true：开启；false：关闭
    showSidebarForumListBtnEnabled: true,
    // 是否显示侧边栏的搜索按钮，true：开启；false：关闭
    showSidebarSearchBtnEnabled: false,
    // 是否显示侧边栏的首页按钮，true：开启；false：关闭
    showSidebarHomePageBtnEnabled: true,

    // 主题每页楼层数量，用于电梯直达等功能，如果修改了论坛设置里的“文章列表每页个数”，请在此修改成相同的数目
    perPageFloorNum: 10,
    // 主题内容字体大小，设为0表示使用默认大小，默认值：14px
    threadContentFontSize: 0,
    // 是否在楼层内的用户名旁显示该用户的自定义备注，true：开启；false：关闭
    userMemoEnabled: false,
    // 用户自定义备注列表，格式：{'用户名':'备注'}，例：{'李四':'张三的马甲','王五':'张三的另一个马甲'}
    userMemoList: {},
    // 是否在发帖框上显示绯月表情增强插件，true：开启；false：关闭
    kfSmileEnhanceExtensionEnabled: false,

    // 默认的消息显示时间（秒），设置为-1表示永久显示
    defShowMsgDuration: -1,
    // 是否为页面添加自定义的CSS内容，true：开启；false：关闭
    customCssEnabled: false,
    // 自定义CSS的内容
    customCssContent: '',
    // 是否执行自定义的脚本，true：开启；false：关闭
    customScriptEnabled: false,
    // 自定义脚本列表
    customScriptList: [],
    // 是否为管理成员，true：开启；false：关闭
    adminMemberEnabled: false,

    // 是否开启关注用户的功能，true：开启；false：关闭
    followUserEnabled: false,
    // 关注用户列表，格式：[{name:'用户名'}]，例：[{name:'张三'}, {name:'李四'}]
    followUserList: [],
    // 是否高亮所关注用户在首页下的主题链接，true：开启；false：关闭
    highlightFollowUserThreadInHPEnabled: true,
    // 是否高亮所关注用户在主题列表页面下的主题链接，true：开启；false：关闭
    highlightFollowUserThreadLinkEnabled: true,
    // 是否开启屏蔽用户的功能，true：开启；false：关闭
    blockUserEnabled: false,
    // 屏蔽用户的默认屏蔽类型，0：屏蔽主题和回贴；1：仅屏蔽主题；2：仅屏蔽回贴
    blockUserDefaultType: 0,
    // 是否屏蔽被屏蔽用户的@提醒，true：开启；false：关闭
    blockUserAtTipsEnabled: true,
    // 屏蔽用户的版块屏蔽范围，0：所有版块；1：包括指定的版块；2：排除指定的版块
    blockUserForumType: 0,
    // 屏蔽用户的版块ID列表，例：[16, 41, 67, 57, 84, 92, 127, 68, 163, 182, 9]
    blockUserFidList: [],
    // 屏蔽用户列表，格式：[{name:'用户名', type:屏蔽类型}]，例：[{name:'张三', type:0}, {name:'李四', type:1}]
    blockUserList: [],
    // 是否开启屏蔽标题包含指定关键字的主题的功能，true：开启；false：关闭
    blockThreadEnabled: false,
    // 屏蔽主题的默认版块屏蔽范围，0：所有版块；1：包括指定的版块；2：排除指定的版块
    blockThreadDefForumType: 0,
    // 屏蔽主题的默认版块ID列表，例：[16, 41, 67, 57, 84, 92, 127, 68, 163, 182, 9]
    blockThreadDefFidList: [],
    // 屏蔽主题的关键字列表，格式：[{keyWord:'关键字', includeUser:['包括的用户名'], excludeUser:['排除的用户名'], includeFid:[包括指定的版块ID], excludeFid:[排除指定的版块ID]}]
    // 关键字可使用普通字符串或正则表达式（正则表达式请使用'/abc/'的格式），includeUser、excludeUser、includeFid和excludeFid这三项为可选
    // 例：[{keyWord: '标题1'}, {keyWord: '标题2', includeUser:['用户名1', '用户名2'], includeFid: [5, 56]}, {keyWord: '/关键字A.*关键字B/i', excludeFid: [92, 127, 68]}]
    blockThreadList: []
};

/**
 * 初始化
 */
var init = exports.init = function init() {
    window.Config = $.extend(true, {}, Config);
    read();
};

/**
 * 读取设置
 */
var read = exports.read = function read() {
    var options = localStorage[name];
    if (!options) return;
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return;
    }
    if (!options || $.type(options) !== 'object' || $.isEmptyObject(options)) return;
    options = normalize(options);
    window.Config = $.extend(true, {}, Config, options);
};

/**
 * 写入设置
 */
var write = exports.write = function write() {
    var options = Util.getDifferenceSetOfObject(Config, window.Config);
    localStorage[name] = JSON.stringify(options);
};

/**
 * 清空设置
 */
var clear = exports.clear = function clear() {
    localStorage.removeItem(name);
};

/**
 * 获取经过规范化的Config对象
 * @param {{}} options 待处理的Config对象
 * @returns {{}} 经过规范化的Config对象
 */
var normalize = exports.normalize = function normalize(options) {
    var settings = {};
    if ($.type(options) !== 'object') return settings;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(options)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if (key in Config && $.type(value) === $.type(Config[key])) {
                settings[key] = value;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return settings;
};

},{"./util":13}],3:[function(require,module,exports){
/* 设置对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.show = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _dialog = require('./dialog');

var Dialog = _interopRequireWildcard(_dialog);

var _config = require('./config');

var _script = require('./script');

var Script = _interopRequireWildcard(_script);

var _public = require('./public');

var Public = _interopRequireWildcard(_public);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 显示设置对话框
 */
var show = exports.show = function show() {
    var dialogName = 'configDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _config.read)();
    var bodyContent = '\n<div class="btn-group-sm text-right mb-1">\n  <a class="btn btn-link text-danger" data-name="clearTmpData" href="#">\u6E05\u9664\u4E34\u65F6\u6570\u636E</a>\n  <a class="btn btn-link" data-name="openRunCommandDialog" href="#">\u8FD0\u884C\u547D\u4EE4</a>\n</div>\n<fieldset class="fieldset mb-3 py-2">\n  <legend class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_showSidebarBtnGroupEnabled" name="showSidebarBtnGroupEnabled" type="checkbox">\n    <label class="form-check-label" for="' + dialogName + '_showSidebarBtnGroupEnabled">\u663E\u793A\u4FA7\u8FB9\u680F\u6309\u94AE\u7EC4</label>\n    <span class="tips" data-toggle="tooltip" title="\u663E\u793A\u4FA7\u8FB9\u680F\u6309\u94AE\u7EC4\uFF0C\u53EF\u5728\u4E0B\u65B9\u8BBE\u7F6E\u8981\u663E\u793A\u7684\u6309\u94AE">[?]</span>\n  </legend>\n  \n  <div class="mb-2 d-sm-inline-block">\n    <div class="form-check form-check-inline">\n      <input class="form-check-input" id="' + dialogName + '_showSidebarRollBtnEnabled" name="showSidebarRollBtnEnabled" type="checkbox">\n      <label class="form-check-label" for="' + dialogName + '_showSidebarRollBtnEnabled">\u6EDA\u52A8\u5230\u9875\u9876/\u9875\u5E95</label>\n    </div>\n    <div class="form-check form-check-inline">\n      <input class="form-check-input" id="' + dialogName + '_showSidebarMainMenuBtnEnabled" name="showSidebarMainMenuBtnEnabled" type="checkbox">\n      <label class="form-check-label" for="' + dialogName + '_showSidebarMainMenuBtnEnabled">\u4E3B\u83DC\u5355</label>\n    </div>\n  </div>\n  \n  <div class="mb-2 d-sm-inline-block">\n    <div class="form-check form-check-inline">\n      <input class="form-check-input" id="' + dialogName + '_showSidebarForumListBtnEnabled" name="showSidebarForumListBtnEnabled" type="checkbox">\n      <label class="form-check-label" for="' + dialogName + '_showSidebarForumListBtnEnabled">\u7248\u5757\u5217\u8868</label>\n    </div>\n    <div class="form-check form-check-inline">\n      <input class="form-check-input" id="' + dialogName + '_showSidebarSearchBtnEnabled" name="showSidebarSearchBtnEnabled" type="checkbox">\n      <label class="form-check-label" for="' + dialogName + '_showSidebarSearchBtnEnabled">\u641C\u7D22</label>\n    </div>\n    <div class="form-check form-check-inline">\n      <input class="form-check-input" id="' + dialogName + '_showSidebarHomePageBtnEnabled" name="showSidebarHomePageBtnEnabled" type="checkbox">\n      <label class="form-check-label" for="' + dialogName + '_showSidebarHomePageBtnEnabled">\u9996\u9875</label>\n    </div>\n  </div>\n</fieldset>\n\n<fieldset class="fieldset mb-3 py-2">\n  <legend>\u4E3B\u9898\u9875\u9762\u76F8\u5173</legend>\n  \n  <div class="form-group mb-2">\n    <label for="perPageFloorNum">\u4E3B\u9898\u6BCF\u9875\u697C\u5C42\u6570\u91CF</label>\n    <select class="custom-select custom-select-sm w-auto" id="perPageFloorNum" name="perPageFloorNum">\n      <option value="10">10</option><option value="20">20</option><option value="30">30</option>\n    </select>\n    <span class="tips" data-toggle="tooltip" title="\u4E3B\u9898\u9875\u9762\u4E2D\u6BCF\u9875\u7684\u697C\u5C42\u6570\u91CF\uFF08\u7528\u4E8E\u7535\u68AF\u76F4\u8FBE\u7B49\u529F\u80FD\uFF09\uFF0C\u5982\u679C\u4FEE\u6539\u4E86\u8BBA\u575B\u8BBE\u7F6E\u91CC\u7684\u201C\u6587\u7AE0\u5217\u8868\u6BCF\u9875\u4E2A\u6570\u201D\uFF0C\u8BF7\u5728\u6B64\u4FEE\u6539\u6210\u76F8\u540C\u7684\u6570\u76EE">[?]</span>\n  </div>\n  \n  <div class="input-group mb-2">\n    <div class="input-group-prepend">\n      <span class="input-group-text">\u4E3B\u9898\u5185\u5BB9\u5B57\u4F53\u5927\u5C0F</span>\n    </div>\n    <input class="form-control" name="threadContentFontSize" data-toggle="tooltip" type="number" min="8" max="72"\n           title="\u4E3B\u9898\u5185\u5BB9\u5B57\u4F53\u5927\u5C0F\uFF0C\u7559\u7A7A\u8868\u793A\u4F7F\u7528\u9ED8\u8BA4\u5927\u5C0F\uFF0C\u9ED8\u8BA4\u503C\uFF1A14px">\n    <div class="input-group-append">\n      <span class="input-group-text">px</span>\n    </div>\n  </div>\n  \n  <div class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_userMemoEnabled" name="userMemoEnabled" type="checkbox" data-disabled="[data-name=openUserMemoDialog]">\n    <label class="form-check-label" for="' + dialogName + '_userMemoEnabled">\u663E\u793A\u7528\u6237\u5907\u6CE8</label>\n    <span class="tips" data-toggle="tooltip" title="\u5728\u697C\u5C42\u5185\u7684\u7528\u6237\u540D\u65C1\u663E\u793A\u8BE5\u7528\u6237\u7684\u81EA\u5B9A\u4E49\u5907\u6CE8">[?]</span>\n    <a class="ml-3" data-name="openUserMemoDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>\n  </div>\n  \n  <div class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_kfSmileEnhanceExtensionEnabled" name="kfSmileEnhanceExtensionEnabled" type="checkbox">\n    <label class="form-check-label" for="' + dialogName + '_kfSmileEnhanceExtensionEnabled">\u5F00\u542F\u7EEF\u6708\u8868\u60C5\u589E\u5F3A\u63D2\u4EF6</label>\n    <span class="tips" data-toggle="tooltip" title="\u5728\u53D1\u5E16\u6846\u4E0A\u663E\u793A\u7EEF\u6708\u8868\u60C5\u589E\u5F3A\u63D2\u4EF6\uFF0C\u8BE5\u63D2\u4EF6\u7531eddie32\u5F00\u53D1">[?]</span>\n  </div>\n</fieldset>\n\n<fieldset class="fieldset mb-3 py-2">\n  <legend>\u5176\u5B83\u8BBE\u7F6E</legend>\n  \n  <div class="input-group mb-2">\n    <div class="input-group-prepend">\n      <span class="input-group-text">\u6D88\u606F\u663E\u793A\u65F6\u95F4</span>\n    </div>\n    <input class="form-control" name="defShowMsgDuration" data-toggle="tooltip" type="number" min="-1" required\n           title="\u9ED8\u8BA4\u7684\u6D88\u606F\u663E\u793A\u65F6\u95F4\uFF08\u79D2\uFF09\uFF0C\u8BBE\u7F6E\u4E3A-1\u8868\u793A\u6C38\u4E45\u663E\u793A\uFF0C\u4F8B\uFF1A15">\n    <div class="input-group-append">\n      <span class="input-group-text">\u79D2</span>\n    </div>\n  </div>\n  \n  <div class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_customCssEnabled" name="customCssEnabled" type="checkbox" data-disabled="[data-name=openCustomCssDialog]">\n    <label class="form-check-label" for="' + dialogName + '_customCssEnabled">\u6DFB\u52A0\u81EA\u5B9A\u4E49CSS</label>\n    <span class="tips" data-toggle="tooltip" title="\u4E3A\u9875\u9762\u6DFB\u52A0\u81EA\u5B9A\u4E49\u7684CSS\u5185\u5BB9\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u586B\u5199\u81EA\u5B9A\u4E49\u7684CSS\u5185\u5BB9">[?]</span>\n    <a class="ml-3" data-name="openCustomCssDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>\n  </div>\n  \n  <div class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_customScriptEnabled" name="customScriptEnabled" type="checkbox" data-disabled="[data-name=openCustomScriptDialog]">\n    <label class="form-check-label" for="' + dialogName + '_customScriptEnabled">\u6267\u884C\u81EA\u5B9A\u4E49\u811A\u672C</label>\n    <span class="tips" data-toggle="tooltip" title="\u6267\u884C\u81EA\u5B9A\u4E49\u7684javascript\u811A\u672C\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u586B\u5165\u81EA\u5B9A\u4E49\u811A\u672C\u5185\u5BB9">[?]</span>\n    <a class="ml-3" data-name="openCustomScriptDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>\n  </div>\n  \n  <div class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_adminMemberEnabled" name="adminMemberEnabled" type="checkbox">\n    <label class="form-check-label" for="' + dialogName + '_adminMemberEnabled">\u6211\u662F\u7BA1\u7406\u6210\u5458</label>\n    <span class="tips" data-toggle="tooltip" title="\u7BA1\u7406\u6210\u5458\u53EF\u5F00\u542F\u6B64\u529F\u80FD\uFF0C\u52A9\u624B\u4F1A\u5F00\u542F\u90E8\u5206\u53EA\u6709\u7BA1\u7406\u6210\u5458\u624D\u80FD\u4F7F\u7528\u7684\u529F\u80FD\uFF0C\u975E\u7BA1\u7406\u6210\u5458\u5F00\u542F\u6B64\u529F\u80FD\u65E0\u6548">[?]</span>\n  </div>\n</fieldset>\n\n<fieldset class="fieldset mb-3 py-2">\n  <legend>\u5173\u6CE8\u548C\u5C4F\u853D</legend>\n  \n  <div class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_followUserEnabled" name="followUserEnabled" type="checkbox" data-disabled="[data-name=openFollowUserDialog]">\n    <label class="form-check-label" for="' + dialogName + '_followUserEnabled">\u5173\u6CE8\u7528\u6237</label>\n    <span class="tips" data-toggle="tooltip" title="\u5F00\u542F\u5173\u6CE8\u7528\u6237\u7684\u529F\u80FD\uFF0C\u6240\u5173\u6CE8\u7684\u7528\u6237\u5C06\u88AB\u52A0\u6CE8\u8BB0\u53F7\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5173\u6CE8\u7528\u6237">[?]</span>\n    <a class="ml-3" data-name="openFollowUserDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>\n  </div>\n  \n  <div class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_blockUserEnabled" name="blockUserEnabled" type="checkbox" data-disabled="[data-name=openBlockUserDialog]">\n    <label class="form-check-label" for="' + dialogName + '_blockUserEnabled">\u5C4F\u853D\u7528\u6237</label>\n    <span class="tips" data-toggle="tooltip" title="\u5F00\u542F\u5C4F\u853D\u7528\u6237\u7684\u529F\u80FD\uFF0C\u4F60\u5C06\u770B\u4E0D\u89C1\u6240\u5C4F\u853D\u7528\u6237\u7684\u53D1\u8A00\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5C4F\u853D\u7528\u6237">[?]</span>\n    <a class="ml-3" data-name="openBlockUserDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>\n  </div>\n  \n  <div class="form-check">\n    <input class="form-check-input" id="' + dialogName + '_blockThreadEnabled" name="blockThreadEnabled" type="checkbox" data-disabled="[data-name=openBlockThreadDialog]">\n    <label class="form-check-label" for="' + dialogName + '_blockThreadEnabled">\u5C4F\u853D\u4E3B\u9898</label>\n    <span class="tips" data-toggle="tooltip" title="\u5F00\u542F\u5C4F\u853D\u6807\u9898\u4E2D\u5305\u542B\u6307\u5B9A\u5173\u952E\u5B57\u7684\u4E3B\u9898\u7684\u529F\u80FD\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5C4F\u853D\u5173\u952E\u5B57">[?]</span>\n    <a class="ml-3" data-name="openBlockThreadDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>\n  </div>\n</fieldset>';
    var footerContent = '\n<button class="btn btn-warning mr-auto" name="openImportOrExportSettingDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>\n<button class="btn btn-danger" name="reset" type="button">\u91CD\u7F6E</button>';
    var $dialog = Dialog.create(dialogName, '助手设置', bodyContent, footerContent);

    $dialog.submit(function (e) {
        e.preventDefault();
        (0, _config.read)();
        var options = getMainConfigValue($dialog);
        options = (0, _config.normalize)(options);
        $.extend(Config, options);
        (0, _config.write)();
        Dialog.close(dialogName);
    }).on('click', 'a[data-name^="open"][href="#"]', function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass('disabled-link')) return;
        var name = $this.data('name');
        if (name === 'openRunCommandDialog') showRunCommandDialog();else if (name === 'openUserMemoDialog') showUserMemoDialog();else if (name === 'openCustomCssDialog') showCustomCssDialog();else if (name === 'openCustomScriptDialog') Script.showDialog();else if (name === 'openFollowUserDialog') showFollowUserDialog();else if (name === 'openBlockUserDialog') showBlockUserDialog();else if (name === 'openBlockThreadDialog') showBlockThreadDialog();
    }).find('[data-name="clearTmpData"]').click(function (e) {
        e.preventDefault();
        var type = prompt('可清除与助手有关的Cookies和本地临时数据（不包括助手设置和日志）\n请填写清除类型，0：全部清除；1：清除Cookies；2：清除本地临时数据', 0);
        if (type === null) return;
        type = parseInt(type);
        if (!isNaN(type) && type >= 0) {
            clearTmpData(type);
            alert('缓存已清除');
        }
    }).end().find('[name="reset"]').click(function () {
        if (confirm('是否重置所有设置？')) {
            (0, _config.clear)();
            alert('设置已重置');
            Dialog.close(dialogName);
            location.reload();
        }
    }).end().find('[name="openImportOrExportSettingDialog"]').click(showImportOrExportSettingDialog);

    setMainConfigValue($dialog);
    Dialog.show(dialogName);
};

/**
 * 设置主对话框中的字段值
 * @param {jQuery} $dialog 助手设置对话框对象
 */
var setMainConfigValue = function setMainConfigValue($dialog) {
    $dialog.find('input[name], select[name]').each(function () {
        var $this = $(this);
        var name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean') $this.prop('checked', Config[name] === true);else $this.val(Config[name]);
        }
    });
    $dialog.find('[name="threadContentFontSize"]').val(Config.threadContentFontSize > 0 ? Config.threadContentFontSize : '');
};

/**
 * 获取主对话框中字段值的Config对象
 * @param {jQuery} $dialog 助手设置对话框对象
 * @returns {{}} 字段值的Config对象
 */
var getMainConfigValue = function getMainConfigValue($dialog) {
    var options = {};
    $dialog.find('input[name], select[name]').each(function () {
        var $this = $(this);
        var name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean') options[name] = Boolean($this.prop('checked'));else if (typeof Config[name] === 'number') {
                options[name] = parseInt($this.val());
                if (name === 'threadContentFontSize' && isNaN(options[name])) options[name] = 0;
            } else options[name] = $.trim($this.val());
        }
    });
    return options;
};

/**
 * 清除临时数据
 * @param {number} type 清除类别，0：全部清除；1：清除Cookies；2：清除本地临时数据
 */
var clearTmpData = function clearTmpData() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (type === 0 || type === 1) {
        for (var key in _const2.default) {
            if (/CookieName$/.test(key)) {
                Util.deleteCookie(_const2.default[key]);
            }
        }
    }
    if (type === 0 || type === 2) {
        //TmpLog.clear();
        localStorage.removeItem(_const2.default.multiQuoteStorageName);
    }
};

/**
 * 显示运行命令对话框
 */
var showRunCommandDialog = function showRunCommandDialog() {
    var dialogName = 'runCommandDialog';
    if ($('#' + dialogName).length > 0) return;
    var bodyContent = '\n<p class="font-size-sm">\n  \u8FD0\u884C\u547D\u4EE4\u5FEB\u6377\u952E\uFF1A<kbd>Ctrl+Enter</kbd>\uFF1B\u6E05\u9664\u547D\u4EE4\u5FEB\u6377\u952E\uFF1A<kbd>Ctrl+\u9000\u683C\u952E</kbd>\n</p>\n<div class="form-group">\n  <label for="cfgCmd">\u547D\u4EE4\u5185\u5BB9\uFF1A</label>\n  <textarea class="form-control" name="cmd" id="cfgCmd" rows="6" wrap="off" aria-label="\u547D\u4EE4\u5185\u5BB9" style="white-space: pre;"></textarea>\n</div>\n<div class="form-group">\n  <label for="cfgResult">\u8FD0\u884C\u7ED3\u679C\uFF1A</label>\n  <textarea class="form-control font-size-sm" name="result" id="cfgResult" rows="6" wrap="off" aria-label="\u8FD0\u884C\u7ED3\u679C" style="white-space: pre;"></textarea>\n</div>';
    var footerContent = '\n<button class="btn btn-primary" type="submit">\u8FD0\u884C</button>\n<button class="btn btn-danger" name="clear" type="button">\u6E05\u9664</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u5173\u95ED</button>';
    var $dialog = Dialog.create(dialogName, '运行命令', bodyContent, footerContent);
    var $cmd = $dialog.find('[name="cmd"]');
    var $result = $dialog.find('[name="result"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        var content = $cmd.val();
        if (!$.trim(content)) return;

        var _Script$runCmd = Script.runCmd(content, true),
            response = _Script$runCmd.response;

        $result.val(response);
    }).end().find('[name="clear"]').click(function () {
        $cmd.val('').focus();
    });

    $cmd.keydown(function (e) {
        if (e.ctrlKey && e.keyCode === 13) {
            $dialog.submit();
        } else if (e.ctrlKey && e.keyCode === 8) {
            $dialog.find('[name="clear"]').click();
        }
    });

    Dialog.show(dialogName);
    $cmd.focus();
};

/**
 * 显示导入或导出设置对话框
 */
var showImportOrExportSettingDialog = function showImportOrExportSettingDialog() {
    var dialogName = 'imOrExSettingDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _config.read)();
    var bodyContent = '\n<p class="font-size-sm">\n  <b>\u5BFC\u5165\u8BBE\u7F6E\uFF1A</b>\u5C06\u8BBE\u7F6E\u5185\u5BB9\u7C98\u8D34\u5230\u6587\u672C\u6846\u4E2D\u5E76\u70B9\u51FB\u4FDD\u5B58\u6309\u94AE\u5373\u53EF<br>\n  <b>\u5BFC\u51FA\u8BBE\u7F6E\uFF1A</b>\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF<br>\n  <span class="text-danger">\u6CE8\uFF1A\u672C\u8BBE\u7F6E\u4E0E\u7535\u8111\u7248\u7684KFOL\u52A9\u624B\u5E76\u4E0D\u5B8C\u5168\u901A\u7528</span>\n</p>\n<div class="form-group">\n  <textarea class="form-control font-size-sm font-monospace" name="setting" rows="10" aria-label="\u8BBE\u7F6E\u5185\u5BB9" style="word-break: break-all;"></textarea>\n</div>';
    var footerContent = '\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>';
    var $dialog = Dialog.create(dialogName, '导入或导出设置', bodyContent, footerContent);

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        var options = $.trim($dialog.find('[name="setting"]').val());
        if (!options) return;
        try {
            options = JSON.parse(options);
        } catch (ex) {
            alert('设置有错误');
            return;
        }
        if (!options || $.type(options) !== 'object') {
            alert('设置有错误');
            return;
        }
        options = (0, _config.normalize)(options);
        window.Config = $.extend(true, {}, _config.Config, options);
        (0, _config.write)();
        alert('设置已导入');
        location.reload();
    });
    Dialog.show(dialogName);
    $dialog.find('[name="setting"]').val(JSON.stringify(Util.getDifferenceSetOfObject(_config.Config, Config))).select().focus();
};

/**
 * 显示用户备注对话框
 */
var showUserMemoDialog = function showUserMemoDialog() {
    var dialogName = 'userMemoDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _config.read)();
    var bodyContent = '\n<p class="font-size-sm">\u6309\u7167<code>\u7528\u6237\u540D:\u5907\u6CE8</code>\u7684\u683C\u5F0F\uFF08\u6CE8\u610F\u662F\u82F1\u6587\u5192\u53F7\uFF09\uFF0C\u6BCF\u884C\u4E00\u4E2A</p>\n<div class="form-group">\n  <textarea class="form-control" name="userMemoList" rows="13" wrap="off" aria-label="\u7528\u6237\u5907\u6CE8" style="white-space: pre;"></textarea>\n</div>';
    var footerContent = '\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>';
    var $dialog = Dialog.create(dialogName, '用户备注', bodyContent, footerContent);
    var $userMemoList = $dialog.find('[name="userMemoList"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        var content = $.trim($userMemoList.val());
        Config.userMemoList = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = content.split('\n')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var line = _step.value;

                line = $.trim(line);
                if (!line) continue;
                if (!/.+?:.+/.test(line)) {
                    alert('格式不正确');
                    $userMemoList.focus();
                    return;
                }

                var _line$split = line.split(':'),
                    _line$split2 = _slicedToArray(_line$split, 2),
                    user = _line$split2[0],
                    _line$split2$ = _line$split2[1],
                    memo = _line$split2$ === undefined ? '' : _line$split2$;

                if (!memo) continue;
                Config.userMemoList[user.trim()] = memo.trim();
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        (0, _config.write)();
        Dialog.close(dialogName);
    });

    var content = '';
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.entries(Config.userMemoList)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                user = _step2$value[0],
                memo = _step2$value[1];

            content += user + ':' + memo + '\n';
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    Dialog.show(dialogName);
    $userMemoList.val(content).focus();
};

/**
 * 显示自定义CSS对话框
 */
var showCustomCssDialog = function showCustomCssDialog() {
    var dialogName = 'customCssDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _config.read)();
    var bodyContent = '\n<div class="form-group">\n  <textarea class="form-control font-size-sm font-monospace" name="customCssContent" rows="15" wrap="off" aria-label="\u81EA\u5B9A\u4E49CSS\u5185\u5BB9" style="white-space: pre;"></textarea>\n</div>';
    var footerContent = '\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>';
    var $dialog = Dialog.create(dialogName, '自定义CSS', bodyContent, footerContent);
    var $content = $dialog.find('[name="customCssContent"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.customCssContent = $.trim($content.val());
        (0, _config.write)();
        Dialog.close(dialogName);
        alert('自定义CSS修改成功（需刷新页面后才可生效）');
    });
    Dialog.show(dialogName);
    $content.val(Config.customCssContent).focus();
};

/**
 * 显示关注用户对话框
 */
var showFollowUserDialog = function showFollowUserDialog() {
    var dialogName = 'followUserDialog';
    if ($('#' + dialogName).length > 0) return;
    var bodyContent = '\n<div class="form-check">\n  <input class="form-check-input" id="' + dialogName + '_highlightFollowUserThreadInHpEnabled" name="highlightFollowUserThreadInHpEnabled" type="checkbox">\n  <label class="form-check-label" for="' + dialogName + '_highlightFollowUserThreadInHpEnabled">\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u7684\u9996\u9875\u4E3B\u9898\u94FE\u63A5</label>\n  <span class="tips" data-toggle="tooltip" title="\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u5728\u9996\u9875\u4E0B\u7684\u4E3B\u9898\u94FE\u63A5">[?]</span>\n</div>\n<div class="form-check mb-3">\n  <input class="form-check-input" id="' + dialogName + '_highlightFollowUserThreadLinkEnabled" name="highlightFollowUserThreadLinkEnabled" type="checkbox">\n  <label class="form-check-label" for="' + dialogName + '_highlightFollowUserThreadLinkEnabled">\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u7684\u4E3B\u9898\u94FE\u63A5</label>\n  <span class="tips" data-toggle="tooltip" title="\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u5728\u7248\u5757\u9875\u9762\u4E0B\u7684\u4E3B\u9898\u94FE\u63A5">[?]</span>\n</div>\n<ul class="list-unstyled" id="followUserList"></ul>\n<div class="btn-group btn-group-sm mb-3" role="group">\n  <button class="btn btn-secondary" name="selectAll" type="button">\u5168\u9009</button>\n  <button class="btn btn-secondary" name="selectInverse" type="button">\u53CD\u9009</button>\n  <button class="btn btn-danger" name="deleteSelect" type="button">\u5220\u9664</button>\n</div>\n<div class="input-group mb-3">\n  <input class="form-control" name="addUser" data-toggle="tooltip" type="text" title="\u6DFB\u52A0\u591A\u4E2A\u7528\u6237\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694" aria-label="\u6DFB\u52A0\u5173\u6CE8\u7528\u6237">\n  <div class="input-group-append">\n    <button class="btn btn-success" name="add" type="button">\u6DFB\u52A0</button>\n  </div>\n</div>\n';
    var footerContent = '\n<button class="btn btn-warning mr-auto" name="openImOrExFollowUserListDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>';
    var $dialog = Dialog.create(dialogName, '关注用户', bodyContent, footerContent);
    var $followUserList = $dialog.find('#followUserList');

    /**
     * 添加关注用户
     * @param {string} name 用户名
     */
    var addFollowUser = function addFollowUser(name) {
        $('\n<li class="input-group input-group-sm mb-2">\n  <div class="input-group-prepend">\n    <div class="input-group-text">\n      <input type="checkbox" aria-label="\u9009\u62E9\u7528\u6237">\n    </div>\n  </div>\n  <input class="form-control" name="userName" type="text" value="' + name + '" maxlength="12" aria-label="\u7F16\u8F91\u5173\u6CE8\u7528\u6237">\n  <div class="input-group-append">\n    <button class="btn btn-danger" name="delete" type="button" aria-label="\u5220\u9664\u5173\u6CE8\u7528\u6237">\n      <i class="fa fa-trash" aria-hidden="true"></i>\n    </button>\n  </div>\n</li>\n').appendTo($followUserList);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.highlightFollowUserThreadInHPEnabled = $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked');
        Config.highlightFollowUserThreadLinkEnabled = $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked');
        Config.followUserList = [];
        $followUserList.find('li').each(function () {
            var $this = $(this);
            var name = $.trim($this.find('[name="userName"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                Config.followUserList.push({ name: name });
            }
        });
        (0, _config.write)();
        Dialog.close(dialogName);
    }).find('[name="deleteSelect"]').click(function () {
        var $checked = $followUserList.find('li:has([type="checkbox"]:checked)');
        if (!$checked.length) return;
        if (confirm('是否删除所选用户？')) $checked.remove();
    }).end().find('[name="addUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next().find('button').click();
        }
    }).end().find('[name="add"]').click(function () {
        var $addUser = $dialog.find('[name="addUser"]');
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = $.trim($addUser.val()).split(',')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var name = _step3.value;

                name = $.trim(name);
                if (!name) continue;
                if (Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) addFollowUser(name);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        $addUser.val('');
        $followUserList.find('li:last-child [type="checkbox"]').focus();
    }).end().find('[name="openImOrExFollowUserListDialog"]').click(function () {
        Public.showCommonImportOrExportConfigDialog('关注用户', 'followUserList');
    }).end().find('[name="selectAll"]').click(function () {
        return Util.selectAll($followUserList.find('[type="checkbox"]'));
    }).end().find('[name="selectInverse"]').click(function () {
        return Util.selectInverse($followUserList.find('[type="checkbox"]'));
    });

    $followUserList.on('click', '[name="delete"]', function () {
        $(this).closest('li').remove();
    });

    $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked', Config.highlightFollowUserThreadInHPEnabled);
    $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked', Config.highlightFollowUserThreadLinkEnabled);
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = Config.followUserList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var user = _step4.value;

            addFollowUser(user.name);
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    Dialog.show(dialogName);
};

/**
 * 显示屏蔽用户对话框
 */
var showBlockUserDialog = function showBlockUserDialog() {
    var dialogName = 'blockUserDialog';
    if ($('#' + dialogName).length > 0) return;
    var bodyContent = '\n<div class="form-group mb-2">\n  <label for="blockUserDefaultType">\u9ED8\u8BA4\u5C4F\u853D\u7C7B\u578B</label>\n  <select class="custom-select custom-select-sm w-auto" id="blockUserDefaultType" name="blockUserDefaultType">\n    <option value="0">\u4E3B\u9898\u548C\u56DE\u5E16</option><option value="1">\u4E3B\u9898</option><option value="2">\u56DE\u5E16</option>\n  </select>\n  <div class="form-check form-check-inline ml-3">\n    <input class="form-check-input" id="' + dialogName + '_blockUserAtTipsEnabled" name="blockUserAtTipsEnabled" type="checkbox">\n    <label class="form-check-label" for="' + dialogName + '_blockUserAtTipsEnabled">\u5C4F\u853D@\u63D0\u9192</label>\n    <span class="tips" data-toggle="tooltip" title="\u5C4F\u853D\u88AB\u5C4F\u853D\u7528\u6237\u7684@\u63D0\u9192">[?]</span>\n  </div>\n</div>\n<div class="form-group mb-2">\n  <label for="blockUserForumType">\u7248\u5757\u5C4F\u853D\u8303\u56F4</label>\n  <select class="custom-select custom-select-sm w-auto" id="blockUserForumType" name="blockUserForumType">\n    <option value="0">\u6240\u6709\u7248\u5757</option><option value="1">\u5305\u62EC\u6307\u5B9A\u7248\u5757</option><option value="2">\u6392\u9664\u6307\u5B9A\u7248\u5757</option>\n  </select>\n</div>\n<div class="form-group">\n  <label>\u7248\u5757ID\u5217\u8868</label>\n  <span class="tips" data-toggle="tooltip" title="\u7248\u5757URL\u4E2D\u7684fid\u53C2\u6570\uFF0C\u591A\u4E2AID\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694">[?]</span>\n  <input class="form-control form-control-sm" name="blockUserFidList" type="text">\n</div>\n<ul class="list-unstyled" id="blockUserList"></ul>\n<div class="btn-group btn-group-sm mb-3" role="group">\n  <button class="btn btn-secondary" name="selectAll" type="button">\u5168\u9009</button>\n  <button class="btn btn-secondary" name="selectInverse" type="button">\u53CD\u9009</button>\n  <div class="btn-group btn-group-sm dropup">\n    <button class="btn btn-info dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false">\n      \u4FEE\u6539\u4E3A\n    </button>\n    <div class="dropdown-menu" data-name="modifyMenu">\n      <a class="dropdown-item" data-value="0" href="#">\u4E3B\u9898\u548C\u56DE\u5E16</a>\n      <a class="dropdown-item" data-value="1" href="#">\u4E3B\u9898</a>\n      <a class="dropdown-item" data-value="2" href="#">\u56DE\u5E16</a>\n    </div>\n  </div>\n  <button class="btn btn-danger" name="deleteSelect" type="button">\u5220\u9664</button>\n</div>\n<div class="input-group mb-3">\n  <input class="form-control" name="addUser" data-toggle="tooltip" type="text" title="\u6DFB\u52A0\u591A\u4E2A\u7528\u6237\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694" aria-label="\u6DFB\u52A0\u5C4F\u853D\u7528\u6237">\n  <div class="input-group-append">\n    <button class="btn btn-success" name="add" type="button">\u6DFB\u52A0</button>\n  </div>\n</div>';
    var footerContent = '\n<button class="btn btn-warning mr-auto" name="openImOrExBlockUserListDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>';
    var $dialog = Dialog.create(dialogName, '屏蔽用户', bodyContent, footerContent);
    var $blockUserList = $dialog.find('#blockUserList');

    /**
     * 添加屏蔽用户
     * @param {string} name 用户名
     * @param {number} type 屏蔽类型
     */
    var addBlockUser = function addBlockUser(name, type) {
        $('\n<li class="form-group row no-gutters mb-2">\n  <div class="col-7 input-group input-group-sm">\n    <div class="input-group-prepend">\n      <div class="input-group-text">\n        <input type="checkbox" aria-label="\u9009\u62E9\u7528\u6237">\n      </div>\n    </div>\n    <input class="form-control" name="userName" type="text" value="' + name + '" maxlength="12" aria-label="\u7F16\u8F91\u5C4F\u853D\u7528\u6237">\n  </div>\n  <div class="col-5 input-group input-group-sm">\n    <select class="form-control" name="blockType">\n      <option value="0">\u4E3B\u9898\u548C\u56DE\u5E16</option><option value="1">\u4E3B\u9898</option><option value="2">\u56DE\u5E16</option>\n    </select>\n    <div class="input-group-append">\n      <button class="btn btn-danger" name="delete" type="button" aria-label="\u5220\u9664\u5C4F\u853D\u7528\u6237">\n        <i class="fa fa-trash" aria-hidden="true"></i>\n      </button>\n    </div>\n  </div>\n</li>\n').appendTo($blockUserList).find('[name="blockType"]').val(type);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.blockUserDefaultType = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        Config.blockUserAtTipsEnabled = $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked');
        Config.blockUserForumType = parseInt($dialog.find('[name="blockUserForumType"]').val());
        var blockUserFidList = new Set();
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = $.trim($dialog.find('[name="blockUserFidList"]').val()).split(',')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var fid = _step5.value;

                fid = parseInt(fid);
                if (!isNaN(fid) && fid > 0) blockUserFidList.add(fid);
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        Config.blockUserFidList = [].concat(_toConsumableArray(blockUserFidList));
        Config.blockUserList = [];
        $blockUserList.find('li').each(function () {
            var $this = $(this);
            var name = $.trim($this.find('[name="userName"]').val());
            if (name && Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                var type = parseInt($this.find('[name="blockType"]').val());
                Config.blockUserList.push({ name: name, type: type });
            }
        });
        (0, _config.write)();
        Dialog.close(dialogName);
    }).find('[data-name="modifyMenu"]').on('click', 'a', function (e) {
        e.preventDefault();
        var value = parseInt($(this).data('value'));
        $blockUserList.find('li:has([type="checkbox"]:checked) select').val(value);
    }).end().find('[name="deleteSelect"]').click(function () {
        var $checked = $blockUserList.find('li:has([type="checkbox"]:checked)');
        if (!$checked.length) return;
        if (confirm('是否删除所选用户？')) $checked.remove();
    }).end().find('[name="addUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next().find('button').click();
        }
    }).end().find('[name="add"]').click(function () {
        var $addUser = $dialog.find('[name="addUser"]');
        var type = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = $.trim($addUser.val()).split(',')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var name = _step6.value;

                name = $.trim(name);
                if (!name) continue;
                if (Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) addBlockUser(name, type);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        $addUser.val('');
        $blockUserList.find('li:last-child [type="checkbox"]').focus();
    }).end().find('[name="blockUserForumType"]').change(function () {
        $dialog.find('[name="blockUserFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('[name="openImOrExBlockUserListDialog"]').click(function () {
        Public.showCommonImportOrExportConfigDialog('屏蔽用户', 'blockUserList');
    }).end().find('[name="selectAll"]').click(function () {
        return Util.selectAll($blockUserList.find('[type="checkbox"]'));
    }).end().find('[name="selectInverse"]').click(function () {
        return Util.selectInverse($blockUserList.find('[type="checkbox"]'));
    });

    $blockUserList.on('click', '[name="delete"]', function () {
        $(this).closest('li').remove();
    });

    $dialog.find('[name="blockUserDefaultType"]').val(Config.blockUserDefaultType);
    $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked', Config.blockUserAtTipsEnabled);
    $dialog.find('[name="blockUserForumType"]').val(Config.blockUserForumType).triggerHandler('change');
    $dialog.find('[name="blockUserFidList"]').val(Config.blockUserFidList.join(','));
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = Config.blockUserList[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var user = _step7.value;

            addBlockUser(user.name, user.type);
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }

    Dialog.show(dialogName);
};

/**
 * 显示屏蔽主题对话框
 */
var showBlockThreadDialog = function showBlockThreadDialog() {
    var dialogName = 'blockThreadDialog';
    if ($('#' + dialogName).length > 0) return;
    var bodyContent = '\n<p class="font-size-sm">\n  \u6807\u9898\u5173\u952E\u5B57\u53EF\u4F7F\u7528\u666E\u901A\u5B57\u7B26\u4E32\u6216\u6B63\u5219\u8868\u8FBE\u5F0F\uFF0C\u6B63\u5219\u8868\u8FBE\u5F0F\u8BF7\u4F7F\u7528<code>/abc/</code>\u7684\u683C\u5F0F\uFF0C\u4F8B\uFF1A<code>/\u5173\u952E\u5B57A.*\u5173\u952E\u5B57B/i</code><br>\n  \u7528\u6237\u540D\u548C\u7248\u5757ID\u4E3A\u53EF\u9009\u9879\uFF08\u591A\u4E2A\u7528\u6237\u540D\u6216\u7248\u5757ID\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694\uFF09<br>\n</p>\n<div class="form-group mb-2">\n  <label for="blockThreadDefForumType">\u9ED8\u8BA4\u7248\u5757\u5C4F\u853D\u8303\u56F4</label>\n  <select class="custom-select custom-select-sm w-auto" id="blockThreadDefForumType" name="blockThreadDefForumType">\n    <option value="0">\u6240\u6709\u7248\u5757</option><option value="1">\u5305\u62EC\u6307\u5B9A\u7248\u5757</option><option value="2">\u6392\u9664\u6307\u5B9A\u7248\u5757</option>\n  </select>\n</div>\n<div class="form-group">\n  <label for="blockThreadDefFidList">\u9ED8\u8BA4\u7248\u5757ID\u5217\u8868</label>\n  <input class="form-control form-control-sm" id="blockThreadDefFidList" name="blockThreadDefFidList" type="text">\n</div>\n<div class="table-responsive">\n  <table class="table table-sm table-hover table-center text-nowrap">\n    <thead>\n      <tr>\n        <th>\u6807\u9898\u5173\u952E\u5B57(\u5FC5\u586B)</th>\n        <th>\u5C4F\u853D\u7528\u6237</th>\n        <th>\u7528\u6237\u540D</th>\n        <th>\u5C4F\u853D\u8303\u56F4</th>\n        <th>\u7248\u5757ID</th>\n        <th></th>\n      </tr>\n    </thead>\n    <tbody id="blockThreadList"></tbody>\n  </table>\n</div>\n<div class="btn-group btn-group-sm mb-3" role="group">\n  <button class="btn btn-success" name="add" type="button">\u589E\u52A0</button>\n  <button class="btn btn-danger" name="clear" type="button">\u6E05\u7A7A</button>\n</div>';
    var footerContent = '\n<button class="btn btn-warning mr-auto" name="openImOrExBlockThreadListDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>';
    var $dialog = Dialog.create(dialogName, '屏蔽主题', bodyContent, footerContent);
    var $blockThreadList = $dialog.find('#blockThreadList');

    /**
     * 添加屏蔽主题
     * @param {string} keyWord 标题关键字
     * @param {number} userType 屏蔽用户，0：所有；1：包括；2：排除
     * @param {string[]} userList 用户名
     * @param {number} fidType 屏蔽范围，0：所有；1：包括；2：排除
     * @param {number[]} fidList 版块ID列表
     */
    var addBlockThread = function addBlockThread(keyWord, userType, userList, fidType, fidList) {
        $('\n<tr>\n  <td>\n    <input class="form-control form-control-sm" name="keyWord" type="text" value="' + keyWord + '" aria-label="\u6807\u9898\u5173\u952E\u5B57" style="min-width: 12rem;">\n  </td>\n  <td>\n    <select class="form-control form-control-sm" name="userType" aria-label="\u5C4F\u853D\u7528\u6237\u7C7B\u578B" style="min-width: 4.5rem;">\n      <option value="0">\u6240\u6709</option><option value="1">\u5305\u62EC</option><option value="2">\u6392\u9664</option>\n    </select>\n  </td>\n  <td>\n    <input class="form-control form-control-sm" name="userList" type="text" value="' + userList.join(',') + '" aria-label="\u7528\u6237\u540D"\n           ' + (userType === 0 ? 'disabled' : '') + ' style="min-width: 12rem;">\n  </td>\n  <td>\n    <select class="form-control form-control-sm" name="fidType" aria-label="\u5C4F\u853D\u8303\u56F4" style="min-width: 4.5rem;">\n      <option value="0">\u6240\u6709</option><option value="1">\u5305\u62EC</option><option value="2">\u6392\u9664</option>\n    </select>\n  </td>\n  <td>\n    <input class="form-control form-control-sm" name="fidList" type="text" value="' + fidList.join(',') + '" aria-label="\u7248\u5757ID\u5217\u8868"\n           ' + (fidType === 0 ? 'disabled' : '') + ' style="min-width: 9rem;">\n  </td>\n  <td class="text-left">\n    <button class="btn btn-danger btn-sm" name="delete" type="button" aria-label="\u5220\u9664">\n      <i class="fa fa-trash" aria-hidden="true"></i>\n    </button>\n  </td>\n</tr>\n').appendTo($blockThreadList).find('[name="userType"]').val(userType).end().find('[name="fidType"]').val(fidType);
    };

    /**
     * 验证设置是否正确
     * @returns {boolean} 是否验证通过
     */
    var verify = function verify() {
        var flag = true;
        $blockThreadList.find('tr').each(function () {
            var $this = $(this);
            var $txtKeyWord = $this.find('[name="keyWord"]');
            var keyWord = $txtKeyWord.val();
            if (!$.trim(keyWord)) return;
            if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
                try {
                    eval(keyWord);
                } catch (ex) {
                    alert('正则表达式不正确');
                    $txtKeyWord.select().focus();
                    flag = false;
                    return false;
                }
            }
        });
        return flag;
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!verify()) return;
        Config.blockThreadDefForumType = parseInt($dialog.find('[name="blockThreadDefForumType"]').val());
        var blockThreadDefFidList = new Set();
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(',')[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var fid = _step8.value;

                fid = parseInt(fid);
                if (!isNaN(fid) && fid > 0) blockThreadDefFidList.add(fid);
            }
        } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                }
            } finally {
                if (_didIteratorError8) {
                    throw _iteratorError8;
                }
            }
        }

        Config.blockThreadDefFidList = [].concat(_toConsumableArray(blockThreadDefFidList));
        Config.blockThreadList = [];
        $blockThreadList.find('tr').each(function () {
            var $this = $(this);
            var keyWord = $this.find('[name="keyWord"]').val();
            if (!$.trim(keyWord)) return;
            var newObj = { keyWord: keyWord };

            var userType = parseInt($this.find('[name="userType"]').val());
            if (userType > 0) {
                var userList = new Set();
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = $.trim($this.find('[name="userList"]').val()).split(',')[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var user = _step9.value;

                        user = $.trim(user);
                        if (user) userList.add(user);
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }

                if (userList.size > 0) newObj[userType === 2 ? 'excludeUser' : 'includeUser'] = [].concat(_toConsumableArray(userList));
            }

            var fidType = parseInt($this.find('[name="fidType"]').val());
            if (fidType > 0) {
                var fidList = new Set();
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = $.trim($this.find('[name="fidList"]').val()).split(',')[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var fid = _step10.value;

                        fid = parseInt(fid);
                        if (!isNaN(fid) && fid > 0) fidList.add(fid);
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }

                if (fidList.size > 0) newObj[fidType === 2 ? 'excludeFid' : 'includeFid'] = [].concat(_toConsumableArray(fidList));
            }
            Config.blockThreadList.push(newObj);
        });
        (0, _config.write)();
        Dialog.close(dialogName);
    }).find('[name="clear"]').click(function () {
        if (confirm('是否清除所有屏蔽关键字？')) $blockThreadList.html('');
    }).end().find('[name="add"]').click(function () {
        addBlockThread('', 0, [], parseInt($dialog.find('[name="blockThreadDefForumType"]').val()), $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(','));
    }).end().find('[name="blockThreadDefForumType"]').change(function () {
        $dialog.find('[name="blockThreadDefFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('[name="openImOrExBlockThreadListDialog"]').click(function () {
        Public.showCommonImportOrExportConfigDialog('屏蔽主题', 'blockThreadList');
    }).end().find('[name="selectAll"]').click(function () {
        return Util.selectAll($blockThreadList.find('[type="checkbox"]'));
    }).end().find('[name="selectInverse"]').click(function () {
        return Util.selectInverse($blockThreadList.find('[type="checkbox"]'));
    });

    $blockThreadList.on('change', 'select', function () {
        var $this = $(this);
        $this.closest('td').next('td').find('input').prop('disabled', parseInt($this.val()) === 0);
    }).on('click', '[name="delete"]', function () {
        $(this).closest('tr').remove();
    });

    $dialog.find('[name="blockThreadDefForumType"]').val(Config.blockThreadDefForumType).triggerHandler('change');
    $dialog.find('[name="blockThreadDefFidList"]').val(Config.blockThreadDefFidList.join(','));
    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
        for (var _iterator11 = Config.blockThreadList[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var data = _step11.value;
            var keyWord = data.keyWord,
                includeUser = data.includeUser,
                excludeUser = data.excludeUser,
                includeFid = data.includeFid,
                excludeFid = data.excludeFid;

            var userType = 0;
            var userList = [];
            if (typeof includeUser !== 'undefined') {
                userType = 1;
                userList = includeUser;
            } else if (typeof excludeUser !== 'undefined') {
                userType = 2;
                userList = excludeUser;
            }

            var fidType = 0;
            var fidList = [];
            if (typeof includeFid !== 'undefined') {
                fidType = 1;
                fidList = includeFid;
            } else if (typeof excludeFid !== 'undefined') {
                fidType = 2;
                fidList = excludeFid;
            }
            addBlockThread(keyWord, userType, userList, fidType, fidList);
        }
    } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
            }
        } finally {
            if (_didIteratorError11) {
                throw _iteratorError11;
            }
        }
    }

    Dialog.show(dialogName);
};

},{"./config":2,"./const":4,"./dialog":5,"./public":10,"./script":12,"./util":13}],4:[function(require,module,exports){
/* 常量模块 */
'use strict';

// 通用存储数据名称前缀

Object.defineProperty(exports, "__esModule", {
    value: true
});
var storagePrefix = 'kf_';

/**
 * 常量类
 */
var Const = {
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
    commonForumList: [{ fid: 106, name: '新作动态' }, { fid: 41, name: '网盘下载' }, { fid: 16, name: 'BT下载' }, { fid: 52, name: '游戏讨论' }, { fid: 84, name: '动漫讨论' }, { fid: 67, name: 'CG下载' }, { fid: 5, name: '自由讨论' }, { fid: 56, name: '个人日记' }, { fid: 57, name: '同人漫本' }],
    // 可用版块列表
    availableForumList: [{ fid: 106, name: '新作动态' }, { fid: 52, name: '游戏讨论' }, { fid: 41, name: '网盘下载' }, { fid: 67, name: 'CG下载' }, { fid: 16, name: 'BT下载' }, { fid: 9, name: '无限资源' }, { fid: 102, name: '游戏推荐' }, { fid: 24, name: '疑难互助' }, { fid: 57, name: '同人漫本' }, { fid: 84, name: '动漫讨论' }, { fid: 92, name: '动画下载' }, { fid: 127, name: '漫画小说' }, { fid: 68, name: 'ACG音乐' }, { fid: 163, name: 'LIVE资源' }, { fid: 94, name: '原创绘画' }, { fid: 87, name: '实物交流' }, { fid: 86, name: '电子产品' }, { fid: 115, name: '文字作品' }, { fid: 96, name: '图片来源' }, { fid: 36, name: '寻求资源' }, { fid: 5, name: '自由讨论' }, { fid: 56, name: '个人日记' }, { fid: 4, name: '意见投诉' }, { fid: 93, name: '内部管理' }, { fid: 125, name: '水楼林立' }, { fid: 181, name: '私人日记' }, { fid: 98, name: '日本语版' }, { fid: 99, name: '意見箱' }, { fid: 112, name: '掲示板' }, { fid: 100, name: '創作感想' }]
};

exports.default = Const;

},{}],5:[function(require,module,exports){
/* 对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.close = exports.resize = exports.show = exports.create = undefined;

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 创建对话框
 * @param {string} id 对话框ID
 * @param {string} title 对话框标题
 * @param {string} bodyContent 对话框主体内容
 * @param {string} footerContent 对话框底部内容
 * @returns {jQuery} 对话框的jQuery对象
 */
var create = exports.create = function create(id, title, bodyContent) {
    var footerContent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    var html = '\n<form>\n<div class="dialog" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="' + id + 'Title">\n  <div class="container dialog-content" role="document">\n    <div class="dialog-header">\n      <h5 class="dialog-title" id="' + id + 'Title">' + title + '</h5>\n      <button class="close" data-dismiss="dialog" type="button" aria-label="\u5173\u95ED">\n        <span aria-hidden="true">&times;</span>\n      </button>\n    </div>\n    <div class="dialog-body">' + bodyContent + '</div>\n    <div class="dialog-footer" ' + (!footerContent ? 'hidden' : '') + '>' + footerContent + '</div>\n  </div>\n</div>\n</form>';
    var $dialog = $(html).appendTo('body');
    $dialog.on('click', '[data-dismiss="dialog"]', function () {
        return close(id);
    }).on('click', '.tips', function () {
        return false;
    }).on('click', '.disabled-link', function () {
        return false;
    }).on('click', '.dialog', function (e) {
        if ($(e.target).hasClass('dialog')) {
            close(id);
        }
    }).keydown(function (e) {
        if (e.keyCode === 27) {
            return close(id);
        }
    }).find('legend [type="checkbox"]').click(function () {
        var $this = $(this);
        var checked = $this.prop('checked');
        if (Util.isOpera() || Util.isEdge()) $this.closest('fieldset').find('input, select, textarea, button').not('legend input').prop('disabled', !checked);else $this.closest('fieldset').prop('disabled', !checked);
    }).end().find('input[data-disabled]').click(function () {
        var $this = $(this);
        var checked = $this.prop('checked');
        $($this.data('disabled')).each(function () {
            var $this = $(this);
            if ($this.is('a')) {
                if (checked) $this.removeClass('disabled-link');else $this.addClass('disabled-link');
            } else {
                $this.prop('disabled', !checked);
            }
        });
    }).end().find('[data-toggle="tooltip"]').tooltip({ 'container': 'body' });
    $(window).on('resize.' + id, function () {
        return resize(id);
    });
    return $dialog;
};

/**
 * 显示对话框
 * @param {string} id 对话框ID
 */
var show = exports.show = function show(id) {
    var $dialog = $('#' + id);
    if (!$dialog.length) return;
    $dialog.find('legend [type="checkbox"]').each(function () {
        $(this).triggerHandler('click');
    }).end().find('input[data-disabled]').each(function () {
        $(this).triggerHandler('click');
    });
    $dialog.fadeIn('normal').find('.close:first').focus();
    resize(id);
    $('body').addClass('modal-open');
};

/**
 * 调整对话框大小
 * @param {string} id 对话框ID
 */
var resize = exports.resize = function resize(id) {
    var $dialog = $('#' + id);
    $dialog.find('.dialog-body').css('max-height', $(window).height() - $dialog.find('.dialog-header').outerHeight() - $dialog.find('.dialog-footer').outerHeight());
};

/**
 * 关闭对话框
 * @param {string} id 对话框ID
 * @returns {boolean} 返回false
 */
var close = exports.close = function close(id) {
    $('#' + id).fadeOut('normal', function () {
        $(this).parent().remove();
        if (!$('.dialog').length) {
            $('body').removeClass('modal-open');
        }
    });
    $(window).off('resize.' + id);
    return false;
};

},{"./util":13}],6:[function(require,module,exports){
/* 首页模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleSelectBg = exports.handleIndexThreadPanel = exports.handleAtTipsBtn = undefined;

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 处理首页的@提醒按钮
 */
var handleAtTipsBtn = exports.handleAtTipsBtn = function handleAtTipsBtn() {
    $('#atTips').click(function () {
        var $this = $(this);
        var time = $this.data('time');
        var cookieValue = Util.getCookie(_const2.default.atTipsTimeCookieName);
        if (!time || time === cookieValue) return;
        if (!cookieValue) {
            var curDate = new Date().getDate().toString();
            Util.setCookie(_const2.default.prevAtTipsTimeCookieName, curDate.padStart(2, '0') + '日00时00分');
        } else if (cookieValue !== time) {
            Util.setCookie(_const2.default.prevAtTipsTimeCookieName, cookieValue);
        }
        Util.setCookie(_const2.default.atTipsTimeCookieName, time, Util.getDate('+' + _const2.default.atTipsTimeExpires + 'd'));
        $this.removeClass('btn-outline-danger').addClass('btn-outline-primary');
    });
};

/**
 * 处理首页主题链接面板
 */
var handleIndexThreadPanel = exports.handleIndexThreadPanel = function handleIndexThreadPanel() {
    // if (Config.activeNewReplyPanel) {
    //     $(`a[data-toggle="tab"][href="${Config.activeNewReplyPanel}"]:not(:contains("综合"))`).tab('show');
    // }
    // if (Config.activeNewPublishPanel) {
    //     $(`a[data-toggle="tab"][href="${Config.activeNewPublishPanel}"]:not(:contains("综合"))`).tab('show');
    // }
    if (Config.activeNewExtraPanel) {
        $('a[data-toggle="tab"][href="' + Config.activeNewExtraPanel + '"]').tab('show');
    }

    $(document).on('shown.bs.tab', '[data-toggle="tab"]', function (e) {
        var $target = $(e.target);
        var targetPanel = $target.attr('href');
        if (!targetPanel.includes('newExtraPanel')) return;
        var typeName = 'activeNewExtraPanel';
        // if (targetPanel.includes('newReplyPanel')) typeName = 'activeNewReplyPanel';
        // else if (targetPanel.includes('newPublishPanel')) typeName = 'activeNewPublishPanel';
        // else if (targetPanel.includes('newExtraPanel')) typeName = 'activeNewExtraPanel';
        if (typeName && Config[typeName] !== targetPanel) {
            (0, _config.read)();
            Config[typeName] = targetPanel;
            (0, _config.write)();
        }
    });
};

/**
 * 处理选择页面背景
 */
var handleSelectBg = exports.handleSelectBg = function handleSelectBg() {
    $('#selectBgImage').on('click', '[data-id]', function () {
        var $this = $(this);
        var id = $this.data('id');
        var fileName = $this.data('filename');
        var path = $this.parent().data('path');
        if (!id || !fileName || !path) return;
        if (confirm('是否选择此背景图片？')) {
            Util.setCookie(_const2.default.bgStyleCookieName, id, Util.getDate('+' + _const2.default.bgStyleExpires + 'd'), _const2.default.storagePrefix);
            $('body, .modal-content').css('background-image', 'url("' + path + fileName + '")');
            alert('背景已更换（图片可能需要一定时间加载）');
        }
    }).on('click', '[data-color]', function () {
        var $this = $(this);
        var color = $this.data('color');
        if (!color) return;
        if (confirm('是否选择此背景颜色？')) {
            Util.setCookie(_const2.default.bgStyleCookieName, color, Util.getDate('+' + _const2.default.bgStyleExpires + 'd'), _const2.default.storagePrefix);
            $('body, .modal-content').css('background', color);
            alert('背景已更换');
        }
    });

    $('#customBgStyle').click(function () {
        var value = Util.getCookie(_const2.default.bgStyleCookieName, _const2.default.storagePrefix);
        if (!value || parseInt(value)) value = '';
        value = prompt('请输入背景图片URL、颜色代码或CSS样式：\n（例：http://xxx.com/abc.jpg 或 #fcfcfc，留空表示恢复默认背景）\n' + '（注：建议选择简洁、不花哨、偏浅色系的背景图片或颜色）', value);
        if (value === null) return;
        var $bg = $('body, .modal-content, .dialog-content');
        if ($.trim(value) === '') {
            Util.deleteCookie(_const2.default.bgStyleCookieName, _const2.default.storagePrefix);
            alert('背景已恢复默认');
            location.reload();
        } else if (/^https?:\/\/[^"']+/.test(value)) {
            Util.setCookie(_const2.default.bgStyleCookieName, value, Util.getDate('+' + _const2.default.bgStyleExpires + 'd'), _const2.default.storagePrefix);
            $bg.css('background-image', 'url("' + value + '")');
            alert('背景已更换（图片可能需要一定时间加载）');
        } else if (/^#[0-9a-f]{6}$/i.test(value)) {
            Util.setCookie(_const2.default.bgStyleCookieName, value, Util.getDate('+' + _const2.default.bgStyleExpires + 'd'), _const2.default.storagePrefix);
            $bg.css('background', value.toLowerCase());
            alert('背景已更换');
        } else if (!/[<>{}]/.test(value)) {
            value = value.replace(';', '');
            Util.setCookie(_const2.default.bgStyleCookieName, value, Util.getDate('+' + _const2.default.bgStyleExpires + 'd'), _const2.default.storagePrefix);
            $bg.css('background', value);
            alert('背景已更换（图片可能需要一定时间加载）');
        } else {
            alert('格式不正确');
        }
    });
};

},{"./config":2,"./const":4,"./util":13}],7:[function(require,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});
var show = exports.show = function show(options, duration) {
    var settings = {
        msg: '',
        duration: Config.defShowMsgDuration,
        clickable: true,
        preventable: false
    };
    if ($.type(options) === 'object') {
        $.extend(settings, options);
    } else {
        settings.msg = options;
        settings.duration = typeof duration === 'undefined' ? Config.defShowMsgDuration : duration;
    }

    var $container = $('.msg-container');
    var isFirst = $container.length === 0;
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

    var $msg = $('<div class="msg">' + settings.msg + '</div>').appendTo($container);
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
        setTimeout(function () {
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
var wait = exports.wait = function wait(msg) {
    var preventable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    msg += '<i class="fa fa-spinner fa-spin fa-lg fa-fw ml-3" aria-label="等待中" aria-hidden="true"></i>';
    return show({ msg: msg, duration: -1, clickable: false, preventable: preventable });
};

/**
 * 隐藏指定消息框
 * @param {jQuery} $msg 消息框对象
 */
var hide = exports.hide = function hide($msg) {
    $msg.slideUp('normal', function () {
        remove($(this));
    });
};

/**
 * 移除指定消息框
 * @param {jQuery} $msg 消息框对象
 */
var remove = exports.remove = function remove($msg) {
    var $container = $msg.parent();
    $msg.remove();
    if (!$('.msg').length) {
        $container.remove();
        $('.mask').remove();
    } else if (!$('.msg[preventable]').length) {
        $('.mask').remove();
    }
};

/**
 * 销毁所有消息框
 */
var destroy = exports.destroy = function destroy() {
    $('.msg-container').remove();
    $('.mask').remove();
};

},{}],8:[function(require,module,exports){
/* 其它模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleBuyItemBtns = exports.showMyInfoInItemShop = exports.showSelfRateErrorSizeSubmitWarning = exports.handleProfilePage = exports.handleUserPageBtns = exports.handleRegisterPage = exports.bindMessageActionBtnsClick = exports.handleUploadAvatarFileBtn = exports.syncPerPageFloorNum = exports.assignBirthdayField = exports.bindFriendPageBtnsClick = exports.bindFavorPageBtnsClick = exports.tuiGame = exports.handleGameIntroSearchArea = exports.highlightUnReadAtTipsMsg = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 高亮关键词页面中未读的消息
 */
var highlightUnReadAtTipsMsg = exports.highlightUnReadAtTipsMsg = function highlightUnReadAtTipsMsg() {
    if (Info.gjc !== Info.userName) return;
    var timeString = Util.getCookie(_const2.default.prevAtTipsTimeCookieName);
    if (!timeString || !/^\d+日\d+时\d+分$/.test(timeString)) return;
    var prevString = '';
    $('.thread-list-item time').each(function (index) {
        var $this = $(this);
        var curString = $.trim($this.text());
        if (index === 0) prevString = curString;
        if (timeString < curString && prevString >= curString) {
            $this.addClass('text-danger');
            prevString = curString;
        } else return false;
    });

    $(document).on('click', '.thread-list-item .thread-link-item a', function () {
        Util.deleteCookie(_const2.default.prevAtTipsTimeCookieName);
    });
};

/**
 * 处理游戏搜索区域
 */
var handleGameIntroSearchArea = exports.handleGameIntroSearchArea = function handleGameIntroSearchArea() {
    $('#gameSearchKeyword').val(Info.keyword);
    $('#gameSearchType').val(Info.searchType);
};

/**
 * 推游戏
 */
var tuiGame = exports.tuiGame = function tuiGame() {
    $('.tui-btn').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.data('wait')) return;

        var type = $this.data('type');
        var cookieName = '';
        if (type === 'company') cookieName = 'g_intro_inc_tui_';else if (type === 'type') cookieName = 'g_intro_adv_tui_';else if (type === 'property') cookieName = 'g_intro_moe_tui_';else cookieName = 'g_intro_tui_';
        cookieName += Info.id;
        if (Util.getCookie(cookieName, '')) {
            alert('你在48小时内已经推过');
            return;
        }

        $this.data('wait', true);
        $.ajax({
            type: 'GET',
            url: $this.data('url'),
            success: function success() {
                var $num = $this.find('span:first');
                var num = parseInt($num.text());
                $num.text('+1');
                setTimeout(function () {
                    $num.text(++num);
                }, 1000);
            },
            error: function error() {
                alert('操作失败');
            },
            complete: function complete() {
                $this.removeData('wait');
            }
        });
    });
};

/**
 * 绑定收藏夹页面按钮点击事件
 */
var bindFavorPageBtnsClick = exports.bindFavorPageBtnsClick = function bindFavorPageBtnsClick() {
    var $form = $('form[name="favorForm"]');

    $(document).on('click', '.remove-catalog', function () {
        return confirm('是否删除该目录？');
    });

    $('#addCatalog').click(function (e) {
        e.preventDefault();
        var type = $.trim(prompt('请输入收藏夹目录名称：'));
        if (!type) return;
        $form.find('[name="job"]').val('addtype');
        $form.find('[name="type"]').val(type);
        $form.submit();
    });

    $('#favorActionBtns').on('click', 'button', function () {
        var action = $(this).data('action');
        if (action === 'selectAll') {
            Util.selectAll($('[name="delid[]"]'));
        } else if (action === 'selectInverse') {
            Util.selectInverse($('[name="delid[]"]'));
        } else if (action === 'delete') {
            var $checked = $('[name="delid[]"]:checked');
            if ($checked.length > 0 && confirm('\u662F\u5426\u5220\u9664\u8FD9' + $checked.length + '\u9879\uFF1F')) {
                $form.find('[name="job"]').val('clear');
                $form.submit();
            }
        }
    });

    $('#convertCatalogDropdownMenu').on('click', 'a', function (e) {
        e.preventDefault();
        var type = $(this).data('type');
        var $checked = $('[name="delid[]"]:checked');
        if ($checked.length > 0 && confirm('\u662F\u5426\u5C06\u8FD9' + $checked.length + '\u9879\u8F6C\u6362\u5230\u6307\u5B9A\u76EE\u5F55\uFF1F')) {
            $form.find('[name="job"]').val('change');
            $form.find('[name="type"]').val(type);
            $form.submit();
        }
    });
};

/**
 * 绑定好友列表页面按钮点击事件
 */
var bindFriendPageBtnsClick = exports.bindFriendPageBtnsClick = function bindFriendPageBtnsClick() {
    $('#friendActionBtns').on('click', '[type="button"]', function () {
        var action = $(this).data('action');
        if (action === 'selectAll') {
            Util.selectAll($('[name="selid[]"]'));
        } else if (action === 'selectInverse') {
            Util.selectInverse($('[name="selid[]"]'));
        }
    });
};

/**
 * 在账号设置页面里为生日字段赋值
 */
var assignBirthdayField = exports.assignBirthdayField = function assignBirthdayField() {
    $('#birthday').change(function () {
        var value = $(this).val().trim();
        var matches = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value);
        var year = '',
            month = '',
            day = '';
        if (matches) {
            year = parseInt(matches[1]);
            month = parseInt(matches[2]);
            day = parseInt(matches[3]);
        }
        $('[name="proyear"]').val(year);
        $('[name="promonth"]').val(month);
        $('[name="proday"]').val(day);
    });
};

/**
 * 同步主题每页楼层数量的设置
 */
var syncPerPageFloorNum = exports.syncPerPageFloorNum = function syncPerPageFloorNum() {
    /**
     * 同步设置
     */
    var syncConfig = function syncConfig() {
        var perPageFloorNum = parseInt($('[name="p_num"]').val());
        if (perPageFloorNum === 0) perPageFloorNum = 10;
        if (!isNaN(perPageFloorNum) && perPageFloorNum !== Config.perPageFloorNum) {
            Config.perPageFloorNum = perPageFloorNum;
            (0, _config.write)();
        }
    };

    syncConfig();
    $('#creator').submit(function () {
        (0, _config.read)();
        syncConfig();
    });
};

/**
 * 处理上传头像文件浏览按钮
 */
var handleUploadAvatarFileBtn = exports.handleUploadAvatarFileBtn = function handleUploadAvatarFileBtn() {
    $('#browseAvatar').change(function () {
        var $this = $(this);
        var matches = /\.(\w+)$/.exec($this.val());
        if (!matches || !['jpg', 'gif', 'png'].includes(matches[1].toLowerCase())) {
            alert('头像图片类型不匹配');
        }
    });
};

/**
 * 绑定短消息页面操作按钮点击事件
 */
var bindMessageActionBtnsClick = exports.bindMessageActionBtnsClick = function bindMessageActionBtnsClick() {
    $('#messageActionBtns').on('click', 'button', function () {
        var $form = $('#messageListForm');
        var name = $(this).attr('name');
        if (name === 'selectAll') {
            Util.selectAll($('[name="delid[]"]'));
        } else if (name === 'selectInverse') {
            Util.selectInverse($('[name="delid[]"]'));
        } else if (name === 'selectCustom') {
            var title = $.trim(prompt('请填写所要选择的包含指定字符串的短消息标题（可用|符号分隔多个标题）', '收到了他人转账的贡献|收到了他人转账的KFB|银行汇款通知|您的文章被评分|您的文章被删除'));
            if (!title) return;
            $('[name="delid[]"]').prop('checked', false);
            $('a.thread-link').each(function () {
                var $this = $(this);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = title.split('|')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var key = _step.value;

                        if ($this.text().toLowerCase().includes(key.toLowerCase())) {
                            $this.parent().find('[name="delid[]"]').prop('checked', true);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            });
        } else if (name === 'download') {
            var $checked = $('[name="delid[]"]:checked');
            if ($checked.length > 0 && confirm('\u662F\u5426\u4E0B\u8F7D\u8FD9' + $checked.length + '\u9879\uFF1F')) {
                $form.attr('action', '/message.php').find('[name="action"]').val('down');
                $form.submit();
            }
        } else if (name === 'delete') {
            var _$checked = $('[name="delid[]"]:checked');
            if (_$checked.length > 0 && confirm('\u662F\u5426\u5220\u9664\u8FD9' + _$checked.length + '\u9879\uFF1F')) {
                $form.attr('action', Util.makeUrl('message/job')).find('[name="action"]').val('del');
                $form.submit();
            }
        }
    });
};

/**
 * 处理注册页面
 */
var handleRegisterPage = exports.handleRegisterPage = function handleRegisterPage() {
    $(document).on('change', 'input[name]', function () {
        var $this = $(this);
        var name = $this.attr('name');
        var value = $this.val();
        if (!value) {
            Util.showValidationMsg($this, 'clear');
            return;
        }
        Util.showValidationMsg($('#response'), 'clear');
        if (name === 'regpwd') {
            if (value.length > 16 || value.length < 6) {
                Util.showValidationMsg($this, 'error', '密码长度不正确');
            } else {
                Util.showValidationMsg($this, 'clear');
                $('[name="regpwdrepeat"]').trigger('change');
            }
        } else if (name === 'regpwdrepeat') {
            if (value !== $('[name="regpwd"]').val()) Util.showValidationMsg($this, 'error', '两次输入的密码不相符');else Util.showValidationMsg($this, 'clear');
        }
    });

    $('#registerBtn').click(function () {
        var $this = $(this);
        var $form = $this.closest('form');
        if ($form.find('.has-danger').length > 0) {
            alert('请正确填写表单');
            return false;
        }

        var action = $this.data('action');
        if (action === 'check') {
            if (typeof window.namecheck !== 'function') return;
            if (!window.namecheck()) return;
            var $response = $('#response');
            $this.prop('disabled', true);
            Util.showValidationMsg($response, 'wait', '检查中，请稍等&hellip;');
            $.post(Util.makeUrl('register/check'), $('[name="checkForm"]').serialize(), function (_ref) {
                var type = _ref.type,
                    msg = _ref.msg;

                $this.prop('disabled', false);
                Util.showValidationMsg($response, type, msg);
                if (type === 'success') $this.data('action', 'register').find('span:last-child').text('注册');
            }).fail(function () {
                Util.showValidationMsg($response, 'error', '响应失败');
            });
        } else {
            $form.submit();
        }
    });
};

/**
 * 处理个人信息页面下的按钮
 */
var handleUserPageBtns = exports.handleUserPageBtns = function handleUserPageBtns() {
    var $area = $('#profileBtns');
    var userName = $area.data('username');
    $area.on('click', '[name="followUser"], [name="blockUser"]', function () {
        (0, _config.read)();
        var $this = $(this);
        var str = '关注';
        var userList = Config.followUserList;
        if ($this.attr('name') === 'blockUser') {
            str = '屏蔽';
            userList = Config.blockUserList;
            Config.blockUserEnabled = true;
        } else Config.followUserEnabled = true;
        if ($this.text().includes('取消')) {
            var index = Util.inFollowOrBlockUserList(userName, userList);
            if (index > -1) {
                userList.splice(index, 1);
                (0, _config.write)();
            }
            $this.removeClass('btn-outline-danger').addClass('btn-outline-primary').find('span').text(str + '用户');
            alert('该用户已被取消' + str);
        } else {
            if (Util.inFollowOrBlockUserList(userName, userList) === -1) {
                if (str === '屏蔽') {
                    var type = Config.blockUserDefaultType;
                    type = prompt('请填写屏蔽类型，0：主题和回帖；1：主题；2：回帖', type);
                    if (type === null) return;
                    type = parseInt(type);
                    if (isNaN(type) || type < 0 || type > 2) type = Config.blockUserDefaultType;
                    userList.push({ name: userName, type: type });
                } else {
                    userList.push({ name: userName });
                }
                (0, _config.write)();
            }
            $this.removeClass('btn-outline-primary').addClass('btn-outline-danger').find('span').text('取消' + str);
            alert('该用户已被' + str);
        }
    }).find('[name="followUser"], [name="blockUser"]').each(function () {
        var $this = $(this);
        var str = '关注';
        var userList = Config.followUserList;
        if ($this.attr('name') === 'blockUser') {
            str = '屏蔽';
            userList = Config.blockUserList;
        }
        if (Util.inFollowOrBlockUserList(userName, userList) > -1) {
            $this.removeClass('btn-outline-primary').addClass('btn-outline-danger').find('span').text('取消' + str);
        }
    });
};

/**
 * 处理个人信息页面上的元素
 */
var handleProfilePage = exports.handleProfilePage = function handleProfilePage() {
    var $registerDate = $('#registerDate');
    var matches = /(\d{4})-(\d{2})-(\d{2})/.exec($registerDate.text());
    if (matches) {
        var now = new Date();

        var _matches = _slicedToArray(matches, 4),
            year = _matches[1],
            month = _matches[2],
            day = _matches[3];

        if (parseInt(month) === now.getMonth() + 1 && parseInt(day) === now.getDate() && parseInt(year) <= now.getFullYear()) {
            $registerDate.attr('title', '\u4ECA\u5929\u662F\u8BE5\u7528\u6237\u6CE8\u518C' + (now.getFullYear() - parseInt(year)) + '\u5468\u5E74\u7EAA\u5FF5\u65E5').addClass('text-danger help');
        }
    }
};

/**
 * 在提交自助评分时显示错标文件大小警告
 */
var showSelfRateErrorSizeSubmitWarning = exports.showSelfRateErrorSizeSubmitWarning = function showSelfRateErrorSizeSubmitWarning() {
    $('form[name="selfRate"]').submit(function () {
        var $this = $(this);
        var ratingSize = parseFloat($this.find('[name="psize"]').val());
        if (isNaN(ratingSize) || ratingSize <= 0) return;
        if (parseInt($this.find('[name="psizegb"]').val()) === 2) ratingSize *= 1024;
        var titleSize = parseInt($this.find('a[data-title-size]').data('title-size'));
        if (titleSize && (titleSize > ratingSize * (100 + 3) / 100 + 1 || titleSize < ratingSize * (100 - 3) / 100 - 1)) {
            return confirm('\u6807\u9898\u6587\u4EF6\u5927\u5C0F(' + titleSize.toLocaleString() + 'M)\u4E0E\u8BA4\u5B9A\u6587\u4EF6\u5927\u5C0F(' + ratingSize.toLocaleString() + 'M)\u4E0D\u4E00\u81F4\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F');
        }
    });
};

/**
 * 在物品商店显示当前持有的KFB和贡献
 */
var showMyInfoInItemShop = exports.showMyInfoInItemShop = function showMyInfoInItemShop() {
    $.get('/profile.php?action=show&uid=' + Info.uid + '&t=' + $.now(), function (html) {
        var kfbMatches = /论坛货币：(\d+)\s*KFB/.exec(html);
        var gxMatches = /贡献数值：(\d+(?:\.\d+)?)/.exec(html);
        if (!kfbMatches && !gxMatches) return;
        var kfb = parseInt(kfbMatches[1]);
        var gx = parseFloat(gxMatches[1]);
        $('#myInfo').html('\u5F53\u524D\u6301\u6709 <b>' + kfb.toLocaleString() + '</b> KFB \u548C <b>' + gx + '</b> \u8D21\u732E');
    });
};

/**
 * 处理购买物品按钮
 */
var handleBuyItemBtns = exports.handleBuyItemBtns = function handleBuyItemBtns() {
    $('#itemList').on('click', 'button[name="buy"]', function () {
        var $this = $(this);
        var itemId = $this.data('id');
        if (!confirm('是否购买此物品？')) return;
        $this.prop('disabled', true);
        $.post('/kf_fw_ig_shop.php', 'buy=' + itemId + '&safeid=' + Info.safeId).done(function (html) {
            var msg = Util.removeHtmlTag(html);
            alert(msg);
        }).fail(function () {
            return alert('连接超时');
        }).always(function () {
            return $this.prop('disabled', false);
        });
    });
};

},{"./config":2,"./const":4,"./util":13}],9:[function(require,module,exports){
/* 发帖模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.specialPostTitleChange = exports.addRedundantKeywordWarning = exports.handleClearMultiQuoteDataBtn = exports.handleMultiQuote = exports.addSmileCode = exports.handleAttachBtns = exports.checkPostForm = exports.handleEditorBtns = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _msg = require('./msg');

var Msg = _interopRequireWildcard(_msg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 处理编辑器按钮
 */
var handleEditorBtns = exports.handleEditorBtns = function handleEditorBtns() {
    var textArea = $('#postContent').get(0);

    // 编辑器按钮
    $(document).on('click', '.editor-btn-group button[data-action]', function () {
        var action = $(this).data('action');
        var value = '';
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
            case 'audio':
                {
                    value = prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐的单曲地址，将自动转换为外链地址）', 'http://');
                    var matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(value);
                    if (matches) value = 'https://music.miaola.work/163/' + matches[1] + '.mp3';
                    matches = /^https?:\/\/www\.xiami\.com\/song\/(\w+)/i.exec(value);
                    if (matches) value = 'https://music.miaola.work/xiami/' + matches[1] + '.mp3';
                }
                break;
            case 'video':
                {
                    value = prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，将自动转换为外链地址）', 'http://');
                    var _matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(value);
                    if (_matches) value = 'https://video.miaola.work/youtube/' + _matches[1];
                    _matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(value);
                    if (_matches) value = 'https://video.miaola.work/youtube/' + _matches[1];
                }
                break;
        }
        if (value === null) return;

        var selText = '';
        var code = '';
        switch (action) {
            case 'link':
                selText = Util.getSelText(textArea);
                code = '[url=' + value + ']' + selText + '[/url]';
                break;
            case 'img':
                code = '[img]' + value + '[/img]';
                break;
            case 'quote':
                selText = Util.getSelText(textArea);
                code = '[quote]' + selText + '[/quote]';
                break;
            case 'code':
                selText = Util.getSelText(textArea);
                code = '[code]' + selText + '[/code]';
                break;
            case 'sell':
                selText = Util.getSelText(textArea);
                code = '[sell=' + value + ']' + selText + '[/sell]';
                break;
            case 'hide':
                selText = Util.getSelText(textArea);
                code = '[hide=' + value + ']' + selText + '[/hide]';
                break;
            case 'bold':
                selText = Util.getSelText(textArea);
                code = '[b]' + selText + '[/b]';
                break;
            case 'italic':
                selText = Util.getSelText(textArea);
                code = '[i]' + selText + '[/i]';
                break;
            case 'underline':
                selText = Util.getSelText(textArea);
                code = '[u]' + selText + '[/u]';
                break;
            case 'strike':
                selText = Util.getSelText(textArea);
                code = '[strike]' + selText + '[/strike]';
                break;
            case 'super':
                selText = Util.getSelText(textArea);
                code = '[sup]' + selText + '[/sup]';
                break;
            case 'sub':
                selText = Util.getSelText(textArea);
                code = '[sub]' + selText + '[/sub]';
                break;
            case 'horizontal':
                code = '[hr]';
                break;
            case 'align-left':
                selText = Util.getSelText(textArea);
                code = '[align=left]' + selText + '[/align]';
                break;
            case 'align-center':
                selText = Util.getSelText(textArea);
                code = '[align=center]' + selText + '[/align]';
                break;
            case 'align-right':
                selText = Util.getSelText(textArea);
                code = '[align=right]' + selText + '[/align]';
                break;
            case 'fly':
                selText = Util.getSelText(textArea);
                code = '[fly]' + selText + '[/fly]';
                break;
            case 'audio':
                code = '[audio]' + value + '[/audio]';
                break;
            case 'video':
                code = '[video]' + value + '[/video]';
                break;
        }
        if (!code) return;
        Util.addCode(textArea, code, selText);
        textArea.focus();
    });

    // 字号下拉菜单
    $('#fontSizeDropdownMenu').on('click', 'a', function (e) {
        e.preventDefault();
        var size = $(this).data('size');
        var selText = Util.getSelText(textArea);
        var code = '[size=' + size + ']' + selText + '[/size]';
        Util.addCode(textArea, code, selText);
        textArea.focus();
    });

    // 颜色、背景颜色下拉菜单
    $('#colorDropdownMenu, #bgColorDropdownMenu').on('click', 'span', function () {
        var $this = $(this);
        var codeType = $this.parent().is('#bgColorDropdownMenu') ? 'backcolor' : 'color';
        var color = $this.data('color');
        var selText = Util.getSelText(textArea);
        var code = '[' + codeType + '=' + color + ']' + selText + '[/' + codeType + ']';
        Util.addCode(textArea, code, selText);
        textArea.focus();
    });
};

/**
 * 检查发帖表单
 */
var checkPostForm = exports.checkPostForm = function checkPostForm() {
    $('#postForm').submit(function () {
        var $postType = $('#postType');
        if ($postType.length > 0 && !$postType.val()) {
            alert('没有选择主题分类');
            $postType.focus();
            return false;
        }

        var $postTitle = $('[name="atc_title"]');
        if ($postTitle.length > 0) {
            var length = Util.getStrByteLen($postTitle.val());
            if (!length) {
                alert('标题不能为空');
                $postTitle.focus();
                return false;
            } else if (length > 100) {
                alert('\u6807\u9898\u957F\u5EA6\u4E3A ' + length + ' \u5B57\u8282(\u4E0D\u53EF\u8D85\u8FC7 100 \u5B57\u8282)\uFF0C\u8BF7\u51CF\u5C11\u6807\u9898\u957F\u5EA6');
                $postTitle.focus();
                return false;
            }
        }

        var $voteItemContent = $('#voteItemContent');
        if ($voteItemContent.length > 0) {
            if (!$voteItemContent.val().trim()) {
                alert('投票选项不能为空');
                $voteItemContent.focus();
                return false;
            }
        }

        var $postContent = $('#postContent');
        if ($postContent.length > 0) {
            var _length = Util.getStrByteLen($postContent.val().trim());
            if (_length < 12) {
                alert('文章内容少于 12 个字节');
                $postContent.focus();
                return false;
            } else if (_length > 50000) {
                alert('文章内容大于 50000 个字节');
                $postContent.focus();
                return false;
            }
        }

        var $postGjc = $('#postGjc');
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
var handleAttachBtns = exports.handleAttachBtns = function handleAttachBtns() {
    $(document).on('click', '.attach-area a[data-action]', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $area = $this.closest('.attach-area');
        var action = $this.data('action');
        var id = $area.data('id');
        if (!id) return;
        if (action === 'insert') {
            var type = $this.data('type');
            var textArea = $('#postContent').get(0);
            var code = '[' + (type === 'new' ? 'upload' : 'attachment') + '=' + id + ']';
            Util.addCode(textArea, code);
            textArea.focus();
        } else if (action === 'update') {
            $area.find('.attach-info').prop('hidden', true).after('<label><input name="replace_' + id + '" type="file" aria-label="\u9009\u62E9\u9644\u4EF6"></label>');
            $this.data('action', 'cancel').text('取消').blur();
            if (!$(document).data('attachUpdateAlert')) {
                alert('本反向代理服务器为了提高性能对图片设置了缓存，更新附件图片后可能需等待最多30分钟才能看到效果');
                $(document).data('attachUpdateAlert', true);
            }
        } else if (action === 'cancel') {
            $area.find('.attach-info').prop('hidden', false).next('label').remove();
            $this.data('action', 'update').text('更新').blur();
        } else if (action === 'delete') {
            $area.remove();
        }
    });

    $(document).on('change', '[type="file"]', function () {
        var $this = $(this);
        var matches = /\.(\w+)$/.exec($this.val());
        if (!matches || !['jpg', 'gif', 'png', 'torrent'].includes(matches[1].toLowerCase())) {
            alert('附件类型不匹配');
            return;
        }

        var type = $this.data('type');
        if (type === 'new') {
            $this.removeData('type').parent().next().prop('hidden', false);

            var $newAttachArea = $('#newAttachArea');
            var totalNum = $newAttachArea.find('[type="file"]').length;
            if (totalNum >= 5) return;
            var $lastAttachArea = $newAttachArea.find('[type="file"]:last').closest('.attach-area');
            var id = parseInt($lastAttachArea.data('id'));
            if (!id) return;
            id++;
            $('\n<div class="form-group row font-size-sm attach-area" data-id="' + id + '">\n  <div class="col-12 col-form-label">\n    <label>\n      <input name="attachment_' + id + '" data-type="new" type="file" aria-label="\u9009\u62E9\u9644\u4EF6">\n    </label>\n    <span hidden>\n      <a data-action="insert" data-type="new" href="#">\u63D2\u5165</a>&nbsp;\n      <a data-action="delete" href="#">\u5220\u9664</a>\n    </span>\n  </div>\n  <div class="col-4">\n    <label class="sr-only" for="atc_downrvrc' + id + '">\u795E\u79D8\u7CFB\u6570</label>\n    <input class="form-control form-control-sm" id="atc_downrvrc' + id + '" name="atc_downrvrc' + id + '" data-toggle="tooltip" \ntype="number" value="0" min="0" title="\u795E\u79D8\u7CFB\u6570" placeholder="\u795E\u79D8\u7CFB\u6570">\n  </div>\n  <div class="col-8">\n    <label class="sr-only" for="atc_desc' + id + '">\u63CF\u8FF0</label>\n    <input class="form-control form-control-sm" id="atc_desc' + id + '" name="atc_desc' + id + '" data-toggle="tooltip" type="text" \ntitle="\u63CF\u8FF0" placeholder="\u63CF\u8FF0">\n  </div>\n</div>\n').insertAfter($lastAttachArea).find('[data-toggle="tooltip"]').tooltip({ 'container': 'body' });
        }
    });
};

/**
 * 插入表情代码
 * @param {jQuery} $node 想要绑定的节点的jQuery对象
 */
var addSmileCode = exports.addSmileCode = function addSmileCode($node) {
    $('.smile-panel').on('click', 'img', function () {
        $('.smile-panel').addClass('open');
        var textArea = $node.get(0);
        if (!textArea) return;
        var code = '[s:' + $(this).data('id') + ']';
        Util.addCode(textArea, code, '');
        textArea.blur();
    }).parent().on('shown.bs.dropdown', function () {
        $('.smile-panel img').each(function () {
            var $this = $(this);
            if (!$this.attr('src')) {
                $this.attr('src', $this.data('src'));
            }
        });
    }).on('hide.bs.dropdown', function (e) {
        var $relatedTarget = $(e.relatedTarget);
        if (!$relatedTarget.data('open')) $relatedTarget.removeData('open');else return e.preventDefault();
    });

    $('#smileDropdownBtn').click(function () {
        var $this = $(this);
        $this.data('open', !$this.data('open'));
    });
};

/**
 * 处理多重回复和多重引用
 * @param {number} type 处理类型，1：多重回复；2：多重引用
 */
var handleMultiQuote = exports.handleMultiQuote = function handleMultiQuote() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var data = localStorage[_const2.default.multiQuoteStorageName];
    if (!data) return;
    try {
        data = JSON.parse(data);
    } catch (ex) {
        return;
    }
    if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) return;
    var _data = data,
        tid = _data.tid,
        quoteList = _data.quoteList;

    if (!Info.tid || tid !== Info.tid || $.type(quoteList) !== 'object') return;
    if (type === 2 && !Info.fid) return;
    var list = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.values(quoteList)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _data2 = _step.value;

            if (!Array.isArray(_data2)) continue;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = _data2[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var quote = _step3.value;

                    list.push(quote);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (!list.length) {
        localStorage.removeItem(_const2.default.multiQuoteStorageName);
        return;
    }

    var keywords = new Set();
    var content = '';
    var $keywords = $('[name="diy_guanjianci"]');
    if (type === 2) {
        Msg.wait('<span class="mr-3">\u6B63\u5728\u83B7\u53D6\u5F15\u7528\u5185\u5BB9\u4E2D&hellip;</span>\u5269\u4F59\uFF1A<em class="text-warning countdown-num">' + list.length + '</em>');
        $(document).clearQueue('MultiQuote');
    }
    $.each(list, function (index, data) {
        if (typeof data.floor === 'undefined' || typeof data.pid === 'undefined') return;
        keywords.add(data.userName);
        if (type === 2) {
            $(document).queue('MultiQuote', function () {
                $.get(Util.makeUrl('post/index', 'action=quote&fid=' + Info.fid + '&tid=' + tid + '&pid=' + data.pid + '&article=' + data.floor + '&t=' + new Date().getTime()), function (_ref) {
                    var postContent = _ref.postContent;

                    content += postContent ? postContent + (index === list.length - 1 ? '' : '\n') : '';
                    var $countdownNum = $('.countdown-num:last');
                    $countdownNum.text(parseInt($countdownNum.text()) - 1);
                    if (index === list.length - 1) {
                        Msg.destroy();
                        $('#postContent').val(content).focus();
                        $keywords.trigger('change');
                    } else {
                        setTimeout(function () {
                            return $(document).dequeue('MultiQuote');
                        }, 100);
                    }
                });
            });
        } else {
            content += '[quote]\u56DE ' + data.floor + '\u697C(' + data.userName + ') \u7684\u5E16\u5B50[/quote]\n';
        }
    });
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = list.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                index = _step2$value[0],
                _quote = _step2$value[1];
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    $keywords.val([].concat(_toConsumableArray(keywords)).join(','));
    $('#postForm').submit(function () {
        localStorage.removeItem(_const2.default.multiQuoteStorageName);
    });
    if (type === 2) {
        $(document).dequeue('MultiQuote');
    } else {
        $('#postContent').val(content).focus();
        $keywords.trigger('change');
    }
};

/**
 * 处理清除多重引用数据按钮
 */
var handleClearMultiQuoteDataBtn = exports.handleClearMultiQuoteDataBtn = function handleClearMultiQuoteDataBtn() {
    $('.clear-multi-quote-data-btn').click(function (e) {
        e.preventDefault();
        if (!confirm('是否清除多重引用数据？')) return;
        localStorage.removeItem(_const2.default.multiQuoteStorageName);
        $('[name="diy_guanjianci"]').val('');
        $('#postContent').val('');
    });
};

/**
 * 添加多余关键词警告
 */
var addRedundantKeywordWarning = exports.addRedundantKeywordWarning = function addRedundantKeywordWarning() {
    $('input[name="diy_guanjianci"]').change(function () {
        var $this = $(this);
        var keywords = $.trim($this.val()).split(',').filter(function (str) {
            return str;
        });
        if (keywords.length > 5) {
            alert('所填关键词已超过5个，多余的关键词将被忽略');
            $this.select().focus();
        }
    });
};

/**
 * 特殊发帖标题格式变化
 */
var specialPostTitleChange = exports.specialPostTitleChange = function specialPostTitleChange() {
    var wangPanType = $.trim($('#wangPanType').val());
    var fileSize = $.trim($('#fileSize').val());
    var expiryDate = $.trim($('#expiryDate').val());
    var fileFormat = $.trim($('#fileFormat').val());
    var ziGou = $('#ziGou').prop('checked') ? '[自购]' : '';
    var xinZuo = $('#xinZuo').prop('checked') ? '[新作]' : '';
    var fileTitle = $.trim($('#fileTitle').val());
    var now = new Date();
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');

    var previewTitle = '[' + month + '.' + day + ']' + ziGou + xinZuo + fileTitle + '[' + wangPanType + expiryDate + '][' + fileSize + ']' + (fileFormat ? '[' + fileFormat + ']' : '');
    var realTitle = '[' + month + '.' + day + ']' + ziGou + fileTitle + '[' + wangPanType + expiryDate + '][' + fileSize + ']' + (fileFormat ? '[' + fileFormat + ']' : '');

    var titleLength = Util.getStrByteLen(realTitle);
    if (titleLength > 100) {
        $('#previewTitle').text('\u6807\u9898\u603B\u957F\u5EA6\u4E3A' + titleLength + '\u5B57\u8282(\u4E0D\u53EF\u8D85\u8FC7100\u5B57\u8282)\uFF0C\u8BF7\u51CF\u5C11\u6807\u9898\u957F\u5EA6').addClass('text-danger');
    } else {
        $('#previewTitle').text(previewTitle).removeClass('text-danger');
    }
    $('#realTitle').val(realTitle);
};

},{"./const":4,"./msg":7,"./util":13}],10:[function(require,module,exports){
/* 公共模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.blockThread = exports.blockUsers = exports.followUsers = exports.showCommonImportOrExportConfigDialog = exports.preventCloseWindow = exports.fillCommonForumPanel = exports.showEditCommonForumDialog = exports.bindFastSubmitShortcutKey = exports.handlePageInput = exports.handleSearchDialog = exports.handleSidebarRollBtn = exports.showSidebarBtnGroup = exports.handleMainMenuLink = exports.handleMainMenu = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _dialog = require('./dialog');

var Dialog = _interopRequireWildcard(_dialog);

var _config = require('./config');

var _configDialog = require('./configDialog');

var ConfigDialog = _interopRequireWildcard(_configDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 处理主菜单
 */
var handleMainMenu = exports.handleMainMenu = function handleMainMenu() {
    $('#mainMenuTogglerBtn').click(function () {
        var maxHeight = document.documentElement.clientHeight - $(this).closest('.navbar').outerHeight();
        if (maxHeight > 0) {
            $('#mainMenu').css('max-height', maxHeight + 'px');
        }
    });
    $('#sidebarMainMenuBtn').click(function () {
        return $('#mainMenuTogglerBtn').click();
    });
};

/**
 * 处理主菜单链接
 */
var handleMainMenuLink = exports.handleMainMenuLink = function handleMainMenuLink() {
    $('#mainMenu').find('[data-name="openConfigDialog"]').click(function (e) {
        e.preventDefault();
        $('#mainMenuTogglerBtn').click();
        ConfigDialog.show();
    });
};

/**
 * 显示侧边栏按钮组
 */
var showSidebarBtnGroup = exports.showSidebarBtnGroup = function showSidebarBtnGroup() {
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
var handleSidebarRollBtn = exports.handleSidebarRollBtn = function handleSidebarRollBtn() {
    $(window).scroll(function () {
        var $btn = $('#sidebarRollBtn');
        if ($(window).scrollTop() > 640) {
            if ($btn.data('direction') === 'top') return;
            $btn.data('direction', 'top').attr('aria-label', '滚动到页顶').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        } else {
            if ($btn.data('direction') === 'bottom') return;
            $btn.data('direction', 'bottom').attr('aria-label', '滚动到页底').find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        }
    });

    $('#sidebarRollBtn').click(function () {
        var scrollTop = $(this).data('direction') === 'bottom' ? $('body').height() : 0;
        $('body, html').animate({ scrollTop: scrollTop });
    });
};

/**
 * 处理搜索对话框
 */
var handleSearchDialog = exports.handleSearchDialog = function handleSearchDialog() {
    var $searchDialog = $('#searchDialog');
    $searchDialog.find('#searchType > option[value="username"]').prop('hidden', !Config.adminMemberEnabled);

    $searchDialog.on('shown.bs.modal', function () {
        $('#searchKeyword').select().focus();
    }).find('form').submit(function () {
        var $this = $(this);
        var $searchKeyword = $this.find('#searchKeyword');
        var searchType = $this.find('#searchType').val();
        var keyword = $.trim($searchKeyword.val());
        if (searchType === 'gjc') {
            $this.attr('action', Util.makeUrl('gjc/' + keyword));
        } else if (searchType === 'username') {
            $this.attr('action', Util.makeUrl('user/username/' + keyword));
        } else {
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
        var value = 'all';
        if ($(this).val() === 'current') value = Info.fid;
        $searchDialog.find('[name="f_fid"]').val(value);
    });

    var $current = $searchDialog.find('[name="searchRange"][value="current"]');
    var $currentBox = $current.closest('.form-check-inline');
    $searchDialog.find('#searchType').change(function () {
        var searchType = $(this).val();
        if (!$current.data('enabled')) return;
        var disabled = searchType === 'gjc' || searchType === 'username';
        $current.prop('disabled', disabled);
        if (disabled) $currentBox.addClass('disabled');else $currentBox.removeClass('disabled');
    });

    if (pageId === 'threadPage' || pageId === 'readPage') {
        $current.prop('disabled', false).data('enabled', true).click();
        $currentBox.removeClass('disabled');
    }
};

/**
 * 处理分页导航
 */
var handlePageInput = exports.handlePageInput = function handlePageInput() {
    $(document).on('click', '.page-input', function (e) {
        e.preventDefault();
        if (Info.maxPageNum && Info.maxPageNum <= 1) return;
        var action = $(this).data('url');
        if (!action) return;
        var excludeParams = $(this).data('exclude');
        if (excludeParams) excludeParams = excludeParams.split(',');else excludeParams = [];
        var num = parseInt(prompt('\u8981\u8DF3\u8F6C\u5230\u7B2C\u51E0\u9875\uFF1F' + (Info.maxPageNum ? '\uFF08\u5171' + Info.maxPageNum + '\u9875\uFF09' : ''), Info.currentPageNum));
        if (num && num > 0) {
            location.href = Util.makeUrl(action, 'page=' + num, true, excludeParams);
        }
    });
};

/**
 * 绑定快速提交的快捷键
 */
var bindFastSubmitShortcutKey = exports.bindFastSubmitShortcutKey = function bindFastSubmitShortcutKey() {
    $('[data-fast-submit="true"]').keydown(function (e) {
        if (e.keyCode === 13 && e.ctrlKey) {
            $(this).closest('form').submit();
        }
    });
};

/**
 * 显示编辑常用版块对话框
 */
var showEditCommonForumDialog = exports.showEditCommonForumDialog = function showEditCommonForumDialog() {
    $(document).on('click', '.edit-common-forum-btn', function (e) {
        e.preventDefault();
        var dialogName = 'editCommonForumDialog';
        if ($('#' + dialogName).length > 0) return;
        (0, _config.read)();

        var commonForumList = Config.commonForumList.length > 0 ? Config.commonForumList : _const2.default.commonForumList;
        var commonForumListHtml = '';
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = commonForumList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _step.value,
                    fid = _step$value.fid,
                    name = _step$value.name;

                commonForumListHtml += '<span class="btn btn-outline-primary" data-fid="' + fid + '">' + name + '</span>';
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var availableForumListHtml = '';
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            var _loop = function _loop() {
                var _step2$value = _step2.value,
                    fid = _step2$value.fid,
                    name = _step2$value.name;

                if (commonForumList.find(function (elem) {
                    return elem.fid === fid;
                })) return 'continue';
                availableForumListHtml += '<span class="btn btn-outline-primary" data-fid="' + fid + '">' + name + '</span>';
            };

            for (var _iterator2 = _const2.default.availableForumList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _ret = _loop();

                if (_ret === 'continue') continue;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        var bodyContent = '\n<p class="font-size-sm text-muted">\n  \u8BF7\u5C06\u53EF\u7528\u7248\u5757\u5185\u7684\u7248\u5757\u6309\u94AE\u62D6\u62FD\u5230\u5E38\u7528\u7248\u5757\u5185\uFF08\u6216\u76F8\u53CD\uFF09\n</p>\n<fieldset class="fieldset mb-3 py-2">\n  <legend>\u5E38\u7528\u7248\u5757</legend>\n  <div class="edit-forum-list d-flex flex-wrap" id="editCommonForumList">' + commonForumListHtml + '</div>\n</fieldset>\n<fieldset class="fieldset mb-3 py-2">\n  <legend>\u53EF\u7528\u7248\u5757</legend>\n  <div class="edit-forum-list d-flex flex-wrap" id="editAvailableForumList">' + availableForumListHtml + '</div>\n</fieldset>';
        var footerContent = '\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>\n<button class="btn btn-danger" name="reset" type="button">\u91CD\u7F6E</button>';
        var $dialog = Dialog.create(dialogName, '编辑常用版块', bodyContent, footerContent);

        var dragulaInit = function dragulaInit() {
            var drake = dragula($dialog.find('.edit-forum-list').get(), { revertOnSpill: true });
            drake.on('drag', function () {
                $dialog.find('.dialog-body').css('overflow-y', 'hidden');
            }).on('drop', function () {
                $dialog.find('.dialog-body').css('overflow-y', 'auto');
            }).on('cancel', function () {
                $dialog.find('.dialog-body').css('overflow-y', 'auto');
            });
        };

        var $dragulaScriptPath = $('[name="dragulaScriptPath"]');
        var dragulaScriptPath = $dragulaScriptPath.val();
        if (dragulaScriptPath) {
            $.getScript(dragulaScriptPath, dragulaInit);
            $dragulaScriptPath.val('');
        } else {
            dragulaInit();
        }

        $dialog.submit(function (e) {
            e.preventDefault();
            Config.commonForumList = [];
            $('#editCommonForumList').children('.btn').each(function () {
                var $this = $(this);
                var fid = parseInt($this.data('fid'));
                var name = $this.text().trim();
                if (!fid || !name) return;
                Config.commonForumList.push({ fid: fid, name: name });
            });
            (0, _config.write)();
            alert('设置已保存');
            Dialog.close(dialogName);
            location.reload();
        }).find('[name="reset"]').click(function () {
            if (!confirm('是否重置？')) return;
            Config.commonForumList = [];
            (0, _config.write)();
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
var fillCommonForumPanel = exports.fillCommonForumPanel = function fillCommonForumPanel() {
    var commonForumList = Config.commonForumList.length > 0 ? Config.commonForumList : _const2.default.commonForumList;
    var html = '';
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = commonForumList.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                index = _step3$value[0],
                _step3$value$ = _step3$value[1],
                _fid = _step3$value$.fid,
                name = _step3$value$.name;

            if (index === 0 || index % 3 === 0) html += '<div class="row mb-3">';
            html += '\n<div class="col-4">\n  <a class="btn btn-outline-primary btn-block" href="' + Util.makeUrl('thread') + '/' + _fid + '">' + name + '</a>\n</div>';
            if (index === commonForumList.length - 1 || index % 3 === 2) html += '</div>';
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    $('.common-forum-panel').html(html);
};

/**
 * 在操作进行时阻止关闭页面
 */
var preventCloseWindow = exports.preventCloseWindow = function preventCloseWindow() {
    window.addEventListener("beforeunload", function (e) {
        if ($('.mask').length > 0) {
            var msg = '正在进行操作中，确定要关闭页面吗？';
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
var showCommonImportOrExportConfigDialog = exports.showCommonImportOrExportConfigDialog = function showCommonImportOrExportConfigDialog(title, configName, callback, callbackAfterSubmit) {
    var dialogName = 'pdCommonImOrExConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _config.read)();
    var bodyContent = '\n<p class="font-size-sm">\n  <b>\u5BFC\u5165\u8BBE\u7F6E\uFF1A</b>\u5C06\u8BBE\u7F6E\u5185\u5BB9\u7C98\u8D34\u5230\u6587\u672C\u6846\u4E2D\u5E76\u70B9\u51FB\u4FDD\u5B58\u6309\u94AE\u5373\u53EF<br>\n  <b>\u5BFC\u51FA\u8BBE\u7F6E\uFF1A</b>\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF\n</p>\n<div class="form-group">\n  <textarea class="form-control font-size-sm" name="commonConfig" rows="10" aria-label="\u8BBE\u7F6E\u5185\u5BB9" style="word-break: break-all;"></textarea>\n</div>';
    var footerContent = '\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>';
    var $dialog = Dialog.create(dialogName, '\u5BFC\u5165\u6216\u5BFC\u51FA' + title, bodyContent, footerContent);

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        var options = $.trim($dialog.find('[name="commonConfig"]').val());
        if (!options) return;
        try {
            options = JSON.parse(options);
        } catch (ex) {
            alert('设置有错误');
            return;
        }
        if (!options || $.type(options) !== $.type(Config[configName])) {
            alert('设置有错误');
            return;
        }
        Config[configName] = options;
        (0, _config.write)();
        alert('设置已导入');
        Dialog.close(dialogName);
        if (typeof callbackAfterSubmit === 'function') callbackAfterSubmit();else location.reload();
    });
    Dialog.show(dialogName);
    $dialog.find('[name="commonConfig"]').val(JSON.stringify(Config[configName])).select().focus();
    if (typeof callback === 'function') callback($dialog);
};

/**
 * 关注用户
 */
var followUsers = exports.followUsers = function followUsers() {
    if (!Config.followUserList.length) return;
    if (pageId === 'indexPage' && Config.highlightFollowUserThreadInHPEnabled) {
        $('.thread-link').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.data('author'), Config.followUserList) > -1) {
                $this.addClass('text-danger');
            }
        });
    } else if (pageId === 'threadPage') {
        $('.thread-link').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.data('author'), Config.followUserList) > -1) {
                $this.closest('.thread-list-item').find('.thread-footer-column a:first').addClass('text-danger');
                if (Config.highlightFollowUserThreadLinkEnabled) $this.addClass('text-danger');
            }
        });
    } else if (pageId === 'readPage') {
        $('.read-floor').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList(Util.getFloorUserName($this.data('username')), Config.followUserList) > -1) {
                $this.find('.floor-num').addClass('text-danger');
            }
        });
    } else if (pageId === 'gjcPage' || pageId === 'sharePage' || pageId === 'searchPage') {
        $('.thread-list-group').find('a[data-author]').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.data('author'), Config.followUserList) > -1) {
                $this.addClass('text-danger');
            }
        });
    }
};

/**
 * 屏蔽用户
 */
var blockUsers = exports.blockUsers = function blockUsers() {
    if (!Config.blockUserList.length) return;
    var num = 0;
    if (pageId === 'indexPage') {
        $('.thread-link').each(function () {
            var $this = $(this);
            var index = Util.inFollowOrBlockUserList($this.data('author'), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type <= 1) {
                num++;
                $this.closest('.thread-link-group').remove();
            }
        });
    } else if (pageId === 'threadPage') {
        if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(Info.fid)) return;else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(Info.fid)) return;
        $('.thread-link').each(function () {
            var $this = $(this);
            var index = Util.inFollowOrBlockUserList($this.data('author'), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type <= 1) {
                num++;
                $this.closest('.thread-list-item').remove();
            }
        });
    } else if (pageId === 'readPage') {
        if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(Info.fid)) return;else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(Info.fid)) return;
        $('.read-floor').each(function () {
            var $this = $(this);
            var index = Util.inFollowOrBlockUserList(Util.getFloorUserName($this.data('username')), Config.blockUserList);
            if (index > -1) {
                var floor = parseInt($this.data('floor'));
                if (Config.blockUserList[index].type === 2 && floor === 0) return;else if (Config.blockUserList[index].type === 1 && floor > 0) return;
                num++;
                $this.closest('.read-floor').remove();
            }
        });
        $('.read-content').find('.blockquote > p').each(function () {
            var $this = $(this);
            var content = $this.text().trim();
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = Config.blockUserList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var data = _step4.value;

                    if (data.type === 1) continue;
                    try {
                        var regex1 = new RegExp('^\u5F15\u7528(\u7B2C\\d+\u697C|\u697C\u4E3B)' + data.name + '\u4E8E', 'i');
                        var regex2 = new RegExp('^\u56DE\\s*\\d+\u697C\\(' + data.name + '\\)\\s*\u7684\u5E16\u5B50', 'i');
                        if (regex1.test(content) || regex2.test(content)) {
                            $this.html('<mark class="help" data-toggle="tooltip" title="\u88AB\u5C4F\u853D\u7528\u6237\uFF1A' + data.name + '">\u8BE5\u7528\u6237\u5DF2\u88AB\u5C4F\u853D</mark>');
                        }
                    } catch (ex) {}
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        });
    } else if (pageId === 'gjcPage' && Config.blockUserAtTipsEnabled) {
        $('.thread-list-group').find('a[data-author]').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.data('author'), Config.blockUserList) > -1) {
                num++;
                $this.closest('.thread-list-item').remove();
            }
        });
    }
    if (num > 0) console.log('\u3010\u5C4F\u853D\u7528\u6237\u3011\u5171\u6709' + num + '\u4E2A\u4E3B\u9898\u6216\u56DE\u590D\u88AB\u5C4F\u853D');
};

/**
 * 屏蔽主题
 */
var blockThread = exports.blockThread = function blockThread() {
    if (!Config.blockThreadList.length) return;

    /**
     * 是否屏蔽主题
     * @param {string} title 主题标题
     * @param {string} userName 用户名
     * @param {number} fid 版块ID
     * @returns {boolean} 是否屏蔽
     */
    var isBlock = function isBlock(title, userName) {
        var fid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = Config.blockThreadList[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var _step5$value = _step5.value,
                    keyWord = _step5$value.keyWord,
                    includeUser = _step5$value.includeUser,
                    excludeUser = _step5$value.excludeUser,
                    includeFid = _step5$value.includeFid,
                    excludeFid = _step5$value.excludeFid;

                var regex = null;
                if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
                    try {
                        regex = eval(keyWord);
                    } catch (ex) {
                        console.log(ex);
                        continue;
                    }
                }
                if (userName) {
                    if (includeUser) {
                        if (!includeUser.includes(userName)) continue;
                    } else if (excludeUser) {
                        if (excludeUser.includes(userName)) continue;
                    }
                }
                if (fid) {
                    if (includeFid) {
                        if (!includeFid.includes(fid)) continue;
                    } else if (excludeFid) {
                        if (excludeFid.includes(fid)) continue;
                    }
                }
                if (regex) {
                    if (regex.test(title)) return true;
                } else {
                    if (title.toLowerCase().includes(keyWord.toLowerCase())) return true;
                }
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        return false;
    };

    var num = 0;
    if (pageId === 'indexPage') {
        $('.thread-link').each(function () {
            var $this = $(this);
            if (isBlock($this.text().trim(), $this.data('author'))) {
                num++;
                $this.closest('.thread-link-group').remove();
            }
        });
    } else if (pageId === 'threadPage') {
        $('.thread-link').each(function () {
            var $this = $(this);
            if (isBlock($this.attr('title'), $this.data('author'), Info.fid)) {
                num++;
                $this.closest('.thread-list-item').remove();
            }
        });
    } else if (pageId === 'readPage') {
        if (Info.currentPageNum !== 1) return;
        var $topFloor = $('.read-floor[data-floor="0"]');
        if (!$topFloor.length) return;
        if (isBlock($('.thread-title').text().trim(), Util.getFloorUserName($topFloor.data('username')), Info.fid)) {
            num++;
            $topFloor.remove();
        }
    }
    if (num > 0) console.log('\u3010\u5C4F\u853D\u4E3B\u9898\u3011\u5171\u6709' + num + '\u4E2A\u4E3B\u9898\u88AB\u5C4F\u853D');
};

},{"./config":2,"./configDialog":3,"./const":4,"./dialog":5,"./util":13}],11:[function(require,module,exports){
/* 主题模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleMoveThreadBtn = exports.replaceAttachLabel = exports.addUserMemo = exports.bindMultiQuoteCheckClick = exports.handleCopyCodeBtn = exports.handleTuiThreadBtn = exports.handleFastGotoFloorBtn = exports.gotoFloor = exports.handleFloorImage = exports.copyBuyThreadList = exports.handleBuyThreadBtn = exports.handleBlockFloorBtn = exports.handleGoodPostBtn = exports.handleFastReplyBtn = exports.handleCopyFloorLinkBtn = undefined;

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _config = require('./config');

var _msg = require('./msg');

var Msg = _interopRequireWildcard(_msg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 处理复制楼层跳转链接按钮
 */
var handleCopyFloorLinkBtn = exports.handleCopyFloorLinkBtn = function handleCopyFloorLinkBtn() {
    $(document).on('click', '.floor-num', function (e) {
        e.preventDefault();
        var $this = $(this);
        var link = Util.getHostNameUrl() + $this.attr('href');
        $this.data('copy-text', link);
        if (!Util.copyText($this, $this)) {
            prompt('本楼的跳转链接：', link);
        }
    });
};

/**
 * 处理快速回复按钮
 */
var handleFastReplyBtn = exports.handleFastReplyBtn = function handleFastReplyBtn() {
    $(document).on('click', '.fast-reply-btn', function () {
        var $article = $(this).closest('article');
        var floor = $article.data('floor');
        var userName = Util.getFloorUserName($article.data('username'));
        $('#postGjc').val(userName);
        var postContent = $('#postContent').get(0);
        postContent.value = '[quote]\u56DE ' + floor + '\u697C(' + userName + ') \u7684\u5E16\u5B50[/quote]\n';
        postContent.selectionStart = postContent.value.length;
        postContent.selectionEnd = postContent.value.length;
        postContent.focus();
    });
};

/**
 * 处理提交优秀帖按钮
 */
var handleGoodPostBtn = exports.handleGoodPostBtn = function handleGoodPostBtn() {
    $(document).on('click', '.handle-post-btn', function () {
        var $this = $(this);
        if ($this.data('wait')) return;
        var $floor = $(this).closest('.read-floor');
        var pid = $floor.data('pid');

        var tips = '是否提交本楼层为优秀帖子？';
        if (Info.goodPostTips) tips += '\n\uFF08' + Info.goodPostTips + '\uFF09';
        if (!confirm(tips)) return;

        $this.data('wait', true);
        $.post('/diy_read_cztz.php', 'tid=' + Info.tid + '&pid=' + pid + '&safeid=' + Info.safeId).done(function (html) {
            if (/已将本帖操作为优秀帖|该楼层已经是优秀帖/.test(html)) {
                var $content = $floor.find('.read-content');
                if (!$content.find('.fieldset-alert:contains("本帖为优秀帖")').length) {
                    $content.prepend('<fieldset class="fieldset fieldset-alert"><legend>↓</legend>本帖为优秀帖</fieldset>');
                }
            }
            alert(html);
        }).always(function () {
            return $this.removeData('wait');
        });
    });
};

/**
 * 处理屏蔽回帖按钮
 */
var handleBlockFloorBtn = exports.handleBlockFloorBtn = function handleBlockFloorBtn() {
    $(document).on('click', '.block-floor', function () {
        return confirm('确认要屏蔽该回帖？本操作不可恢复！（屏蔽后该回帖将对大家不可见）');
    });
};

/**
 * 处理购买帖子按钮
 */
var handleBuyThreadBtn = exports.handleBuyThreadBtn = function handleBuyThreadBtn() {
    $(document).on('click', '.buy-thread-btn', function (e) {
        e.preventDefault();
        var $this = $(this);
        var pid = $this.data('pid');
        var price = $this.data('price');
        if (price > 5 && !confirm('\u6B64\u8D34\u552E\u4EF7' + price + 'KFB\uFF0C\u662F\u5426\u8D2D\u4E70\uFF1F')) return;
        var $wait = Msg.wait('正在购买帖子&hellip;');
        $.get(Util.makeUrl('job/buytopic', 'tid=' + Info.tid + '&pid=' + pid + '&verify=' + Info.verify + '&t=' + new Date().getTime()), function (_ref) {
            var msg = _ref.msg;

            Msg.remove($wait);
            if (msg === '操作完成') {
                location.reload();
            } else if (msg.includes('您已经购买此帖')) {
                alert('你已经购买过此帖');
                location.reload();
            } else {
                alert('帖子购买失败');
            }
        });
    });
};

/**
 * 复制购买人名单
 */
var copyBuyThreadList = exports.copyBuyThreadList = function copyBuyThreadList() {
    $(document).on('change', '.buy-thread-list', function () {
        var $this = $(this);
        if ($this.val() !== 'copyList') return;
        var list = $this.find('option').map(function (index) {
            var name = $(this).text();
            if (index === 0 || index === 1 || name.includes('-'.repeat(11))) return null;else return name;
        }).get().join('\n');
        $this.get(0).selectedIndex = 0;
        if (!list) {
            alert('暂时无人购买');
            return;
        }

        var $dialog = $('\n<div class="modal fade" id="buyThreadListDialog" tabindex="-1" role="dialog" aria-labelledby="buyThreadListDialogTitle"\n     aria-hidden="true">\n  <div class="modal-dialog modal-sm" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <h5 class="modal-title" id="buyThreadListDialogTitle">\u8D2D\u4E70\u4EBA\u540D\u5355</h5>\n        <button class="close" data-dismiss="modal" type="button" aria-label="\u5173\u95ED">\n          <span aria-hidden="true">&times;</span>\n        </button>\n      </div>\n      <div class="modal-body">\n        <div class="form-group">\n          <textarea class="form-control" name="buyThreadListContent" rows="14" aria-label="\u8D2D\u4E70\u4EBA\u540D\u5355">' + list + '</textarea>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n').appendTo('body');
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
var handleFloorImage = exports.handleFloorImage = function handleFloorImage() {
    $(document).on('click', '.img', function () {
        var $this = $(this);
        if ($this.parent().is('a') || this.naturalWidth <= $this.closest('.read-content').width()) return;
        location.href = $this.attr('src');
    });
};

/**
 * 跳转到指定楼层
 */
var gotoFloor = exports.gotoFloor = function gotoFloor() {
    if (Info.floor && Info.floor > 0) {
        var hashName = $('article[data-floor="' + Info.floor + '"]').prev('a').attr('name');
        if (hashName) location.hash = '#' + hashName;
    }
};

/**
 * 处理快速跳转到指定楼层按钮
 */
var handleFastGotoFloorBtn = exports.handleFastGotoFloorBtn = function handleFastGotoFloorBtn() {
    $('.fast-goto-floor').click(function (e) {
        e.preventDefault();
        var action = $(this).data('url');
        if (!action) return;
        var floor = parseInt(prompt('你要跳转到哪一层楼？'));
        if (!floor || floor <= 0) return;
        location.href = Util.makeUrl(action, 'page=' + (Math.floor(floor / Config.perPageFloorNum) + 1) + '&floor=' + floor);
    });
};

/**
 * 处理推帖子按钮
 */
var handleTuiThreadBtn = exports.handleTuiThreadBtn = function handleTuiThreadBtn() {
    $('.tui-btn').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.data('wait')) return;
        $this.data('wait', true);
        $.ajax({
            type: 'POST',
            url: '/diy_read_tui.php',
            data: 'tid=' + Info.tid + '&safeid=' + Info.safeId,
            success: function success(msg) {
                var matches = /<span.+?\+\d+!<\/span>\s*(\d+)/i.exec(msg);
                if (matches) {
                    var $num = $this.find('span:first');
                    $num.text('+1');
                    setTimeout(function () {
                        $num.text(matches[1]);
                    }, 1000);
                } else if (/已推过/.test(msg)) {
                    alert('已推过');
                } else {
                    alert('操作失败');
                }
            },
            error: function error() {
                alert('操作失败');
            },
            complete: function complete() {
                $this.removeData('wait');
            }
        });
    });
};

/**
 * 处理复制代码按钮
 */
var handleCopyCodeBtn = exports.handleCopyCodeBtn = function handleCopyCodeBtn() {
    $(document).on('click', '.copy-code', function (e) {
        e.preventDefault();
        var $this = $(this);
        if (Util.copyText($this.next('pre'), $this)) return;

        var code = $this.data('code');
        if (code) {
            $this.text('复制代码').removeData('code');
            $this.next('textarea').remove();
            $this.after('<pre class="pre-scrollable">' + code + '</pre>');
        } else {
            var $pre = $this.next('pre');
            var html = $pre.html();
            $this.text('还原代码').data('code', html);
            html = Util.decodeHtmlSpecialChar(html);
            var height = $pre.height();
            if (height < 50) height = 50;
            if (height > 340) height = 340;
            $pre.remove();
            $('<textarea class="form-control code-textarea" style="height: ' + height + 'px" wrap="off">' + html + '</textarea>').insertAfter($this).select().focus();
        }
    });
};

/**
 * 获取当前页面选中的多重引用数据
 * @returns {{}[]} 多重引用数据列表
 */
var getCheckedMultiQuoteData = function getCheckedMultiQuoteData() {
    var quoteList = [];
    $('.multi-quote-check:checked').each(function () {
        var $article = $(this).closest('article');
        quoteList.push({ floor: $article.data('floor'), pid: $article.data('pid'), userName: Util.getFloorUserName($article.data('username')) });
    });
    return quoteList;
};

/**
 * 绑定多重引用复选框点击事件
 */
var bindMultiQuoteCheckClick = exports.bindMultiQuoteCheckClick = function bindMultiQuoteCheckClick() {
    $(document).on('click', '.multi-quote-check', function () {
        var data = localStorage[_const2.default.multiQuoteStorageName];
        if (data) {
            try {
                data = JSON.parse(data);
                if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) data = null;else if (!('tid' in data) || data.tid !== Info.tid || $.type(data.quoteList) !== 'object') data = null;
            } catch (ex) {
                data = null;
            }
        } else {
            data = null;
        }
        var quoteList = getCheckedMultiQuoteData();
        if (!data) {
            localStorage.removeItem(_const2.default.multiQuoteStorageName);
            data = { tid: Info.tid, quoteList: {} };
        }
        if (quoteList.length > 0) data.quoteList[Info.currentPageNum] = quoteList;else delete data.quoteList[Info.currentPageNum];
        localStorage[_const2.default.multiQuoteStorageName] = JSON.stringify(data);
    });
};

/**
 * 添加用户自定义备注
 */
var addUserMemo = exports.addUserMemo = function addUserMemo() {
    if ($.isEmptyObject(Config.userMemoList)) return;
    $('.read-floor').each(function () {
        var $this = $(this);
        var userName = Util.getFloorUserName($this.data('username'));
        var key = Object.keys(Config.userMemoList).find(function (name) {
            return name === userName;
        });
        if (!key) return;
        $this.find('.floor-user').after('<span class="tips font-size-sm" data-toggle="tooltip" title="\u5907\u6CE8\uFF1A' + Config.userMemoList[key] + '">[?]</span>');
    });
};

/**
 * 替换附件标签
 */
var replaceAttachLabel = exports.replaceAttachLabel = function replaceAttachLabel() {
    $('.attach-label').each(function () {
        var $this = $(this);
        if ($this.closest('.blockquote').length > 0) return;
        var aid = $this.data('aid');
        var pid = $this.closest('.read-floor').data('pid');
        $this.replaceWith('<img class="img" src="/job.php?action=download&pid=' + pid + '&tid=' + Info.tid + '&aid=' + aid + '" alt="[\u9644\u4EF6\u56FE\u7247]">');
    });
};

/**
 * 处理一键移动主题按钮
 */
var handleMoveThreadBtn = exports.handleMoveThreadBtn = function handleMoveThreadBtn() {
    $('#moveThreadBtn').click(function (e) {
        e.preventDefault();
        if (!confirm('是否将该主题移到[无限制资源区]？')) return;
        $.post('/diy_admin_read.php', 'tid=' + Info.tid + '&safeid=' + Info.safeId, function (msg) {
            alert(msg);
            location.reload();
        });
    });
};

},{"./config":2,"./const":4,"./msg":7,"./util":13}],12:[function(require,module,exports){
/* 自定义脚本模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleInstallScriptLink = exports.showDialog = exports.getScriptMeta = exports.runCustomScript = exports.runCmd = undefined;

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _dialog = require('./dialog');

var Dialog = _interopRequireWildcard(_dialog);

var _config = require('./config');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 默认脚本名称
var defScriptName = '未命名脚本';
// 脚本meta信息的正则表达式
var metaRegex = /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i;

/**
 * 运行命令
 * @param {string} cmd 命令
 * @param {boolean} isOutput 是否在控制台上显示结果
 * @returns {{isError: boolean, response: string}} isError：是否出错；response：执行结果
 */
var runCmd = exports.runCmd = function runCmd(cmd) {
    var isOutput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var isError = false;
    var response = '';
    try {
        response = eval(cmd);
        if (isOutput) console.log(response);
    } catch (ex) {
        isError = true;
        response = ex;
        console.log(ex);
    }
    return { isError: isError, response: String(response) };
};

/**
 * 执行自定义脚本
 * @param {string} type 脚本执行时机，start：在脚本开始时执行；end：在脚本结束时执行
 */
var runCustomScript = exports.runCustomScript = function runCustomScript() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'end';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Config.customScriptList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _step.value,
                enabled = _step$value.enabled,
                trigger = _step$value.trigger,
                content = _step$value.content;

            if (enabled && trigger === type && content) {
                runCmd(content);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

/**
 * 获取脚本meta信息
 * @param {string} content 脚本内容
 * @returns {{}} 脚本meta信息
 */
var getScriptMeta = exports.getScriptMeta = function getScriptMeta(content) {
    var meta = {
        name: defScriptName,
        version: '',
        trigger: 'end',
        homepage: '',
        author: ''
    };
    var matches = metaRegex.exec(content);
    if (!matches) return meta;
    var metaContent = matches[1];
    matches = /@name[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.name = matches[1];
    matches = /@version[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.version = matches[1];
    matches = /@trigger[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.trigger = matches[1].toLowerCase() === 'start' ? 'start' : 'end';
    matches = /@homepage[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.homepage = matches[1];
    matches = /@author[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.author = matches[1];
    return meta;
};

/**
 * 显示自定义脚本对话框
 * @param {?number} showIndex 要显示的脚本的序号（-1表示最后一个）
 */
var showDialog = exports.showDialog = function showDialog() {
    var showIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var dialogName = 'customScriptDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _config.read)();

    var bodyContent = '\n<div class="d-flex mb-3">\n  <div class="btn-group btn-group-sm">\n    <button class="btn btn-success" name="add" type="button">\u6DFB\u52A0\u811A\u672C</button>\n    <button class="btn btn-secondary" name="insertSample" type="button">\u63D2\u5165\u8303\u4F8B</button>\n  </div>\n  \n  <div class="btn-group btn-group-sm ml-auto">\n    <a class="btn btn-link" href="' + window.Info.rootPath + 'read/682170/sf/6d7" target="_blank">\u811A\u672C\u6536\u96C6\u8D34</a>\n  </div>\n</div>\n<div id="customScriptList"></div>\n';
    var footerContent = '\n<button class="btn btn-warning mr-auto" name="openImOrExCustomScriptDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>\n<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>\n<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>\n<button class="btn btn-danger" name="clear" type="button">\u6E05\u7A7A</button>';
    var $dialog = Dialog.create(dialogName, '自定义脚本', bodyContent, footerContent);
    var $customScriptList = $dialog.find('#customScriptList');

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.customScriptList = [];
        $customScriptList.find('textarea[name="customScriptContent"]').each(function () {
            var $this = $(this);
            var content = $this.val();
            if (!$.trim(content)) return;
            var enabled = $this.closest('.custom-script-container').find('[name="enabled"]').prop('checked');
            Config.customScriptList.push($.extend(getScriptMeta(content), { enabled: enabled, content: content }));
        });
        (0, _config.write)();
        Dialog.close(dialogName);
        alert('自定义脚本修改成功\n（需刷新页面后才可生效）');
    }).end().find('[name="clear"]').click(function () {
        if (confirm('是否清空所有脚本？')) {
            $customScriptList.html('');
            Dialog.resize(dialogName);
        }
    });

    /**
     * 添加自定义脚本
     * @param {boolean} enabled 是否启用脚本
     * @param {string} name 脚本名称
     * @param {string} version 版本号
     * @param {string} homepage 首页
     * @param {string} trigger 脚本执行时机
     * @param {string} content 脚本内容
     */
    var addCustomScript = function addCustomScript() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$enabled = _ref.enabled,
            enabled = _ref$enabled === undefined ? true : _ref$enabled,
            _ref$name = _ref.name,
            name = _ref$name === undefined ? defScriptName : _ref$name,
            _ref$version = _ref.version,
            version = _ref$version === undefined ? '' : _ref$version,
            _ref$homepage = _ref.homepage,
            homepage = _ref$homepage === undefined ? '' : _ref$homepage,
            _ref$trigger = _ref.trigger,
            trigger = _ref$trigger === undefined ? 'end' : _ref$trigger,
            _ref$content = _ref.content,
            content = _ref$content === undefined ? '' : _ref$content;

        var count = $customScriptList.find('.custom-script-container').length;
        $customScriptList.append('\n<div class="card custom-script-container">\n  <div class="card-header d-flex p-1" id="customScriptHeader' + count + '">\n    <div class="form-check form-check-inline mx-1">\n      <input class="form-check-input position-static" name="enabled" type="checkbox" ' + (enabled ? 'checked' : '') + ' title="\u662F\u5426\u542F\u7528" aria-label="\u662F\u5426\u542F\u7528">\n    </div>\n\n    <button class="btn btn-link btn-sm mx-1 px-0 text-truncate custom-script-name" data-toggle="collapse" data-target="#customScriptContent' + count + '" type="button"\n            title="' + name + '" aria-expanded="true" aria-controls="customScriptContent' + count + '">' + name + '</button>\n\n    <div class="ml-auto col-auto px-0">\n      <a class="badge badge-primary align-middle custom-script-homepage" ' + (!homepage ? 'hidden' : '') + '\n         href="' + (homepage.startsWith('http') ? '' : Info.rootPath) + homepage + '" target="_blank">\u4E3B\u9875</a>\n      <span class="badge badge-warning align-middle custom-script-version" ' + (!version ? 'hidden' : '') + '>' + version + '</span>\n      <span class="badge badge-' + (trigger === 'start' ? 'danger' : 'info') + ' align-middle custom-script-trigger" title="\u811A\u672C\u6267\u884C\u65F6\u673A">' + (trigger === 'start' ? '开' : '结') + '</span>\n      <button class="btn btn-link btn-sm text-danger" name="delete" type="button">\u5220</button>\n    </div>\n  </div>\n\n  <div class="collapse custom-script-content" id="customScriptContent' + count + '" aria-labelledby="customScriptHeader' + count + '" data-parent="#customScriptList">\n    <div class="card-body p-0">\n      <textarea class="form-control border-0 font-size-sm font-monospace" name="customScriptContent" rows="12" style="white-space: pre;" wrap="off">' + content + '</textarea>\n    </div>\n  </div>\n</div>\n');
    };

    $dialog.find('[name="add"]').click(function () {
        $customScriptList.find('.custom-script-content.show').collapse();
        addCustomScript();
        $customScriptList.find('.custom-script-content:last').collapse();
        //Dialog.resize(dialogName);
    }).end().find('[name="insertSample"]').click(function () {
        var $content = $customScriptList.find('.custom-script-content.show textarea[name="customScriptContent"]');
        $content.val(('\n// ==UserScript==\n// @name        ' + defScriptName + '\n// @version     1.0\n// @author      ' + Info.userName + '\n// @trigger     end\n// @homepage    read/682170/spid/14034074/sf/6d7\n// @description \u8FD9\u662F\u4E00\u4E2A\u672A\u547D\u540D\u811A\u672C\n// ==/UserScript==\n').trim() + '\n' + $content.val()).focus();
    }).end().find('[name="openImOrExCustomScriptDialog"]').click(function () {
        Public.showCommonImportOrExportConfigDialog('自定义脚本', 'customScriptList');
    });

    $customScriptList.on('click', '[name="delete"]', function () {
        if (!confirm('是否删除此脚本？')) return;
        $(this).closest('.custom-script-container').remove();
    }).on('change', 'textarea[name="customScriptContent"]', function () {
        var $this = $(this);

        var _getScriptMeta = getScriptMeta($this.val()),
            name = _getScriptMeta.name,
            version = _getScriptMeta.version,
            homepage = _getScriptMeta.homepage,
            trigger = _getScriptMeta.trigger;

        var $container = $this.closest('.custom-script-container');
        $container.find('.custom-script-name').text(name ? name : defScriptName);
        $container.find('.custom-script-homepage').attr('href', homepage ? homepage : '').prop('hidden', !homepage);
        $container.find('.custom-script-version').text(version).prop('hidden', !version);
        $container.find('.custom-script-trigger').text(trigger === 'start' ? '开' : '结').removeClass('badge-' + (trigger === 'start' ? 'info' : 'danger')).addClass('badge-' + (trigger === 'start' ? 'danger' : 'info'));
    });

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Config.customScriptList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var data = _step2.value;

            addCustomScript(data);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    Dialog.show(dialogName);
    if (typeof showIndex === 'number') {
        $customScriptList.find('#customScriptContent' + showIndex).collapse();
    }
};

/**
 * 处理安装自定义脚本按钮
 */
var handleInstallScriptLink = exports.handleInstallScriptLink = function handleInstallScriptLink() {
    $('main').on('click', 'a[href$="#install-mobile-script"]', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $area = $this.nextAll('.code-area').eq(0).find('pre');
        if (!$area.length) return;
        var content = Util.htmlDecode($area.html().replace(/<legend>.+?<\/legend>/i, '')).trim();
        if (!metaRegex.test(content)) return;

        (0, _config.read)();
        var meta = getScriptMeta(content);
        var index = Config.customScriptList.findIndex(function (script) {
            return script.name === meta.name && script.author === meta.author;
        });
        var isUpdate = index > -1;
        if (!confirm('\u662F\u5426' + (isUpdate ? '更新' : '安装') + '\u6B64\u811A\u672C\uFF1F')) return;
        Config.customScriptEnabled = true;
        var script = $.extend(meta, { enabled: true, content: content });
        if (isUpdate) {
            Config.customScriptList[index] = script;
        } else {
            Config.customScriptList.push(script);
        }
        (0, _config.write)();
        Dialog.close('customScriptDialog');
        showDialog(index);
    }).on('click', 'a[href$="#install-script"]', function (e) {
        e.preventDefault();
        alert('无法安装适用于电脑版论坛的自定义脚本');
    });
};

},{"./config":2,"./dialog":5,"./util":13}],13:[function(require,module,exports){
/* 其它模块 */
'use strict';

/**
 * 设置Cookie
 * @param {string} name Cookie名称
 * @param {*} value Cookie值
 * @param {?Date} date Cookie有效期，留空则表示有效期为浏览器进程
 * @param {string} prefix Cookie名称前缀
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var setCookie = exports.setCookie = function setCookie(name, value) {
    var date = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Info.uid + '_' + Const.storagePrefix;

    document.cookie = '' + prefix + name + '=' + encodeURI(value) + (!date ? '' : ';expires=' + date.toUTCString()) + ';path=/;';
};

/**
 * 获取Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 * @returns {?string} Cookie值
 */
var getCookie = exports.getCookie = function getCookie(name) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Info.uid + '_' + Const.storagePrefix;

    var regex = new RegExp('(^| )' + prefix + name + '=([^;]*)(;|$)');
    var matches = document.cookie.match(regex);
    if (!matches) return null;else return decodeURI(matches[2]);
};

/**
 * 删除Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 */
var deleteCookie = exports.deleteCookie = function deleteCookie(name) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Info.uid + '_' + Const.storagePrefix;

    document.cookie = '' + prefix + name + '=;expires=' + getDate('-1d').toUTCString() + ';path=/;';
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
var getDate = exports.getDate = function getDate(value) {
    var date = new Date();
    var matches = /^(-|\+)?(\d+)([a-zA-Z]{1,2})$/.exec(value);
    if (!matches) return null;
    var flag = typeof matches[1] === 'undefined' ? 0 : matches[1] === '+' ? 1 : -1;
    var increment = flag === -1 ? -parseInt(matches[2]) : parseInt(matches[2]);
    var unit = matches[3];
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
var getStrByteLen = exports.getStrByteLen = function getStrByteLen(str) {
    var len = 0;
    var cLen = 2;
    for (var i = 0; i < str.length; i++) {
        len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? cLen : 1;
    }
    return len;
};

/**
 * 获取当前域名的URL
 * @returns {string} 当前域名的URL
 */
var getHostNameUrl = exports.getHostNameUrl = function getHostNameUrl() {
    return location.protocol + '//' + location.host;
};

/**
 * 添加BBCode
 * @param textArea 文本框
 * @param {string} code BBCode
 * @param {string} selText 选择文本
 */
var addCode = exports.addCode = function addCode(textArea, code) {
    var selText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var startPos = selText === '' ? code.indexOf(']') + 1 : code.indexOf(selText);
    if (typeof textArea.selectionStart !== 'undefined') {
        var prePos = textArea.selectionStart;
        textArea.value = textArea.value.substring(0, prePos) + code + textArea.value.substring(textArea.selectionEnd);
        textArea.selectionStart = prePos + startPos;
        textArea.selectionEnd = prePos + startPos + selText.length;
    } else {
        textArea.value += code;
    }
};

/**
 * 获取选择文本
 * @param textArea 文本框
 * @returns {string} 选择文本
 */
var getSelText = exports.getSelText = function getSelText(textArea) {
    return textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
};

/**
 * 从URL查询字符串提取参数对象
 * @param {string} str URL查询字符串
 * @returns {Map} 参数集合
 */
var extractQueryStr = exports.extractQueryStr = function extractQueryStr(str) {
    var params = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = str.split('&')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var param = _step.value;

            if (!param) continue;

            var _param$split = param.split('='),
                _param$split2 = _slicedToArray(_param$split, 2),
                key = _param$split2[0],
                value = _param$split2[1];

            params.set(key, typeof value !== 'undefined' ? value : '');
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return params;
};

/**
 * 从参数对象中创建URL查询字符串
 * @param {Map} map 参数集合
 * @returns {string} URL查询字符串
 */
var buildQueryStr = exports.buildQueryStr = function buildQueryStr(map) {
    var queryStr = '';
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = map[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                key = _step2$value[0],
                value = _step2$value[1];

            if (Info.urlType === 2) {
                queryStr += (queryStr ? '&' : '') + key + '=' + value;
            } else {
                queryStr += (queryStr ? '/' : '') + key + '/' + value;
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
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
var makeUrl = exports.makeUrl = function makeUrl(action) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var includeOtherParam = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var excludeParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    var url = '';
    var paramList = extractQueryStr(param);
    if (includeOtherParam) {
        paramList = new Map([].concat(_toConsumableArray(extractQueryStr(Info.urlParam).entries()), _toConsumableArray(paramList.entries())));
        for (var i in excludeParams) {
            paramList.delete(excludeParams[i]);
        }
    }
    if (!action.startsWith('/')) {
        if (location.pathname.startsWith(Info.baseFile)) url = Info.baseFile + '/';else url = Info.rootPath;
    }
    url += action;
    if (paramList.size > 0) {
        var queryStr = buildQueryStr(paramList);
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
var getQueryParam = exports.getQueryParam = function getQueryParam(name) {
    return extractQueryStr(Info.urlParam).get(name);
};

/**
 * 解码HTML特殊字符
 * @param {string} str 待解码的字符串
 * @returns {string} 解码后的字符串
 */
var decodeHtmlSpecialChar = exports.decodeHtmlSpecialChar = function decodeHtmlSpecialChar(str) {
    if (!str.length) return '';
    return str.replace(/<br\s*\/?>/gi, '\n').replace(/&quot;/gi, '\"').replace(/&#39;/gi, '\'').replace(/&nbsp;/gi, ' ').replace(/&gt;/gi, '>').replace(/&lt;/gi, '<').replace(/&amp;/gi, '&');
};

/**
 * 去除HTML标签
 * @param html HTML代码
 * @returns {string} 去除HTML标签的文本
 */
var removeHtmlTag = exports.removeHtmlTag = function removeHtmlTag(html) {
    return html ? html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '') : '';
};

/**
 * 全选
 * @param {jQuery} $nodes 想要全选的节点的jQuery对象
 */
var selectAll = exports.selectAll = function selectAll($nodes) {
    $nodes.prop('checked', true);
};

/**
 * 反选
 * @param {jQuery} $nodes 想要反选的节点的jQuery对象
 */
var selectInverse = exports.selectInverse = function selectInverse($nodes) {
    $nodes.each(function () {
        var $this = $(this);
        $this.prop('checked', !$this.prop('checked'));
    });
};

/**
 * 显示字段验证消息
 * @param {jQuery} $node 验证字段的jQuery对象
 * @param {string} type 验证类型
 * @param {string} msg 验证消息
 */
var showValidationMsg = exports.showValidationMsg = function showValidationMsg($node, type) {
    var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (type === 'error') type = 'danger';
    $node.removeClass('form-control-success form-control-warning form-control-danger');
    var $parent = $node.parent();
    $parent.removeClass('has-success has-warning has-danger');
    if ($.inArray(type, ['success', 'warning', 'danger'] > -1)) {
        $node.addClass('form-control-' + type).parent().addClass('has-' + type);
    }
    var $feedback = $parent.find('.form-control-feedback');
    if (type === 'wait') {
        $feedback.html('<span class="text-muted"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> ' + msg + '</span>');
    } else {
        $feedback.text(msg);
    }
};

/**
 * 获取对象A在对象B中的相对补集
 * @param {Object} a 对象A
 * @param {Object} b 对象B
 * @returns {Object} 相对补集
 */
var getDifferenceSetOfObject = exports.getDifferenceSetOfObject = function getDifferenceSetOfObject(a, b) {
    var c = {};
    if ($.type(a) !== 'object' || $.type(b) !== 'object') return c;
    $.each(b, function (key, data) {
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
var deepEqual = exports.deepEqual = function deepEqual(a, b) {
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
var copyText = exports.copyText = function copyText($target) {
    var $source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (!('execCommand' in document) || !$target.length) return false;
    var copyText = $target.data('copy-text');
    if (copyText) {
        $target = $('<span class="text-hide">' + copyText + '</span>').insertAfter($target);
    }
    var s = window.getSelection();
    s.selectAllChildren($target.get(0));
    var result = document.execCommand('copy');
    s.removeAllRanges();
    if (copyText) $target.remove();
    if (result && $source) {
        var msg = $source.data('copy-msg');
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
var inFollowOrBlockUserList = exports.inFollowOrBlockUserList = function inFollowOrBlockUserList(name, list) {
    return list.findIndex(function (data) {
        return data.name && data.name == name;
    });
};

/**
 * 检测浏览器是否为Opera
 * @returns {boolean} 是否为Opera
 */
var isOpera = exports.isOpera = function isOpera() {
    return typeof window.opera !== 'undefined';
};

/**
 * 检测浏览器是否为Edge
 * @returns {boolean} 是否为Edge
 */
var isEdge = exports.isEdge = function isEdge() {
    return navigator.appVersion && navigator.appVersion.includes('Edge');
};

/**
 * HTML转义编码
 * @param {string} str 待编码的字符串
 * @returns {string} 编码后的字符串
 */
var htmlEncode = exports.htmlEncode = function htmlEncode(str) {
    if (!str.length) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\'/g, '&#39;').replace(/\"/g, '&quot;').replace(/\n/g, '<br>');
};

/**
 * HTML转义解码
 * @param {string} str 待解码的字符串
 * @returns {string} 解码后的字符串
 */
var htmlDecode = exports.htmlDecode = function htmlDecode(str) {
    if (!str.length) return '';
    return str.replace(/<br\s*\/?>/gi, '\n').replace(/&quot;/gi, '\"').replace(/&#39;/gi, '\'').replace(/&nbsp;/gi, ' ').replace(/&gt;/gi, '>').replace(/&lt;/gi, '<').replace(/&amp;/gi, '&');
};

/**
 * 获取URL中的指定参数
 * @param {string} name 参数名称
 * @returns {?string} URL中的指定参数
 */
var getUrlParam = exports.getUrlParam = function getUrlParam(name) {
    var regex = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var matches = Info.urlParam.match(regex);
    if (matches) return decodeURI(matches[2]);else return null;
};

/**
 * 去除不配对的BBCode
 * @param {string} content 引用内容
 * @returns {string} 去除了不配对BBCode的内容
 */
var removeUnpairedBBCodeContent = exports.removeUnpairedBBCodeContent = function removeUnpairedBBCodeContent(content) {
    var startCodeList = [/\[color=.+?\]/g, /\[backcolor=.+?\]/g, /\[size=.+?\]/g, /\[font=.+?\]/g, /\[align=.+?\]/g, /\[b\]/g, /\[i\]/g, /\[u\]/g, /\[strike\]/g, /\[sup\]/g, /\[sub\]/g];
    var endCodeList = [/\[\/color\]/g, /\[\/backcolor\]/g, /\[\/size\]/g, /\[\/font\]/g, /\[\/align\]/g, /\[\/b\]/g, /\[\/i\]/g, /\[\/u\]/g, /\[\/strike\]/g, /\[\/sup\]/g, /\[\/sub\]/g];
    for (var i = 0; i < startCodeList.length; i++) {
        var startMatches = content.match(startCodeList[i]);
        var endMatches = content.match(endCodeList[i]);
        var startMatchesNum = startMatches ? startMatches.length : 0;
        var endMatchesNum = endMatches ? endMatches.length : 0;
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
var getFloorUserName = exports.getFloorUserName = function getFloorUserName(name) {
    name = $.trim(name);
    if (name.includes(' ')) {
        var arr = name.split(' ');
        return arr.length === 2 ? arr[1] : name;
    } else {
        return name;
    }
};

},{}]},{},[1])

