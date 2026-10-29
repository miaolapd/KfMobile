"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name2 in all)
      __defProp(target, name2, { get: all[name2], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // public/static/src/js/module/util.js
  var util_exports = {};
  __export(util_exports, {
    addCode: () => addCode,
    buildQueryStr: () => buildQueryStr,
    copyText: () => copyText,
    decodeHtmlSpecialChar: () => decodeHtmlSpecialChar,
    deepEqual: () => deepEqual,
    deleteCookie: () => deleteCookie,
    extractQueryStr: () => extractQueryStr,
    getCookie: () => getCookie,
    getDate: () => getDate,
    getDifferenceSetOfObject: () => getDifferenceSetOfObject,
    getFloorUserName: () => getFloorUserName,
    getHostNameUrl: () => getHostNameUrl,
    getQueryParam: () => getQueryParam,
    getSelText: () => getSelText,
    getStrByteLen: () => getStrByteLen,
    getUrlParam: () => getUrlParam,
    htmlDecode: () => htmlDecode,
    htmlEncode: () => htmlEncode,
    inFollowOrBlockUserList: () => inFollowOrBlockUserList,
    isEdge: () => isEdge,
    isOpera: () => isOpera,
    makeUrl: () => makeUrl,
    removeHtmlTag: () => removeHtmlTag,
    removeUnpairedBBCodeContent: () => removeUnpairedBBCodeContent,
    selectAll: () => selectAll,
    selectInverse: () => selectInverse,
    setCookie: () => setCookie,
    showValidationMsg: () => showValidationMsg
  });
  var setCookie, getCookie, deleteCookie, getDate, getStrByteLen, getHostNameUrl, addCode, getSelText, extractQueryStr, buildQueryStr, makeUrl, getQueryParam, decodeHtmlSpecialChar, removeHtmlTag, selectAll, selectInverse, showValidationMsg, getDifferenceSetOfObject, deepEqual, copyText, inFollowOrBlockUserList, isOpera, isEdge, htmlEncode, htmlDecode, getUrlParam, removeUnpairedBBCodeContent, getFloorUserName;
  var init_util = __esm({
    "public/static/src/js/module/util.js"() {
      "use strict";
      setCookie = function(name2, value, date = null, prefix = Info.uid + "_" + Const.storagePrefix) {
        document.cookie = `${prefix}${name2}=${encodeURI(value)}${!date ? "" : ";expires=" + date.toUTCString()};path=/;`;
      };
      getCookie = function(name2, prefix = Info.uid + "_" + Const.storagePrefix) {
        let regex2 = new RegExp(`(^| )${prefix}${name2}=([^;]*)(;|$)`);
        let matches = document.cookie.match(regex2);
        if (!matches) return null;
        else return decodeURI(matches[2]);
      };
      deleteCookie = function(name2, prefix = Info.uid + "_" + Const.storagePrefix) {
        document.cookie = `${prefix}${name2}=;expires=${getDate("-1d").toUTCString()};path=/;`;
      };
      getDate = function(value) {
        let date = /* @__PURE__ */ new Date();
        let matches = /^(-|\+)?(\d+)([a-zA-Z]{1,2})$/.exec(value);
        if (!matches) return null;
        let flag2 = typeof matches[1] === "undefined" ? 0 : matches[1] === "+" ? 1 : -1;
        let increment = flag2 === -1 ? -parseInt(matches[2]) : parseInt(matches[2]);
        let unit = matches[3];
        switch (unit) {
          case "Y":
            date.setFullYear(increment);
            break;
          case "y":
            date.setFullYear(flag2 === 0 ? increment : date.getFullYear() + increment);
            break;
          case "M":
            date.setMonth(flag2 === 0 ? increment : date.getMonth() + increment);
            break;
          case "d":
            date.setDate(flag2 === 0 ? increment : date.getDate() + increment);
            break;
          case "h":
            date.setHours(flag2 === 0 ? increment : date.getHours() + increment);
            break;
          case "m":
            date.setMinutes(flag2 === 0 ? increment : date.getMinutes() + increment);
            break;
          case "s":
            date.setSeconds(flag2 === 0 ? increment : date.getSeconds() + increment);
            break;
          case "ms":
            date.setMilliseconds(flag2 === 0 ? increment : date.getMilliseconds() + increment);
            break;
          default:
            return null;
        }
        return date;
      };
      getStrByteLen = function(str) {
        let len = 0;
        let cLen = 2;
        for (let i = 0; i < str.length; i++) {
          len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? cLen : 1;
        }
        return len;
      };
      getHostNameUrl = function() {
        return location.protocol + "//" + location.host;
      };
      addCode = function(textArea, code, selText = "") {
        let startPos = selText === "" ? code.indexOf("]") + 1 : code.indexOf(selText);
        if (typeof textArea.selectionStart !== "undefined") {
          let prePos = textArea.selectionStart;
          textArea.value = textArea.value.substring(0, prePos) + code + textArea.value.substring(textArea.selectionEnd);
          textArea.selectionStart = prePos + startPos;
          textArea.selectionEnd = prePos + startPos + selText.length;
        } else {
          textArea.value += code;
        }
      };
      getSelText = function(textArea) {
        return textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
      };
      extractQueryStr = function(str) {
        let params = /* @__PURE__ */ new Map();
        for (let param of str.split("&")) {
          if (!param) continue;
          let [key, value] = param.split("=");
          params.set(key, typeof value !== "undefined" ? value : "");
        }
        return params;
      };
      buildQueryStr = function(map) {
        let queryStr = "";
        for (let [key, value] of map) {
          if (Info.urlType === 2) {
            queryStr += (queryStr ? "&" : "") + key + "=" + value;
          } else {
            queryStr += (queryStr ? "/" : "") + key + "/" + value;
          }
        }
        return queryStr;
      };
      makeUrl = function(action, param = "", includeOtherParam = false, excludeParams = []) {
        let url = "";
        let paramList = extractQueryStr(param);
        if (includeOtherParam) {
          paramList = new Map([...extractQueryStr(Info.urlParam).entries(), ...paramList.entries()]);
          for (let i in excludeParams) {
            paramList.delete(excludeParams[i]);
          }
        }
        if (!action.startsWith("/")) {
          if (location.pathname.startsWith(Info.baseFile)) url = Info.baseFile + "/";
          else url = Info.rootPath;
        }
        url += action;
        if (paramList.size > 0) {
          let queryStr = buildQueryStr(paramList);
          if (queryStr) {
            url += (Info.urlType === 2 ? "?" : "/") + queryStr;
          }
        }
        return url;
      };
      getQueryParam = function(name2) {
        return extractQueryStr(Info.urlParam).get(name2);
      };
      decodeHtmlSpecialChar = function(str) {
        if (!str.length) return "";
        return str.replace(/<br\s*\/?>/gi, "\n").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&nbsp;/gi, " ").replace(/&gt;/gi, ">").replace(/&lt;/gi, "<").replace(/&amp;/gi, "&");
      };
      removeHtmlTag = (html) => html ? html.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "") : "";
      selectAll = function($nodes) {
        $nodes.prop("checked", true);
      };
      selectInverse = function($nodes) {
        $nodes.each(function() {
          let $this2 = $(this);
          $this2.prop("checked", !$this2.prop("checked"));
        });
      };
      showValidationMsg = function($node, type, msg = "") {
        if (type === "error") type = "danger";
        $node.removeClass("form-control-success form-control-warning form-control-danger");
        let $parent = $node.parent();
        $parent.removeClass("has-success has-warning has-danger");
        if ($.inArray(type, ["success", "warning", "danger"] > -1)) {
          $node.addClass("form-control-" + type).parent().addClass("has-" + type);
        }
        let $feedback = $parent.find(".form-control-feedback");
        if (type === "wait") {
          $feedback.html(`<span class="text-muted"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> ${msg}</span>`);
        } else {
          $feedback.text(msg);
        }
      };
      getDifferenceSetOfObject = function(a, b) {
        let c = {};
        if ($.type(a) !== "object" || $.type(b) !== "object") return c;
        $.each(b, (key, data) => {
          if (key in a) {
            if (!deepEqual(a[key], data)) c[key] = data;
          }
        });
        return c;
      };
      deepEqual = function(a, b) {
        if (a === b) return true;
        if ($.type(a) !== $.type(b)) return false;
        if (typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b)) return true;
        if ($.isArray(a) && $.isArray(b) || $.type(a) === "object" && $.type(b) === "object") {
          if (a.length !== b.length) return false;
          for (var i in $.extend($.isArray(a) ? [] : {}, a, b)) {
            if (typeof a[i] === "undefined" || typeof b[i] === "undefined") return false;
            if (!deepEqual(a[i], b[i])) return false;
          }
          return true;
        }
        return false;
      };
      copyText = function($target, $source = null) {
        if (!("execCommand" in document) || !$target.length) return false;
        let copyText2 = $target.data("copy-text");
        if (copyText2) {
          $target = $(`<span class="text-hide">${copyText2}</span>`).insertAfter($target);
        }
        let s = window.getSelection();
        s.selectAllChildren($target.get(0));
        let result = document.execCommand("copy");
        s.removeAllRanges();
        if (copyText2) $target.remove();
        if (result && $source) {
          let msg = $source.data("copy-msg");
          $source.attr("title", msg ? msg : "\u5DF2\u590D\u5236").on("hidden.bs.tooltip", function() {
            $(this).tooltip("dispose");
          }).tooltip("show");
        }
        return result;
      };
      inFollowOrBlockUserList = (name2, list) => list.findIndex((data) => data.name && data.name == name2);
      isOpera = () => typeof window.opera !== "undefined";
      isEdge = () => navigator.appVersion && navigator.appVersion.includes("Edge");
      htmlEncode = function(str) {
        if (!str.length) return "";
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\n/g, "<br>");
      };
      htmlDecode = function(str) {
        if (!str.length) return "";
        return str.replace(/<br\s*\/?>/gi, "\n").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&nbsp;/gi, " ").replace(/&gt;/gi, ">").replace(/&lt;/gi, "<").replace(/&amp;/gi, "&");
      };
      getUrlParam = function(name2) {
        let regex2 = new RegExp("(^|&)" + name2 + "=([^&]*)(&|$)");
        let matches = Info.urlParam.match(regex2);
        if (matches) return decodeURI(matches[2]);
        else return null;
      };
      removeUnpairedBBCodeContent = function(content) {
        let startCodeList = [
          /\[color=.+?\]/g,
          /\[backcolor=.+?\]/g,
          /\[size=.+?\]/g,
          /\[font=.+?\]/g,
          /\[align=.+?\]/g,
          /\[b\]/g,
          /\[i\]/g,
          /\[u\]/g,
          /\[strike\]/g,
          /\[sup\]/g,
          /\[sub\]/g
        ];
        let endCodeList = [
          /\[\/color\]/g,
          /\[\/backcolor\]/g,
          /\[\/size\]/g,
          /\[\/font\]/g,
          /\[\/align\]/g,
          /\[\/b\]/g,
          /\[\/i\]/g,
          /\[\/u\]/g,
          /\[\/strike\]/g,
          /\[\/sup\]/g,
          /\[\/sub\]/g
        ];
        for (let i = 0; i < startCodeList.length; i++) {
          let startMatches = content.match(startCodeList[i]);
          let endMatches = content.match(endCodeList[i]);
          let startMatchesNum = startMatches ? startMatches.length : 0;
          let endMatchesNum = endMatches ? endMatches.length : 0;
          if (startMatchesNum !== endMatchesNum) {
            content = content.replace(startCodeList[i], "").replace(endCodeList[i], "");
          }
        }
        return content;
      };
      getFloorUserName = function(name2) {
        name2 = $.trim(name2);
        if (name2.includes(" ")) {
          let arr = name2.split(" ");
          return arr.length === 2 ? arr[1] : name2;
        } else {
          return name2;
        }
      };
    }
  });

  // public/static/src/js/module/config.js
  var config_exports = {};
  __export(config_exports, {
    Config: () => Config2,
    clear: () => clear,
    init: () => init,
    normalize: () => normalize,
    read: () => read,
    write: () => write
  });
  var name, Config2, init, read, write, clear, normalize;
  var init_config = __esm({
    "public/static/src/js/module/config.js"() {
      "use strict";
      init_util();
      name = "kf_config";
      Config2 = {
        // 当前激活的最新回复面板
        activeNewReplyPanel: "#newReplyPanel1",
        // 当前激活的最新发表面板
        activeNewPublishPanel: "#newPublishPanel1",
        // 当前激活的其它帖子面板
        activeNewExtraPanel: "#newExtraPanel1",
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
        customCssContent: "",
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
      init = function() {
        window.Config = $.extend(true, {}, Config2);
        read();
      };
      read = function() {
        let options = localStorage[name];
        if (!options) return;
        try {
          options = JSON.parse(options);
        } catch (ex) {
          return;
        }
        if (!options || $.type(options) !== "object" || $.isEmptyObject(options)) return;
        options = normalize(options);
        window.Config = $.extend(true, {}, Config2, options);
      };
      write = function() {
        let options = getDifferenceSetOfObject(Config2, window.Config);
        localStorage[name] = JSON.stringify(options);
      };
      clear = function() {
        localStorage.removeItem(name);
      };
      normalize = function(options) {
        let settings = {};
        if ($.type(options) !== "object") return settings;
        for (let [key, value] of Object.entries(options)) {
          if (key in Config2 && $.type(value) === $.type(Config2[key])) {
            settings[key] = value;
          }
        }
        return settings;
      };
    }
  });

  // public/static/src/js/module/const.js
  var const_exports = {};
  __export(const_exports, {
    default: () => const_default
  });
  var storagePrefix, Const2, const_default;
  var init_const = __esm({
    "public/static/src/js/module/const.js"() {
      "use strict";
      storagePrefix = "kf_";
      Const2 = {
        // at提醒时间的Cookie有效期（天）
        atTipsTimeExpires: 3,
        // 页面背景样式的Cookie有效期（天）
        bgStyleExpires: 365,
        // 通用存储数据名称前缀
        storagePrefix,
        // 存储多重引用数据的LocalStorage名称
        multiQuoteStorageName: storagePrefix + "multiQuote",
        // at提醒时间的Cookie名称
        atTipsTimeCookieName: "atTipsTime",
        // 上一次at提醒时间的Cookie名称
        prevAtTipsTimeCookieName: "prevAtTipsTime",
        // 页面背景样式的Cookie名称
        bgStyleCookieName: "bgStyle",
        // 常用版块列表
        commonForumList: [
          { fid: 106, name: "\u65B0\u4F5C\u52A8\u6001" },
          { fid: 41, name: "\u7F51\u76D8\u4E0B\u8F7D" },
          { fid: 16, name: "BT\u4E0B\u8F7D" },
          { fid: 52, name: "\u6E38\u620F\u8BA8\u8BBA" },
          { fid: 84, name: "\u52A8\u6F2B\u8BA8\u8BBA" },
          { fid: 67, name: "CG\u4E0B\u8F7D" },
          { fid: 5, name: "\u81EA\u7531\u8BA8\u8BBA" },
          { fid: 56, name: "\u4E2A\u4EBA\u65E5\u8BB0" },
          { fid: 57, name: "\u540C\u4EBA\u6F2B\u672C" }
        ],
        // 可用版块列表
        availableForumList: [
          { fid: 106, name: "\u65B0\u4F5C\u52A8\u6001" },
          { fid: 52, name: "\u6E38\u620F\u8BA8\u8BBA" },
          { fid: 41, name: "\u7F51\u76D8\u4E0B\u8F7D" },
          { fid: 67, name: "CG\u4E0B\u8F7D" },
          { fid: 16, name: "BT\u4E0B\u8F7D" },
          { fid: 9, name: "\u65E0\u9650\u8D44\u6E90" },
          { fid: 102, name: "\u6E38\u620F\u63A8\u8350" },
          { fid: 24, name: "\u7591\u96BE\u4E92\u52A9" },
          { fid: 57, name: "\u540C\u4EBA\u6F2B\u672C" },
          { fid: 84, name: "\u52A8\u6F2B\u8BA8\u8BBA" },
          { fid: 92, name: "\u52A8\u753B\u4E0B\u8F7D" },
          { fid: 127, name: "\u6F2B\u753B\u5C0F\u8BF4" },
          { fid: 68, name: "ACG\u97F3\u4E50" },
          { fid: 163, name: "LIVE\u8D44\u6E90" },
          { fid: 94, name: "\u539F\u521B\u7ED8\u753B" },
          { fid: 87, name: "\u5B9E\u7269\u4EA4\u6D41" },
          { fid: 86, name: "\u7535\u5B50\u4EA7\u54C1" },
          { fid: 115, name: "\u6587\u5B57\u4F5C\u54C1" },
          { fid: 96, name: "\u56FE\u7247\u6765\u6E90" },
          { fid: 36, name: "\u5BFB\u6C42\u8D44\u6E90" },
          { fid: 5, name: "\u81EA\u7531\u8BA8\u8BBA" },
          { fid: 56, name: "\u4E2A\u4EBA\u65E5\u8BB0" },
          { fid: 4, name: "\u610F\u89C1\u6295\u8BC9" },
          { fid: 93, name: "\u5185\u90E8\u7BA1\u7406" },
          { fid: 125, name: "\u6C34\u697C\u6797\u7ACB" },
          { fid: 181, name: "\u79C1\u4EBA\u65E5\u8BB0" },
          { fid: 98, name: "\u65E5\u672C\u8BED\u7248" },
          { fid: 99, name: "\u610F\u898B\u7BB1" },
          { fid: 112, name: "\u63B2\u793A\u677F" },
          { fid: 100, name: "\u5275\u4F5C\u611F\u60F3" }
        ]
      };
      const_default = Const2;
    }
  });

  // public/static/src/js/module/msg.js
  var msg_exports = {};
  __export(msg_exports, {
    destroy: () => destroy,
    hide: () => hide,
    remove: () => remove,
    show: () => show,
    wait: () => wait
  });
  var show, wait, hide, remove, destroy;
  var init_msg = __esm({
    "public/static/src/js/module/msg.js"() {
      "use strict";
      show = function(options, duration) {
        let settings = {
          msg: "",
          duration: Config.defShowMsgDuration,
          clickable: true,
          preventable: false
        };
        if ($.type(options) === "object") {
          $.extend(settings, options);
        } else {
          settings.msg = options;
          settings.duration = typeof duration === "undefined" ? Config.defShowMsgDuration : duration;
        }
        let $container = $(".msg-container");
        let isFirst = $container.length === 0;
        if (!isFirst && !$(".mask").length) {
          if ($container.height() >= $(window).height() * 0.8) {
            destroy();
            isFirst = true;
          }
        }
        if (settings.preventable && !$(".mask").length) {
          $('<div class="mask"></div>').appendTo("body");
        }
        if (isFirst) {
          $container = $('<div class="container msg-container"></div>').appendTo("body");
        }
        let $msg = $(`<div class="msg">${settings.msg}</div>`).appendTo($container);
        $msg.on("click", ".stop-action", function(e) {
          e.preventDefault();
          $(this).text("\u6B63\u5728\u505C\u6B62&hellip;").closest(".msg").data("stop", true);
        });
        if (settings.clickable) {
          $msg.css("cursor", "pointer").click(function() {
            hide($(this));
          }).find("a").click(function(e) {
            e.stopPropagation();
          });
        }
        if (settings.preventable) $msg.attr("preventable", true);
        $msg.slideDown("normal");
        if (settings.duration > -1) {
          setTimeout(() => {
            hide($msg);
          }, settings.duration * 1e3);
        }
        return $msg;
      };
      wait = function(msg, preventable = true) {
        msg += '<i class="fa fa-spinner fa-spin fa-lg fa-fw ml-3" aria-label="\u7B49\u5F85\u4E2D" aria-hidden="true"></i>';
        return show({ msg, duration: -1, clickable: false, preventable });
      };
      hide = function($msg) {
        $msg.slideUp("normal", function() {
          remove($(this));
        });
      };
      remove = function($msg) {
        let $container = $msg.parent();
        $msg.remove();
        if (!$(".msg").length) {
          $container.remove();
          $(".mask").remove();
        } else if (!$(".msg[preventable]").length) {
          $(".mask").remove();
        }
      };
      destroy = function() {
        $(".msg-container").remove();
        $(".mask").remove();
      };
    }
  });

  // public/static/src/js/module/dialog.js
  var dialog_exports = {};
  __export(dialog_exports, {
    close: () => close,
    create: () => create,
    resize: () => resize,
    show: () => show2
  });
  var create, show2, resize, close;
  var init_dialog = __esm({
    "public/static/src/js/module/dialog.js"() {
      "use strict";
      init_util();
      create = function(id, title2, bodyContent2, footerContent2 = "") {
        let html = `
<form>
<div class="dialog" id="${id}" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="${id}Title">
  <div class="container dialog-content" role="document">
    <div class="dialog-header">
      <h5 class="dialog-title" id="${id}Title">${title2}</h5>
      <button class="close" data-dismiss="dialog" type="button" aria-label="\u5173\u95ED">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="dialog-body">${bodyContent2}</div>
    <div class="dialog-footer" ${!footerContent2 ? "hidden" : ""}>${footerContent2}</div>
  </div>
</div>
</form>`;
        let $dialog2 = $(html).appendTo("body");
        $dialog2.on("click", '[data-dismiss="dialog"]', () => close(id)).on("click", ".tips", () => false).on("click", ".disabled-link", () => false).on("click", ".dialog", function(e) {
          if ($(e.target).hasClass("dialog")) {
            close(id);
          }
        }).keydown(function(e) {
          if (e.keyCode === 27) {
            return close(id);
          }
        }).find('legend [type="checkbox"]').click(function() {
          let $this2 = $(this);
          let checked = $this2.prop("checked");
          if (isOpera() || isEdge())
            $this2.closest("fieldset").find("input, select, textarea, button").not("legend input").prop("disabled", !checked);
          else $this2.closest("fieldset").prop("disabled", !checked);
        }).end().find("input[data-disabled]").click(function() {
          let $this2 = $(this);
          let checked = $this2.prop("checked");
          $($this2.data("disabled")).each(function() {
            let $this3 = $(this);
            if ($this3.is("a")) {
              if (checked) $this3.removeClass("disabled-link");
              else $this3.addClass("disabled-link");
            } else {
              $this3.prop("disabled", !checked);
            }
          });
        }).end().find('[data-toggle="tooltip"]').tooltip({ "container": "body" });
        $(window).on("resize." + id, () => resize(id));
        return $dialog2;
      };
      show2 = function(id) {
        let $dialog2 = $("#" + id);
        if (!$dialog2.length) return;
        $dialog2.find('legend [type="checkbox"]').each(function() {
          $(this).triggerHandler("click");
        }).end().find("input[data-disabled]").each(function() {
          $(this).triggerHandler("click");
        });
        $dialog2.fadeIn("normal").find(".close:first").focus();
        resize(id);
        $("body").addClass("modal-open");
      };
      resize = function(id) {
        let $dialog2 = $("#" + id);
        $dialog2.find(".dialog-body").css("max-height", $(window).height() - $dialog2.find(".dialog-header").outerHeight() - $dialog2.find(".dialog-footer").outerHeight());
      };
      close = function(id) {
        $("#" + id).fadeOut("normal", function() {
          $(this).parent().remove();
          if (!$(".dialog").length) {
            $("body").removeClass("modal-open");
          }
        });
        $(window).off("resize." + id);
        return false;
      };
    }
  });

  // public/static/src/js/module/script.js
  var script_exports = {};
  __export(script_exports, {
    getScriptMeta: () => getScriptMeta,
    handleInstallScriptLink: () => handleInstallScriptLink,
    runCmd: () => runCmd,
    runCustomScript: () => runCustomScript,
    showDialog: () => showDialog
  });
  var defScriptName, metaRegex, runCmd, runCustomScript, getScriptMeta, showDialog, handleInstallScriptLink;
  var init_script = __esm({
    "public/static/src/js/module/script.js"() {
      "use strict";
      init_util();
      init_dialog();
      init_config();
      defScriptName = "\u672A\u547D\u540D\u811A\u672C";
      metaRegex = /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i;
      runCmd = function(cmd, isOutput = false) {
        let isError = false;
        let response = "";
        try {
          response = eval(cmd);
          if (isOutput) console.log(response);
        } catch (ex) {
          isError = true;
          response = ex;
          console.log(ex);
        }
        return { isError, response: String(response) };
      };
      runCustomScript = function(type = "end") {
        for (let { enabled, trigger, content } of Config.customScriptList) {
          if (enabled && trigger === type && content) {
            runCmd(content);
          }
        }
      };
      getScriptMeta = function(content) {
        let meta = {
          name: defScriptName,
          version: "",
          trigger: "end",
          homepage: "",
          author: ""
        };
        let matches = metaRegex.exec(content);
        if (!matches) return meta;
        let metaContent = matches[1];
        matches = /@name[ \t]+(.*)/i.exec(metaContent);
        if (matches) meta.name = matches[1];
        matches = /@version[ \t]+(.*)/i.exec(metaContent);
        if (matches) meta.version = matches[1];
        matches = /@trigger[ \t]+(.*)/i.exec(metaContent);
        if (matches) meta.trigger = matches[1].toLowerCase() === "start" ? "start" : "end";
        matches = /@homepage[ \t]+(.*)/i.exec(metaContent);
        if (matches) meta.homepage = matches[1];
        matches = /@author[ \t]+(.*)/i.exec(metaContent);
        if (matches) meta.author = matches[1];
        return meta;
      };
      showDialog = function(showIndex = null) {
        const dialogName2 = "customScriptDialog";
        if ($("#" + dialogName2).length > 0) return;
        read();
        let bodyContent2 = `
<div class="d-flex mb-3">
  <div class="btn-group btn-group-sm">
    <button class="btn btn-success" name="add" type="button">\u6DFB\u52A0\u811A\u672C</button>
    <button class="btn btn-secondary" name="insertSample" type="button">\u63D2\u5165\u8303\u4F8B</button>
  </div>
  
  <div class="btn-group btn-group-sm ml-auto">
    <a class="btn btn-link" href="${window.Info.rootPath}read/682170/sf/6d7" target="_blank">\u811A\u672C\u6536\u96C6\u8D34</a>
  </div>
</div>
<div id="customScriptList"></div>
`;
        let footerContent2 = `
<button class="btn btn-warning mr-auto" name="openImOrExCustomScriptDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>
<button class="btn btn-danger" name="clear" type="button">\u6E05\u7A7A</button>`;
        let $dialog2 = create(dialogName2, "\u81EA\u5B9A\u4E49\u811A\u672C", bodyContent2, footerContent2);
        let $customScriptList = $dialog2.find("#customScriptList");
        $dialog2.submit(function(e) {
          e.preventDefault();
          Config.customScriptList = [];
          $customScriptList.find('textarea[name="customScriptContent"]').each(function() {
            let $this2 = $(this);
            let content = $this2.val();
            if (!$.trim(content)) return;
            let enabled = $this2.closest(".custom-script-container").find('[name="enabled"]').prop("checked");
            Config.customScriptList.push($.extend(getScriptMeta(content), { enabled, content }));
          });
          write();
          close(dialogName2);
          alert("\u81EA\u5B9A\u4E49\u811A\u672C\u4FEE\u6539\u6210\u529F\n\uFF08\u9700\u5237\u65B0\u9875\u9762\u540E\u624D\u53EF\u751F\u6548\uFF09");
        }).end().find('[name="clear"]').click(function() {
          if (confirm("\u662F\u5426\u6E05\u7A7A\u6240\u6709\u811A\u672C\uFF1F")) {
            $customScriptList.html("");
            resize(dialogName2);
          }
        });
        const addCustomScript = function({
          enabled = true,
          name: name2 = defScriptName,
          version = "",
          homepage = "",
          trigger = "end",
          content = ""
        } = {}) {
          let count = $customScriptList.find(".custom-script-container").length;
          $customScriptList.append(`
<div class="card custom-script-container">
  <div class="card-header d-flex p-1" id="customScriptHeader${count}">
    <div class="form-check form-check-inline mx-1">
      <input class="form-check-input position-static" name="enabled" type="checkbox" ${enabled ? "checked" : ""} title="\u662F\u5426\u542F\u7528" aria-label="\u662F\u5426\u542F\u7528">
    </div>

    <button class="btn btn-link btn-sm mx-1 px-0 text-truncate custom-script-name" data-toggle="collapse" data-target="#customScriptContent${count}" type="button"
            title="${name2}" aria-expanded="true" aria-controls="customScriptContent${count}">${name2}</button>

    <div class="ml-auto col-auto px-0">
      <a class="badge badge-primary align-middle custom-script-homepage" ${!homepage ? "hidden" : ""}
         href="${homepage.startsWith("http") ? "" : Info.rootPath}${homepage}" target="_blank">\u4E3B\u9875</a>
      <span class="badge badge-warning align-middle custom-script-version" ${!version ? "hidden" : ""}>${version}</span>
      <span class="badge badge-${trigger === "start" ? "danger" : "info"} align-middle custom-script-trigger" title="\u811A\u672C\u6267\u884C\u65F6\u673A">${trigger === "start" ? "\u5F00" : "\u7ED3"}</span>
      <button class="btn btn-link btn-sm text-danger" name="delete" type="button">\u5220</button>
    </div>
  </div>

  <div class="collapse custom-script-content" id="customScriptContent${count}" aria-labelledby="customScriptHeader${count}" data-parent="#customScriptList">
    <div class="card-body p-0">
      <textarea class="form-control border-0 font-size-sm font-monospace" name="customScriptContent" rows="12" style="white-space: pre;" wrap="off">${content}</textarea>
    </div>
  </div>
</div>
`);
        };
        $dialog2.find('[name="add"]').click(function() {
          $customScriptList.find(".custom-script-content.show").collapse();
          addCustomScript();
          $customScriptList.find(".custom-script-content:last").collapse();
        }).end().find('[name="insertSample"]').click(function() {
          let $content = $customScriptList.find('.custom-script-content.show textarea[name="customScriptContent"]');
          $content.val(`
// ==UserScript==
// @name        ${defScriptName}
// @version     1.0
// @author      ${Info.userName}
// @trigger     end
// @homepage    read/682170/spid/14034074/sf/6d7
// @description \u8FD9\u662F\u4E00\u4E2A\u672A\u547D\u540D\u811A\u672C
// ==/UserScript==
`.trim() + "\n" + $content.val()).focus();
        }).end().find('[name="openImOrExCustomScriptDialog"]').click(function() {
          Public.showCommonImportOrExportConfigDialog("\u81EA\u5B9A\u4E49\u811A\u672C", "customScriptList");
        });
        $customScriptList.on("click", '[name="delete"]', function() {
          if (!confirm("\u662F\u5426\u5220\u9664\u6B64\u811A\u672C\uFF1F")) return;
          $(this).closest(".custom-script-container").remove();
        }).on("change", 'textarea[name="customScriptContent"]', function() {
          let $this2 = $(this);
          let { name: name2, version, homepage, trigger } = getScriptMeta($this2.val());
          let $container = $this2.closest(".custom-script-container");
          $container.find(".custom-script-name").text(name2 ? name2 : defScriptName);
          $container.find(".custom-script-homepage").attr("href", homepage ? homepage : "").prop("hidden", !homepage);
          $container.find(".custom-script-version").text(version).prop("hidden", !version);
          $container.find(".custom-script-trigger").text(trigger === "start" ? "\u5F00" : "\u7ED3").removeClass(`badge-${trigger === "start" ? "info" : "danger"}`).addClass(`badge-${trigger === "start" ? "danger" : "info"}`);
        });
        for (let data of Config.customScriptList) {
          addCustomScript(data);
        }
        show2(dialogName2);
        if (typeof showIndex === "number") {
          $customScriptList.find("#customScriptContent" + showIndex).collapse();
        }
      };
      handleInstallScriptLink = function() {
        $("main").on("click", 'a[href$="#install-mobile-script"]', function(e) {
          e.preventDefault();
          let $this2 = $(this);
          let $area = $this2.nextAll(".code-area").eq(0).find("pre");
          if (!$area.length) return;
          let content = htmlDecode($area.html().replace(/<legend>.+?<\/legend>/i, "")).trim();
          if (!metaRegex.test(content)) return;
          read();
          let meta = getScriptMeta(content);
          let index = Config.customScriptList.findIndex((script2) => script2.name === meta.name && script2.author === meta.author);
          let isUpdate = index > -1;
          if (!confirm(`\u662F\u5426${isUpdate ? "\u66F4\u65B0" : "\u5B89\u88C5"}\u6B64\u811A\u672C\uFF1F`)) return;
          Config.customScriptEnabled = true;
          let script = $.extend(meta, { enabled: true, content });
          if (isUpdate) {
            Config.customScriptList[index] = script;
          } else {
            Config.customScriptList.push(script);
          }
          write();
          close("customScriptDialog");
          showDialog(index);
        }).on("click", 'a[href$="#install-script"]', function(e) {
          e.preventDefault();
          alert("\u65E0\u6CD5\u5B89\u88C5\u9002\u7528\u4E8E\u7535\u8111\u7248\u8BBA\u575B\u7684\u81EA\u5B9A\u4E49\u811A\u672C");
        });
      };
    }
  });

  // public/static/src/js/module/configDialog.js
  var show3, setMainConfigValue, getMainConfigValue, clearTmpData, showRunCommandDialog, showImportOrExportSettingDialog, showUserMemoDialog, showCustomCssDialog, showFollowUserDialog, showBlockUserDialog, showBlockThreadDialog;
  var init_configDialog = __esm({
    "public/static/src/js/module/configDialog.js"() {
      "use strict";
      init_util();
      init_const();
      init_dialog();
      init_config();
      init_script();
      init_public();
      show3 = function() {
        const dialogName2 = "configDialog";
        if ($("#" + dialogName2).length > 0) return;
        read();
        let bodyContent2 = `
<div class="btn-group-sm text-right mb-1">
  <a class="btn btn-link text-danger" data-name="clearTmpData" href="#">\u6E05\u9664\u4E34\u65F6\u6570\u636E</a>
  <a class="btn btn-link" data-name="openRunCommandDialog" href="#">\u8FD0\u884C\u547D\u4EE4</a>
</div>
<fieldset class="fieldset mb-3 py-2">
  <legend class="form-check">
    <input class="form-check-input" id="${dialogName2}_showSidebarBtnGroupEnabled" name="showSidebarBtnGroupEnabled" type="checkbox">
    <label class="form-check-label" for="${dialogName2}_showSidebarBtnGroupEnabled">\u663E\u793A\u4FA7\u8FB9\u680F\u6309\u94AE\u7EC4</label>
    <span class="tips" data-toggle="tooltip" title="\u663E\u793A\u4FA7\u8FB9\u680F\u6309\u94AE\u7EC4\uFF0C\u53EF\u5728\u4E0B\u65B9\u8BBE\u7F6E\u8981\u663E\u793A\u7684\u6309\u94AE">[?]</span>
  </legend>
  
  <div class="mb-2 d-sm-inline-block">
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName2}_showSidebarRollBtnEnabled" name="showSidebarRollBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName2}_showSidebarRollBtnEnabled">\u6EDA\u52A8\u5230\u9875\u9876/\u9875\u5E95</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName2}_showSidebarMainMenuBtnEnabled" name="showSidebarMainMenuBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName2}_showSidebarMainMenuBtnEnabled">\u4E3B\u83DC\u5355</label>
    </div>
  </div>
  
  <div class="mb-2 d-sm-inline-block">
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName2}_showSidebarForumListBtnEnabled" name="showSidebarForumListBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName2}_showSidebarForumListBtnEnabled">\u7248\u5757\u5217\u8868</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName2}_showSidebarSearchBtnEnabled" name="showSidebarSearchBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName2}_showSidebarSearchBtnEnabled">\u641C\u7D22</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName2}_showSidebarHomePageBtnEnabled" name="showSidebarHomePageBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName2}_showSidebarHomePageBtnEnabled">\u9996\u9875</label>
    </div>
  </div>
</fieldset>

<fieldset class="fieldset mb-3 py-2">
  <legend>\u4E3B\u9898\u9875\u9762\u76F8\u5173</legend>
  
  <div class="form-group mb-2">
    <label for="perPageFloorNum">\u4E3B\u9898\u6BCF\u9875\u697C\u5C42\u6570\u91CF</label>
    <select class="custom-select custom-select-sm w-auto" id="perPageFloorNum" name="perPageFloorNum">
      <option value="10">10</option><option value="20">20</option><option value="30">30</option>
    </select>
    <span class="tips" data-toggle="tooltip" title="\u4E3B\u9898\u9875\u9762\u4E2D\u6BCF\u9875\u7684\u697C\u5C42\u6570\u91CF\uFF08\u7528\u4E8E\u7535\u68AF\u76F4\u8FBE\u7B49\u529F\u80FD\uFF09\uFF0C\u5982\u679C\u4FEE\u6539\u4E86\u8BBA\u575B\u8BBE\u7F6E\u91CC\u7684\u201C\u6587\u7AE0\u5217\u8868\u6BCF\u9875\u4E2A\u6570\u201D\uFF0C\u8BF7\u5728\u6B64\u4FEE\u6539\u6210\u76F8\u540C\u7684\u6570\u76EE">[?]</span>
  </div>
  
  <div class="input-group mb-2">
    <div class="input-group-prepend">
      <span class="input-group-text">\u4E3B\u9898\u5185\u5BB9\u5B57\u4F53\u5927\u5C0F</span>
    </div>
    <input class="form-control" name="threadContentFontSize" data-toggle="tooltip" type="number" min="8" max="72"
           title="\u4E3B\u9898\u5185\u5BB9\u5B57\u4F53\u5927\u5C0F\uFF0C\u7559\u7A7A\u8868\u793A\u4F7F\u7528\u9ED8\u8BA4\u5927\u5C0F\uFF0C\u9ED8\u8BA4\u503C\uFF1A14px">
    <div class="input-group-append">
      <span class="input-group-text">px</span>
    </div>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName2}_userMemoEnabled" name="userMemoEnabled" type="checkbox" data-disabled="[data-name=openUserMemoDialog]">
    <label class="form-check-label" for="${dialogName2}_userMemoEnabled">\u663E\u793A\u7528\u6237\u5907\u6CE8</label>
    <span class="tips" data-toggle="tooltip" title="\u5728\u697C\u5C42\u5185\u7684\u7528\u6237\u540D\u65C1\u663E\u793A\u8BE5\u7528\u6237\u7684\u81EA\u5B9A\u4E49\u5907\u6CE8">[?]</span>
    <a class="ml-3" data-name="openUserMemoDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName2}_kfSmileEnhanceExtensionEnabled" name="kfSmileEnhanceExtensionEnabled" type="checkbox">
    <label class="form-check-label" for="${dialogName2}_kfSmileEnhanceExtensionEnabled">\u5F00\u542F\u7EEF\u6708\u8868\u60C5\u589E\u5F3A\u63D2\u4EF6</label>
    <span class="tips" data-toggle="tooltip" title="\u5728\u53D1\u5E16\u6846\u4E0A\u663E\u793A\u7EEF\u6708\u8868\u60C5\u589E\u5F3A\u63D2\u4EF6\uFF0C\u8BE5\u63D2\u4EF6\u7531eddie32\u5F00\u53D1">[?]</span>
  </div>
</fieldset>

<fieldset class="fieldset mb-3 py-2">
  <legend>\u5176\u5B83\u8BBE\u7F6E</legend>
  
  <div class="input-group mb-2">
    <div class="input-group-prepend">
      <span class="input-group-text">\u6D88\u606F\u663E\u793A\u65F6\u95F4</span>
    </div>
    <input class="form-control" name="defShowMsgDuration" data-toggle="tooltip" type="number" min="-1" required
           title="\u9ED8\u8BA4\u7684\u6D88\u606F\u663E\u793A\u65F6\u95F4\uFF08\u79D2\uFF09\uFF0C\u8BBE\u7F6E\u4E3A-1\u8868\u793A\u6C38\u4E45\u663E\u793A\uFF0C\u4F8B\uFF1A15">
    <div class="input-group-append">
      <span class="input-group-text">\u79D2</span>
    </div>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName2}_customCssEnabled" name="customCssEnabled" type="checkbox" data-disabled="[data-name=openCustomCssDialog]">
    <label class="form-check-label" for="${dialogName2}_customCssEnabled">\u6DFB\u52A0\u81EA\u5B9A\u4E49CSS</label>
    <span class="tips" data-toggle="tooltip" title="\u4E3A\u9875\u9762\u6DFB\u52A0\u81EA\u5B9A\u4E49\u7684CSS\u5185\u5BB9\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u586B\u5199\u81EA\u5B9A\u4E49\u7684CSS\u5185\u5BB9">[?]</span>
    <a class="ml-3" data-name="openCustomCssDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName2}_customScriptEnabled" name="customScriptEnabled" type="checkbox" data-disabled="[data-name=openCustomScriptDialog]">
    <label class="form-check-label" for="${dialogName2}_customScriptEnabled">\u6267\u884C\u81EA\u5B9A\u4E49\u811A\u672C</label>
    <span class="tips" data-toggle="tooltip" title="\u6267\u884C\u81EA\u5B9A\u4E49\u7684javascript\u811A\u672C\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u586B\u5165\u81EA\u5B9A\u4E49\u811A\u672C\u5185\u5BB9">[?]</span>
    <a class="ml-3" data-name="openCustomScriptDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName2}_adminMemberEnabled" name="adminMemberEnabled" type="checkbox">
    <label class="form-check-label" for="${dialogName2}_adminMemberEnabled">\u6211\u662F\u7BA1\u7406\u6210\u5458</label>
    <span class="tips" data-toggle="tooltip" title="\u7BA1\u7406\u6210\u5458\u53EF\u5F00\u542F\u6B64\u529F\u80FD\uFF0C\u52A9\u624B\u4F1A\u5F00\u542F\u90E8\u5206\u53EA\u6709\u7BA1\u7406\u6210\u5458\u624D\u80FD\u4F7F\u7528\u7684\u529F\u80FD\uFF0C\u975E\u7BA1\u7406\u6210\u5458\u5F00\u542F\u6B64\u529F\u80FD\u65E0\u6548">[?]</span>
  </div>
</fieldset>

<fieldset class="fieldset mb-3 py-2">
  <legend>\u5173\u6CE8\u548C\u5C4F\u853D</legend>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName2}_followUserEnabled" name="followUserEnabled" type="checkbox" data-disabled="[data-name=openFollowUserDialog]">
    <label class="form-check-label" for="${dialogName2}_followUserEnabled">\u5173\u6CE8\u7528\u6237</label>
    <span class="tips" data-toggle="tooltip" title="\u5F00\u542F\u5173\u6CE8\u7528\u6237\u7684\u529F\u80FD\uFF0C\u6240\u5173\u6CE8\u7684\u7528\u6237\u5C06\u88AB\u52A0\u6CE8\u8BB0\u53F7\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5173\u6CE8\u7528\u6237">[?]</span>
    <a class="ml-3" data-name="openFollowUserDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName2}_blockUserEnabled" name="blockUserEnabled" type="checkbox" data-disabled="[data-name=openBlockUserDialog]">
    <label class="form-check-label" for="${dialogName2}_blockUserEnabled">\u5C4F\u853D\u7528\u6237</label>
    <span class="tips" data-toggle="tooltip" title="\u5F00\u542F\u5C4F\u853D\u7528\u6237\u7684\u529F\u80FD\uFF0C\u4F60\u5C06\u770B\u4E0D\u89C1\u6240\u5C4F\u853D\u7528\u6237\u7684\u53D1\u8A00\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5C4F\u853D\u7528\u6237">[?]</span>
    <a class="ml-3" data-name="openBlockUserDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName2}_blockThreadEnabled" name="blockThreadEnabled" type="checkbox" data-disabled="[data-name=openBlockThreadDialog]">
    <label class="form-check-label" for="${dialogName2}_blockThreadEnabled">\u5C4F\u853D\u4E3B\u9898</label>
    <span class="tips" data-toggle="tooltip" title="\u5F00\u542F\u5C4F\u853D\u6807\u9898\u4E2D\u5305\u542B\u6307\u5B9A\u5173\u952E\u5B57\u7684\u4E3B\u9898\u7684\u529F\u80FD\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5C4F\u853D\u5173\u952E\u5B57">[?]</span>
    <a class="ml-3" data-name="openBlockThreadDialog" href="#" role="button">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>
  </div>
</fieldset>`;
        let footerContent2 = `
<button class="btn btn-warning mr-auto" name="openImportOrExportSettingDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>
<button class="btn btn-danger" name="reset" type="button">\u91CD\u7F6E</button>`;
        let $dialog2 = create(dialogName2, "\u52A9\u624B\u8BBE\u7F6E", bodyContent2, footerContent2);
        $dialog2.submit(function(e) {
          e.preventDefault();
          read();
          let options = getMainConfigValue($dialog2);
          options = normalize(options);
          $.extend(Config, options);
          write();
          close(dialogName2);
        }).on("click", 'a[data-name^="open"][href="#"]', function(e) {
          e.preventDefault();
          let $this2 = $(this);
          if ($this2.hasClass("disabled-link")) return;
          let name2 = $this2.data("name");
          if (name2 === "openRunCommandDialog") showRunCommandDialog();
          else if (name2 === "openUserMemoDialog") showUserMemoDialog();
          else if (name2 === "openCustomCssDialog") showCustomCssDialog();
          else if (name2 === "openCustomScriptDialog") showDialog();
          else if (name2 === "openFollowUserDialog") showFollowUserDialog();
          else if (name2 === "openBlockUserDialog") showBlockUserDialog();
          else if (name2 === "openBlockThreadDialog") showBlockThreadDialog();
        }).find('[data-name="clearTmpData"]').click(function(e) {
          e.preventDefault();
          let type = prompt(
            "\u53EF\u6E05\u9664\u4E0E\u52A9\u624B\u6709\u5173\u7684Cookies\u548C\u672C\u5730\u4E34\u65F6\u6570\u636E\uFF08\u4E0D\u5305\u62EC\u52A9\u624B\u8BBE\u7F6E\u548C\u65E5\u5FD7\uFF09\n\u8BF7\u586B\u5199\u6E05\u9664\u7C7B\u578B\uFF0C0\uFF1A\u5168\u90E8\u6E05\u9664\uFF1B1\uFF1A\u6E05\u9664Cookies\uFF1B2\uFF1A\u6E05\u9664\u672C\u5730\u4E34\u65F6\u6570\u636E",
            0
          );
          if (type === null) return;
          type = parseInt(type);
          if (!isNaN(type) && type >= 0) {
            clearTmpData(type);
            alert("\u7F13\u5B58\u5DF2\u6E05\u9664");
          }
        }).end().find('[name="reset"]').click(function() {
          if (confirm("\u662F\u5426\u91CD\u7F6E\u6240\u6709\u8BBE\u7F6E\uFF1F")) {
            clear();
            alert("\u8BBE\u7F6E\u5DF2\u91CD\u7F6E");
            close(dialogName2);
            location.reload();
          }
        }).end().find('[name="openImportOrExportSettingDialog"]').click(showImportOrExportSettingDialog);
        setMainConfigValue($dialog2);
        show2(dialogName2);
      };
      setMainConfigValue = function($dialog2) {
        $dialog2.find("input[name], select[name]").each(function() {
          let $this2 = $(this);
          let name2 = $this2.attr("name");
          if (name2 in Config) {
            if ($this2.is('[type="checkbox"]') && typeof Config[name2] === "boolean") $this2.prop("checked", Config[name2] === true);
            else $this2.val(Config[name2]);
          }
        });
        $dialog2.find('[name="threadContentFontSize"]').val(Config.threadContentFontSize > 0 ? Config.threadContentFontSize : "");
      };
      getMainConfigValue = function($dialog2) {
        let options = {};
        $dialog2.find("input[name], select[name]").each(function() {
          let $this2 = $(this);
          let name2 = $this2.attr("name");
          if (name2 in Config) {
            if ($this2.is('[type="checkbox"]') && typeof Config[name2] === "boolean")
              options[name2] = Boolean($this2.prop("checked"));
            else if (typeof Config[name2] === "number") {
              options[name2] = parseInt($this2.val());
              if (name2 === "threadContentFontSize" && isNaN(options[name2])) options[name2] = 0;
            } else options[name2] = $.trim($this2.val());
          }
        });
        return options;
      };
      clearTmpData = function(type = 0) {
        if (type === 0 || type === 1) {
          for (let key in const_default) {
            if (/CookieName$/.test(key)) {
              deleteCookie(const_default[key]);
            }
          }
        }
        if (type === 0 || type === 2) {
          localStorage.removeItem(const_default.multiQuoteStorageName);
        }
      };
      showRunCommandDialog = function() {
        const dialogName2 = "runCommandDialog";
        if ($("#" + dialogName2).length > 0) return;
        let bodyContent2 = `
<p class="font-size-sm">
  \u8FD0\u884C\u547D\u4EE4\u5FEB\u6377\u952E\uFF1A<kbd>Ctrl+Enter</kbd>\uFF1B\u6E05\u9664\u547D\u4EE4\u5FEB\u6377\u952E\uFF1A<kbd>Ctrl+\u9000\u683C\u952E</kbd>
</p>
<div class="form-group">
  <label for="cfgCmd">\u547D\u4EE4\u5185\u5BB9\uFF1A</label>
  <textarea class="form-control" name="cmd" id="cfgCmd" rows="6" wrap="off" aria-label="\u547D\u4EE4\u5185\u5BB9" style="white-space: pre;"></textarea>
</div>
<div class="form-group">
  <label for="cfgResult">\u8FD0\u884C\u7ED3\u679C\uFF1A</label>
  <textarea class="form-control font-size-sm" name="result" id="cfgResult" rows="6" wrap="off" aria-label="\u8FD0\u884C\u7ED3\u679C" style="white-space: pre;"></textarea>
</div>`;
        let footerContent2 = `
<button class="btn btn-primary" type="submit">\u8FD0\u884C</button>
<button class="btn btn-danger" name="clear" type="button">\u6E05\u9664</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u5173\u95ED</button>`;
        let $dialog2 = create(dialogName2, "\u8FD0\u884C\u547D\u4EE4", bodyContent2, footerContent2);
        let $cmd = $dialog2.find('[name="cmd"]');
        let $result = $dialog2.find('[name="result"]');
        $dialog2.submit(function(e) {
          e.preventDefault();
          let content = $cmd.val();
          if (!$.trim(content)) return;
          let { response: response2 } = runCmd(content, true);
          $result.val(response2);
        }).end().find('[name="clear"]').click(function() {
          $cmd.val("").focus();
        });
        $cmd.keydown(function(e) {
          if (e.ctrlKey && e.keyCode === 13) {
            $dialog2.submit();
          } else if (e.ctrlKey && e.keyCode === 8) {
            $dialog2.find('[name="clear"]').click();
          }
        });
        show2(dialogName2);
        $cmd.focus();
      };
      showImportOrExportSettingDialog = function() {
        const dialogName2 = "imOrExSettingDialog";
        if ($("#" + dialogName2).length > 0) return;
        read();
        let bodyContent2 = `
<p class="font-size-sm">
  <b>\u5BFC\u5165\u8BBE\u7F6E\uFF1A</b>\u5C06\u8BBE\u7F6E\u5185\u5BB9\u7C98\u8D34\u5230\u6587\u672C\u6846\u4E2D\u5E76\u70B9\u51FB\u4FDD\u5B58\u6309\u94AE\u5373\u53EF<br>
  <b>\u5BFC\u51FA\u8BBE\u7F6E\uFF1A</b>\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF<br>
  <span class="text-danger">\u6CE8\uFF1A\u672C\u8BBE\u7F6E\u4E0E\u7535\u8111\u7248\u7684KFOL\u52A9\u624B\u5E76\u4E0D\u5B8C\u5168\u901A\u7528</span>
</p>
<div class="form-group">
  <textarea class="form-control font-size-sm font-monospace" name="setting" rows="10" aria-label="\u8BBE\u7F6E\u5185\u5BB9" style="word-break: break-all;"></textarea>
</div>`;
        let footerContent2 = `
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>`;
        let $dialog2 = create(dialogName2, "\u5BFC\u5165\u6216\u5BFC\u51FA\u8BBE\u7F6E", bodyContent2, footerContent2);
        $dialog2.submit(function(e) {
          e.preventDefault();
          if (!confirm("\u662F\u5426\u5BFC\u5165\u6587\u672C\u6846\u4E2D\u7684\u8BBE\u7F6E\uFF1F")) return;
          let options = $.trim($dialog2.find('[name="setting"]').val());
          if (!options) return;
          try {
            options = JSON.parse(options);
          } catch (ex) {
            alert("\u8BBE\u7F6E\u6709\u9519\u8BEF");
            return;
          }
          if (!options || $.type(options) !== "object") {
            alert("\u8BBE\u7F6E\u6709\u9519\u8BEF");
            return;
          }
          options = normalize(options);
          window.Config = $.extend(true, {}, Config2, options);
          write();
          alert("\u8BBE\u7F6E\u5DF2\u5BFC\u5165");
          location.reload();
        });
        show2(dialogName2);
        $dialog2.find('[name="setting"]').val(JSON.stringify(getDifferenceSetOfObject(Config2, Config))).select().focus();
      };
      showUserMemoDialog = function() {
        const dialogName2 = "userMemoDialog";
        if ($("#" + dialogName2).length > 0) return;
        read();
        let bodyContent2 = `
<p class="font-size-sm">\u6309\u7167<code>\u7528\u6237\u540D:\u5907\u6CE8</code>\u7684\u683C\u5F0F\uFF08\u6CE8\u610F\u662F\u82F1\u6587\u5192\u53F7\uFF09\uFF0C\u6BCF\u884C\u4E00\u4E2A</p>
<div class="form-group">
  <textarea class="form-control" name="userMemoList" rows="13" wrap="off" aria-label="\u7528\u6237\u5907\u6CE8" style="white-space: pre;"></textarea>
</div>`;
        let footerContent2 = `
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>`;
        let $dialog2 = create(dialogName2, "\u7528\u6237\u5907\u6CE8", bodyContent2, footerContent2);
        let $userMemoList = $dialog2.find('[name="userMemoList"]');
        $dialog2.submit(function(e) {
          e.preventDefault();
          let content2 = $.trim($userMemoList.val());
          Config.userMemoList = {};
          for (let line of content2.split("\n")) {
            line = $.trim(line);
            if (!line) continue;
            if (!/.+?:.+/.test(line)) {
              alert("\u683C\u5F0F\u4E0D\u6B63\u786E");
              $userMemoList.focus();
              return;
            }
            let [user, memo = ""] = line.split(":");
            if (!memo) continue;
            Config.userMemoList[user.trim()] = memo.trim();
          }
          write();
          close(dialogName2);
        });
        let content = "";
        for (let [user, memo] of Object.entries(Config.userMemoList)) {
          content += `${user}:${memo}
`;
        }
        show2(dialogName2);
        $userMemoList.val(content).focus();
      };
      showCustomCssDialog = function() {
        const dialogName2 = "customCssDialog";
        if ($("#" + dialogName2).length > 0) return;
        read();
        let bodyContent2 = `
<div class="form-group">
  <textarea class="form-control font-size-sm font-monospace" name="customCssContent" rows="15" wrap="off" aria-label="\u81EA\u5B9A\u4E49CSS\u5185\u5BB9" style="white-space: pre;"></textarea>
</div>`;
        let footerContent2 = `
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>`;
        let $dialog2 = create(dialogName2, "\u81EA\u5B9A\u4E49CSS", bodyContent2, footerContent2);
        let $content = $dialog2.find('[name="customCssContent"]');
        $dialog2.submit(function(e) {
          e.preventDefault();
          Config.customCssContent = $.trim($content.val());
          write();
          close(dialogName2);
          alert("\u81EA\u5B9A\u4E49CSS\u4FEE\u6539\u6210\u529F\uFF08\u9700\u5237\u65B0\u9875\u9762\u540E\u624D\u53EF\u751F\u6548\uFF09");
        });
        show2(dialogName2);
        $content.val(Config.customCssContent).focus();
      };
      showFollowUserDialog = function() {
        const dialogName2 = "followUserDialog";
        if ($("#" + dialogName2).length > 0) return;
        let bodyContent2 = `
<div class="form-check">
  <input class="form-check-input" id="${dialogName2}_highlightFollowUserThreadInHpEnabled" name="highlightFollowUserThreadInHpEnabled" type="checkbox">
  <label class="form-check-label" for="${dialogName2}_highlightFollowUserThreadInHpEnabled">\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u7684\u9996\u9875\u4E3B\u9898\u94FE\u63A5</label>
  <span class="tips" data-toggle="tooltip" title="\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u5728\u9996\u9875\u4E0B\u7684\u4E3B\u9898\u94FE\u63A5">[?]</span>
</div>
<div class="form-check mb-3">
  <input class="form-check-input" id="${dialogName2}_highlightFollowUserThreadLinkEnabled" name="highlightFollowUserThreadLinkEnabled" type="checkbox">
  <label class="form-check-label" for="${dialogName2}_highlightFollowUserThreadLinkEnabled">\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u7684\u4E3B\u9898\u94FE\u63A5</label>
  <span class="tips" data-toggle="tooltip" title="\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u5728\u7248\u5757\u9875\u9762\u4E0B\u7684\u4E3B\u9898\u94FE\u63A5">[?]</span>
</div>
<ul class="list-unstyled" id="followUserList"></ul>
<div class="btn-group btn-group-sm mb-3" role="group">
  <button class="btn btn-secondary" name="selectAll" type="button">\u5168\u9009</button>
  <button class="btn btn-secondary" name="selectInverse" type="button">\u53CD\u9009</button>
  <button class="btn btn-danger" name="deleteSelect" type="button">\u5220\u9664</button>
</div>
<div class="input-group mb-3">
  <input class="form-control" name="addUser" data-toggle="tooltip" type="text" title="\u6DFB\u52A0\u591A\u4E2A\u7528\u6237\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694" aria-label="\u6DFB\u52A0\u5173\u6CE8\u7528\u6237">
  <div class="input-group-append">
    <button class="btn btn-success" name="add" type="button">\u6DFB\u52A0</button>
  </div>
</div>
`;
        let footerContent2 = `
<button class="btn btn-warning mr-auto" name="openImOrExFollowUserListDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>`;
        let $dialog2 = create(dialogName2, "\u5173\u6CE8\u7528\u6237", bodyContent2, footerContent2);
        let $followUserList = $dialog2.find("#followUserList");
        const addFollowUser = function(name2) {
          $(`
<li class="input-group input-group-sm mb-2">
  <div class="input-group-prepend">
    <div class="input-group-text">
      <input type="checkbox" aria-label="\u9009\u62E9\u7528\u6237">
    </div>
  </div>
  <input class="form-control" name="userName" type="text" value="${name2}" maxlength="12" aria-label="\u7F16\u8F91\u5173\u6CE8\u7528\u6237">
  <div class="input-group-append">
    <button class="btn btn-danger" name="delete" type="button" aria-label="\u5220\u9664\u5173\u6CE8\u7528\u6237">
      <i class="fa fa-trash" aria-hidden="true"></i>
    </button>
  </div>
</li>
`).appendTo($followUserList);
        };
        $dialog2.submit(function(e) {
          e.preventDefault();
          Config.highlightFollowUserThreadInHPEnabled = $dialog2.find('[name="highlightFollowUserThreadInHpEnabled"]').prop("checked");
          Config.highlightFollowUserThreadLinkEnabled = $dialog2.find('[name="highlightFollowUserThreadLinkEnabled"]').prop("checked");
          Config.followUserList = [];
          $followUserList.find("li").each(function() {
            let $this2 = $(this);
            let name2 = $.trim($this2.find('[name="userName"]').val());
            if (name2 !== "" && inFollowOrBlockUserList(name2, Config.followUserList) === -1) {
              Config.followUserList.push({ name: name2 });
            }
          });
          write();
          close(dialogName2);
        }).find('[name="deleteSelect"]').click(function() {
          let $checked = $followUserList.find('li:has([type="checkbox"]:checked)');
          if (!$checked.length) return;
          if (confirm("\u662F\u5426\u5220\u9664\u6240\u9009\u7528\u6237\uFF1F")) $checked.remove();
        }).end().find('[name="addUser"]').keydown(function(e) {
          if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next().find("button").click();
          }
        }).end().find('[name="add"]').click(function() {
          let $addUser = $dialog2.find('[name="addUser"]');
          for (let name2 of $.trim($addUser.val()).split(",")) {
            name2 = $.trim(name2);
            if (!name2) continue;
            if (inFollowOrBlockUserList(name2, Config.followUserList) === -1) addFollowUser(name2);
          }
          $addUser.val("");
          $followUserList.find('li:last-child [type="checkbox"]').focus();
        }).end().find('[name="openImOrExFollowUserListDialog"]').click(function() {
          showCommonImportOrExportConfigDialog("\u5173\u6CE8\u7528\u6237", "followUserList");
        }).end().find('[name="selectAll"]').click(() => selectAll($followUserList.find('[type="checkbox"]'))).end().find('[name="selectInverse"]').click(() => selectInverse($followUserList.find('[type="checkbox"]')));
        $followUserList.on("click", '[name="delete"]', function() {
          $(this).closest("li").remove();
        });
        $dialog2.find('[name="highlightFollowUserThreadInHpEnabled"]').prop("checked", Config.highlightFollowUserThreadInHPEnabled);
        $dialog2.find('[name="highlightFollowUserThreadLinkEnabled"]').prop("checked", Config.highlightFollowUserThreadLinkEnabled);
        for (let user of Config.followUserList) {
          addFollowUser(user.name);
        }
        show2(dialogName2);
      };
      showBlockUserDialog = function() {
        const dialogName2 = "blockUserDialog";
        if ($("#" + dialogName2).length > 0) return;
        let bodyContent2 = `
<div class="form-group mb-2">
  <label for="blockUserDefaultType">\u9ED8\u8BA4\u5C4F\u853D\u7C7B\u578B</label>
  <select class="custom-select custom-select-sm w-auto" id="blockUserDefaultType" name="blockUserDefaultType">
    <option value="0">\u4E3B\u9898\u548C\u56DE\u5E16</option><option value="1">\u4E3B\u9898</option><option value="2">\u56DE\u5E16</option>
  </select>
  <div class="form-check form-check-inline ml-3">
    <input class="form-check-input" id="${dialogName2}_blockUserAtTipsEnabled" name="blockUserAtTipsEnabled" type="checkbox">
    <label class="form-check-label" for="${dialogName2}_blockUserAtTipsEnabled">\u5C4F\u853D@\u63D0\u9192</label>
    <span class="tips" data-toggle="tooltip" title="\u5C4F\u853D\u88AB\u5C4F\u853D\u7528\u6237\u7684@\u63D0\u9192">[?]</span>
  </div>
</div>
<div class="form-group mb-2">
  <label for="blockUserForumType">\u7248\u5757\u5C4F\u853D\u8303\u56F4</label>
  <select class="custom-select custom-select-sm w-auto" id="blockUserForumType" name="blockUserForumType">
    <option value="0">\u6240\u6709\u7248\u5757</option><option value="1">\u5305\u62EC\u6307\u5B9A\u7248\u5757</option><option value="2">\u6392\u9664\u6307\u5B9A\u7248\u5757</option>
  </select>
</div>
<div class="form-group">
  <label>\u7248\u5757ID\u5217\u8868</label>
  <span class="tips" data-toggle="tooltip" title="\u7248\u5757URL\u4E2D\u7684fid\u53C2\u6570\uFF0C\u591A\u4E2AID\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694">[?]</span>
  <input class="form-control form-control-sm" name="blockUserFidList" type="text">
</div>
<ul class="list-unstyled" id="blockUserList"></ul>
<div class="btn-group btn-group-sm mb-3" role="group">
  <button class="btn btn-secondary" name="selectAll" type="button">\u5168\u9009</button>
  <button class="btn btn-secondary" name="selectInverse" type="button">\u53CD\u9009</button>
  <div class="btn-group btn-group-sm dropup">
    <button class="btn btn-info dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false">
      \u4FEE\u6539\u4E3A
    </button>
    <div class="dropdown-menu" data-name="modifyMenu">
      <a class="dropdown-item" data-value="0" href="#">\u4E3B\u9898\u548C\u56DE\u5E16</a>
      <a class="dropdown-item" data-value="1" href="#">\u4E3B\u9898</a>
      <a class="dropdown-item" data-value="2" href="#">\u56DE\u5E16</a>
    </div>
  </div>
  <button class="btn btn-danger" name="deleteSelect" type="button">\u5220\u9664</button>
</div>
<div class="input-group mb-3">
  <input class="form-control" name="addUser" data-toggle="tooltip" type="text" title="\u6DFB\u52A0\u591A\u4E2A\u7528\u6237\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694" aria-label="\u6DFB\u52A0\u5C4F\u853D\u7528\u6237">
  <div class="input-group-append">
    <button class="btn btn-success" name="add" type="button">\u6DFB\u52A0</button>
  </div>
</div>`;
        let footerContent2 = `
<button class="btn btn-warning mr-auto" name="openImOrExBlockUserListDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>`;
        let $dialog2 = create(dialogName2, "\u5C4F\u853D\u7528\u6237", bodyContent2, footerContent2);
        let $blockUserList = $dialog2.find("#blockUserList");
        const addBlockUser = function(name2, type) {
          $(`
<li class="form-group row no-gutters mb-2">
  <div class="col-7 input-group input-group-sm">
    <div class="input-group-prepend">
      <div class="input-group-text">
        <input type="checkbox" aria-label="\u9009\u62E9\u7528\u6237">
      </div>
    </div>
    <input class="form-control" name="userName" type="text" value="${name2}" maxlength="12" aria-label="\u7F16\u8F91\u5C4F\u853D\u7528\u6237">
  </div>
  <div class="col-5 input-group input-group-sm">
    <select class="form-control" name="blockType">
      <option value="0">\u4E3B\u9898\u548C\u56DE\u5E16</option><option value="1">\u4E3B\u9898</option><option value="2">\u56DE\u5E16</option>
    </select>
    <div class="input-group-append">
      <button class="btn btn-danger" name="delete" type="button" aria-label="\u5220\u9664\u5C4F\u853D\u7528\u6237">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</li>
`).appendTo($blockUserList).find('[name="blockType"]').val(type);
        };
        $dialog2.submit(function(e) {
          e.preventDefault();
          Config.blockUserDefaultType = parseInt($dialog2.find('[name="blockUserDefaultType"]').val());
          Config.blockUserAtTipsEnabled = $dialog2.find('[name="blockUserAtTipsEnabled"]').prop("checked");
          Config.blockUserForumType = parseInt($dialog2.find('[name="blockUserForumType"]').val());
          let blockUserFidList = /* @__PURE__ */ new Set();
          for (let fid2 of $.trim($dialog2.find('[name="blockUserFidList"]').val()).split(",")) {
            fid2 = parseInt(fid2);
            if (!isNaN(fid2) && fid2 > 0) blockUserFidList.add(fid2);
          }
          Config.blockUserFidList = [...blockUserFidList];
          Config.blockUserList = [];
          $blockUserList.find("li").each(function() {
            let $this2 = $(this);
            let name2 = $.trim($this2.find('[name="userName"]').val());
            if (name2 && inFollowOrBlockUserList(name2, Config.blockUserList) === -1) {
              let type = parseInt($this2.find('[name="blockType"]').val());
              Config.blockUserList.push({ name: name2, type });
            }
          });
          write();
          close(dialogName2);
        }).find('[data-name="modifyMenu"]').on("click", "a", function(e) {
          e.preventDefault();
          let value = parseInt($(this).data("value"));
          $blockUserList.find('li:has([type="checkbox"]:checked) select').val(value);
        }).end().find('[name="deleteSelect"]').click(function() {
          let $checked = $blockUserList.find('li:has([type="checkbox"]:checked)');
          if (!$checked.length) return;
          if (confirm("\u662F\u5426\u5220\u9664\u6240\u9009\u7528\u6237\uFF1F")) $checked.remove();
        }).end().find('[name="addUser"]').keydown(function(e) {
          if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next().find("button").click();
          }
        }).end().find('[name="add"]').click(function() {
          let $addUser = $dialog2.find('[name="addUser"]');
          let type = parseInt($dialog2.find('[name="blockUserDefaultType"]').val());
          for (let name2 of $.trim($addUser.val()).split(",")) {
            name2 = $.trim(name2);
            if (!name2) continue;
            if (inFollowOrBlockUserList(name2, Config.blockUserList) === -1) addBlockUser(name2, type);
          }
          $addUser.val("");
          $blockUserList.find('li:last-child [type="checkbox"]').focus();
        }).end().find('[name="blockUserForumType"]').change(function() {
          $dialog2.find('[name="blockUserFidList"]').prop("disabled", parseInt($(this).val()) === 0);
        }).end().find('[name="openImOrExBlockUserListDialog"]').click(function() {
          showCommonImportOrExportConfigDialog("\u5C4F\u853D\u7528\u6237", "blockUserList");
        }).end().find('[name="selectAll"]').click(() => selectAll($blockUserList.find('[type="checkbox"]'))).end().find('[name="selectInverse"]').click(() => selectInverse($blockUserList.find('[type="checkbox"]')));
        $blockUserList.on("click", '[name="delete"]', function() {
          $(this).closest("li").remove();
        });
        $dialog2.find('[name="blockUserDefaultType"]').val(Config.blockUserDefaultType);
        $dialog2.find('[name="blockUserAtTipsEnabled"]').prop("checked", Config.blockUserAtTipsEnabled);
        $dialog2.find('[name="blockUserForumType"]').val(Config.blockUserForumType).triggerHandler("change");
        $dialog2.find('[name="blockUserFidList"]').val(Config.blockUserFidList.join(","));
        for (let user of Config.blockUserList) {
          addBlockUser(user.name, user.type);
        }
        show2(dialogName2);
      };
      showBlockThreadDialog = function() {
        const dialogName = "blockThreadDialog";
        if ($("#" + dialogName).length > 0) return;
        let bodyContent = `
<p class="font-size-sm">
  \u6807\u9898\u5173\u952E\u5B57\u53EF\u4F7F\u7528\u666E\u901A\u5B57\u7B26\u4E32\u6216\u6B63\u5219\u8868\u8FBE\u5F0F\uFF0C\u6B63\u5219\u8868\u8FBE\u5F0F\u8BF7\u4F7F\u7528<code>/abc/</code>\u7684\u683C\u5F0F\uFF0C\u4F8B\uFF1A<code>/\u5173\u952E\u5B57A.*\u5173\u952E\u5B57B/i</code><br>
  \u7528\u6237\u540D\u548C\u7248\u5757ID\u4E3A\u53EF\u9009\u9879\uFF08\u591A\u4E2A\u7528\u6237\u540D\u6216\u7248\u5757ID\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694\uFF09<br>
</p>
<div class="form-group mb-2">
  <label for="blockThreadDefForumType">\u9ED8\u8BA4\u7248\u5757\u5C4F\u853D\u8303\u56F4</label>
  <select class="custom-select custom-select-sm w-auto" id="blockThreadDefForumType" name="blockThreadDefForumType">
    <option value="0">\u6240\u6709\u7248\u5757</option><option value="1">\u5305\u62EC\u6307\u5B9A\u7248\u5757</option><option value="2">\u6392\u9664\u6307\u5B9A\u7248\u5757</option>
  </select>
</div>
<div class="form-group">
  <label for="blockThreadDefFidList">\u9ED8\u8BA4\u7248\u5757ID\u5217\u8868</label>
  <input class="form-control form-control-sm" id="blockThreadDefFidList" name="blockThreadDefFidList" type="text">
</div>
<div class="table-responsive">
  <table class="table table-sm table-hover table-center text-nowrap">
    <thead>
      <tr>
        <th>\u6807\u9898\u5173\u952E\u5B57(\u5FC5\u586B)</th>
        <th>\u5C4F\u853D\u7528\u6237</th>
        <th>\u7528\u6237\u540D</th>
        <th>\u5C4F\u853D\u8303\u56F4</th>
        <th>\u7248\u5757ID</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="blockThreadList"></tbody>
  </table>
</div>
<div class="btn-group btn-group-sm mb-3" role="group">
  <button class="btn btn-success" name="add" type="button">\u589E\u52A0</button>
  <button class="btn btn-danger" name="clear" type="button">\u6E05\u7A7A</button>
</div>`;
        let footerContent = `
<button class="btn btn-warning mr-auto" name="openImOrExBlockThreadListDialog" type="button">\u5BFC\u5165/\u5BFC\u51FA</button>
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>`;
        let $dialog = create(dialogName, "\u5C4F\u853D\u4E3B\u9898", bodyContent, footerContent);
        let $blockThreadList = $dialog.find("#blockThreadList");
        const addBlockThread = function(keyWord2, userType, userList, fidType, fidList) {
          $(`
<tr>
  <td>
    <input class="form-control form-control-sm" name="keyWord" type="text" value="${keyWord2}" aria-label="\u6807\u9898\u5173\u952E\u5B57" style="min-width: 12rem;">
  </td>
  <td>
    <select class="form-control form-control-sm" name="userType" aria-label="\u5C4F\u853D\u7528\u6237\u7C7B\u578B" style="min-width: 4.5rem;">
      <option value="0">\u6240\u6709</option><option value="1">\u5305\u62EC</option><option value="2">\u6392\u9664</option>
    </select>
  </td>
  <td>
    <input class="form-control form-control-sm" name="userList" type="text" value="${userList.join(",")}" aria-label="\u7528\u6237\u540D"
           ${userType === 0 ? "disabled" : ""} style="min-width: 12rem;">
  </td>
  <td>
    <select class="form-control form-control-sm" name="fidType" aria-label="\u5C4F\u853D\u8303\u56F4" style="min-width: 4.5rem;">
      <option value="0">\u6240\u6709</option><option value="1">\u5305\u62EC</option><option value="2">\u6392\u9664</option>
    </select>
  </td>
  <td>
    <input class="form-control form-control-sm" name="fidList" type="text" value="${fidList.join(",")}" aria-label="\u7248\u5757ID\u5217\u8868"
           ${fidType === 0 ? "disabled" : ""} style="min-width: 9rem;">
  </td>
  <td class="text-left">
    <button class="btn btn-danger btn-sm" name="delete" type="button" aria-label="\u5220\u9664">
      <i class="fa fa-trash" aria-hidden="true"></i>
    </button>
  </td>
</tr>
`).appendTo($blockThreadList).find('[name="userType"]').val(userType).end().find('[name="fidType"]').val(fidType);
        };
        const verify = function() {
          let flag = true;
          $blockThreadList.find("tr").each(function() {
            let $this = $(this);
            let $txtKeyWord = $this.find('[name="keyWord"]');
            let keyWord = $txtKeyWord.val();
            if (!$.trim(keyWord)) return;
            if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
              try {
                eval(keyWord);
              } catch (ex) {
                alert("\u6B63\u5219\u8868\u8FBE\u5F0F\u4E0D\u6B63\u786E");
                $txtKeyWord.select().focus();
                flag = false;
                return false;
              }
            }
          });
          return flag;
        };
        $dialog.submit(function(e) {
          e.preventDefault();
          if (!verify()) return;
          Config.blockThreadDefForumType = parseInt($dialog.find('[name="blockThreadDefForumType"]').val());
          let blockThreadDefFidList = /* @__PURE__ */ new Set();
          for (let fid2 of $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(",")) {
            fid2 = parseInt(fid2);
            if (!isNaN(fid2) && fid2 > 0) blockThreadDefFidList.add(fid2);
          }
          Config.blockThreadDefFidList = [...blockThreadDefFidList];
          Config.blockThreadList = [];
          $blockThreadList.find("tr").each(function() {
            let $this2 = $(this);
            let keyWord2 = $this2.find('[name="keyWord"]').val();
            if (!$.trim(keyWord2)) return;
            let newObj = { keyWord: keyWord2 };
            let userType = parseInt($this2.find('[name="userType"]').val());
            if (userType > 0) {
              let userList = /* @__PURE__ */ new Set();
              for (let user of $.trim($this2.find('[name="userList"]').val()).split(",")) {
                user = $.trim(user);
                if (user) userList.add(user);
              }
              if (userList.size > 0) newObj[userType === 2 ? "excludeUser" : "includeUser"] = [...userList];
            }
            let fidType = parseInt($this2.find('[name="fidType"]').val());
            if (fidType > 0) {
              let fidList = /* @__PURE__ */ new Set();
              for (let fid2 of $.trim($this2.find('[name="fidList"]').val()).split(",")) {
                fid2 = parseInt(fid2);
                if (!isNaN(fid2) && fid2 > 0) fidList.add(fid2);
              }
              if (fidList.size > 0) newObj[fidType === 2 ? "excludeFid" : "includeFid"] = [...fidList];
            }
            Config.blockThreadList.push(newObj);
          });
          write();
          close(dialogName);
        }).find('[name="clear"]').click(function() {
          if (confirm("\u662F\u5426\u6E05\u9664\u6240\u6709\u5C4F\u853D\u5173\u952E\u5B57\uFF1F")) $blockThreadList.html("");
        }).end().find('[name="add"]').click(function() {
          addBlockThread(
            "",
            0,
            [],
            parseInt($dialog.find('[name="blockThreadDefForumType"]').val()),
            $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(",")
          );
        }).end().find('[name="blockThreadDefForumType"]').change(function() {
          $dialog.find('[name="blockThreadDefFidList"]').prop("disabled", parseInt($(this).val()) === 0);
        }).end().find('[name="openImOrExBlockThreadListDialog"]').click(function() {
          showCommonImportOrExportConfigDialog("\u5C4F\u853D\u4E3B\u9898", "blockThreadList");
        }).end().find('[name="selectAll"]').click(() => selectAll($blockThreadList.find('[type="checkbox"]'))).end().find('[name="selectInverse"]').click(() => selectInverse($blockThreadList.find('[type="checkbox"]')));
        $blockThreadList.on("change", "select", function() {
          let $this2 = $(this);
          $this2.closest("td").next("td").find("input").prop("disabled", parseInt($this2.val()) === 0);
        }).on("click", '[name="delete"]', function() {
          $(this).closest("tr").remove();
        });
        $dialog.find('[name="blockThreadDefForumType"]').val(Config.blockThreadDefForumType).triggerHandler("change");
        $dialog.find('[name="blockThreadDefFidList"]').val(Config.blockThreadDefFidList.join(","));
        for (let data of Config.blockThreadList) {
          let { keyWord: keyWord2, includeUser: includeUser2, excludeUser: excludeUser2, includeFid: includeFid2, excludeFid: excludeFid2 } = data;
          let userType = 0;
          let userList = [];
          if (typeof includeUser2 !== "undefined") {
            userType = 1;
            userList = includeUser2;
          } else if (typeof excludeUser2 !== "undefined") {
            userType = 2;
            userList = excludeUser2;
          }
          let fidType = 0;
          let fidList = [];
          if (typeof includeFid2 !== "undefined") {
            fidType = 1;
            fidList = includeFid2;
          } else if (typeof excludeFid2 !== "undefined") {
            fidType = 2;
            fidList = excludeFid2;
          }
          addBlockThread(keyWord2, userType, userList, fidType, fidList);
        }
        show2(dialogName);
      };
    }
  });

  // public/static/src/js/module/public.js
  var public_exports = {};
  __export(public_exports, {
    bindFastSubmitShortcutKey: () => bindFastSubmitShortcutKey,
    blockThread: () => blockThread,
    blockUsers: () => blockUsers,
    fillCommonForumPanel: () => fillCommonForumPanel,
    followUsers: () => followUsers,
    handleMainMenu: () => handleMainMenu,
    handleMainMenuLink: () => handleMainMenuLink,
    handlePageInput: () => handlePageInput,
    handleSearchDialog: () => handleSearchDialog,
    handleSidebarRollBtn: () => handleSidebarRollBtn,
    preventCloseWindow: () => preventCloseWindow,
    showCommonImportOrExportConfigDialog: () => showCommonImportOrExportConfigDialog,
    showEditCommonForumDialog: () => showEditCommonForumDialog,
    showSidebarBtnGroup: () => showSidebarBtnGroup
  });
  var handleMainMenu, handleMainMenuLink, showSidebarBtnGroup, handleSidebarRollBtn, handleSearchDialog, handlePageInput, bindFastSubmitShortcutKey, showEditCommonForumDialog, fillCommonForumPanel, preventCloseWindow, showCommonImportOrExportConfigDialog, followUsers, blockUsers, blockThread;
  var init_public = __esm({
    "public/static/src/js/module/public.js"() {
      "use strict";
      init_util();
      init_const();
      init_dialog();
      init_config();
      init_configDialog();
      handleMainMenu = function() {
        $("#mainMenuTogglerBtn").click(function() {
          let maxHeight = document.documentElement.clientHeight - $(this).closest(".navbar").outerHeight();
          if (maxHeight > 0) {
            $("#mainMenu").css("max-height", maxHeight + "px");
          }
        });
        $("#sidebarMainMenuBtn").click(() => $("#mainMenuTogglerBtn").click());
      };
      handleMainMenuLink = function() {
        $("#mainMenu").find('[data-name="openConfigDialog"]').click(function(e) {
          e.preventDefault();
          $("#mainMenuTogglerBtn").click();
          show3();
        });
      };
      showSidebarBtnGroup = function() {
        $(".sidebar-btn-group").prop("hidden", false);
        if (Config.showSidebarRollBtnEnabled) $("#sidebarRollBtn").prop("hidden", false);
        if (Config.showSidebarMainMenuBtnEnabled) $("#sidebarMainMenuBtn").prop("hidden", false);
        if (Config.showSidebarForumListBtnEnabled) $("#sidebarForumListBtn").prop("hidden", false);
        if (Config.showSidebarSearchBtnEnabled) $("#sidebarSearchBtn").prop("hidden", false);
        if (Config.showSidebarHomePageBtnEnabled) $("#sidebarHomePageBtn").prop("hidden", false);
      };
      handleSidebarRollBtn = function() {
        $(window).scroll(function() {
          let $btn = $("#sidebarRollBtn");
          if ($(window).scrollTop() > 640) {
            if ($btn.data("direction") === "top") return;
            $btn.data("direction", "top").attr("aria-label", "\u6EDA\u52A8\u5230\u9875\u9876").find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
          } else {
            if ($btn.data("direction") === "bottom") return;
            $btn.data("direction", "bottom").attr("aria-label", "\u6EDA\u52A8\u5230\u9875\u5E95").find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
          }
        });
        $("#sidebarRollBtn").click(function() {
          let scrollTop = $(this).data("direction") === "bottom" ? $("body").height() : 0;
          $("body, html").animate({ scrollTop });
        });
      };
      handleSearchDialog = function() {
        let $searchDialog = $("#searchDialog");
        $searchDialog.find('#searchType > option[value="username"]').prop("hidden", !Config.adminMemberEnabled);
        $searchDialog.on("shown.bs.modal", function() {
          $("#searchKeyword").select().focus();
        }).find("form").submit(function() {
          let $this2 = $(this);
          let $searchKeyword = $this2.find("#searchKeyword");
          let searchType = $this2.find("#searchType").val();
          let keyword = $.trim($searchKeyword.val());
          if (searchType === "gjc") {
            $this2.attr("action", makeUrl("gjc/" + keyword));
          } else if (searchType === "username") {
            $this2.attr("action", makeUrl("user/username/" + keyword));
          } else {
            $this2.attr("action", makeUrl("search"));
            $searchKeyword.attr("name", searchType === "author" ? "pwuser" : "keyword");
            if (searchType === "title") {
              if (keyword.length && getStrByteLen(keyword) <= 2) {
                $searchKeyword.val(keyword + " " + keyword);
              }
            }
          }
        });
        $searchDialog.find('[name="searchRange"]').on("click", function() {
          let value = "all";
          if ($(this).val() === "current") value = Info.fid;
          $searchDialog.find('[name="f_fid"]').val(value);
        });
        let $current = $searchDialog.find('[name="searchRange"][value="current"]');
        let $currentBox = $current.closest(".form-check-inline");
        $searchDialog.find("#searchType").change(function() {
          let searchType = $(this).val();
          if (!$current.data("enabled")) return;
          let disabled = searchType === "gjc" || searchType === "username";
          $current.prop("disabled", disabled);
          if (disabled) $currentBox.addClass("disabled");
          else $currentBox.removeClass("disabled");
        });
        if (pageId === "threadPage" || pageId === "readPage") {
          $current.prop("disabled", false).data("enabled", true).click();
          $currentBox.removeClass("disabled");
        }
      };
      handlePageInput = function() {
        $(document).on("click", ".page-input", function(e) {
          e.preventDefault();
          if (Info.maxPageNum && Info.maxPageNum <= 1) return;
          let action = $(this).data("url");
          if (!action) return;
          let excludeParams = $(this).data("exclude");
          if (excludeParams) excludeParams = excludeParams.split(",");
          else excludeParams = [];
          let num2 = parseInt(
            prompt(`\u8981\u8DF3\u8F6C\u5230\u7B2C\u51E0\u9875\uFF1F${Info.maxPageNum ? `\uFF08\u5171${Info.maxPageNum}\u9875\uFF09` : ""}`, Info.currentPageNum)
          );
          if (num2 && num2 > 0) {
            location.href = makeUrl(action, "page=" + num2, true, excludeParams);
          }
        });
      };
      bindFastSubmitShortcutKey = function() {
        $('[data-fast-submit="true"]').keydown(function(e) {
          if (e.keyCode === 13 && e.ctrlKey) {
            $(this).closest("form").submit();
          }
        });
      };
      showEditCommonForumDialog = function() {
        $(document).on("click", ".edit-common-forum-btn", function(e) {
          e.preventDefault();
          const dialogName2 = "editCommonForumDialog";
          if ($("#" + dialogName2).length > 0) return;
          read();
          let commonForumList = Config.commonForumList.length > 0 ? Config.commonForumList : const_default.commonForumList;
          let commonForumListHtml = "";
          for (let { fid: fid2, name: name2 } of commonForumList) {
            commonForumListHtml += `<span class="btn btn-outline-primary" data-fid="${fid2}">${name2}</span>`;
          }
          let availableForumListHtml = "";
          for (let { fid: fid2, name: name2 } of const_default.availableForumList) {
            if (commonForumList.find((elem) => elem.fid === fid2)) continue;
            availableForumListHtml += `<span class="btn btn-outline-primary" data-fid="${fid2}">${name2}</span>`;
          }
          let bodyContent2 = `
<p class="font-size-sm text-muted">
  \u8BF7\u5C06\u53EF\u7528\u7248\u5757\u5185\u7684\u7248\u5757\u6309\u94AE\u62D6\u62FD\u5230\u5E38\u7528\u7248\u5757\u5185\uFF08\u6216\u76F8\u53CD\uFF09
</p>
<fieldset class="fieldset mb-3 py-2">
  <legend>\u5E38\u7528\u7248\u5757</legend>
  <div class="edit-forum-list d-flex flex-wrap" id="editCommonForumList">${commonForumListHtml}</div>
</fieldset>
<fieldset class="fieldset mb-3 py-2">
  <legend>\u53EF\u7528\u7248\u5757</legend>
  <div class="edit-forum-list d-flex flex-wrap" id="editAvailableForumList">${availableForumListHtml}</div>
</fieldset>`;
          let footerContent2 = `
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>
<button class="btn btn-danger" name="reset" type="button">\u91CD\u7F6E</button>`;
          let $dialog2 = create(dialogName2, "\u7F16\u8F91\u5E38\u7528\u7248\u5757", bodyContent2, footerContent2);
          const dragulaInit = function() {
            let drake = dragula($dialog2.find(".edit-forum-list").get(), { revertOnSpill: true });
            drake.on("drag", function() {
              $dialog2.find(".dialog-body").css("overflow-y", "hidden");
            }).on("drop", function() {
              $dialog2.find(".dialog-body").css("overflow-y", "auto");
            }).on("cancel", function() {
              $dialog2.find(".dialog-body").css("overflow-y", "auto");
            });
          };
          let $dragulaScriptPath = $('[name="dragulaScriptPath"]');
          let dragulaScriptPath = $dragulaScriptPath.val();
          if (dragulaScriptPath) {
            $.getScript(dragulaScriptPath, dragulaInit);
            $dragulaScriptPath.val("");
          } else {
            dragulaInit();
          }
          $dialog2.submit(function(e2) {
            e2.preventDefault();
            Config.commonForumList = [];
            $("#editCommonForumList").children(".btn").each(function() {
              let $this2 = $(this);
              let fid2 = parseInt($this2.data("fid"));
              let name2 = $this2.text().trim();
              if (!fid2 || !name2) return;
              Config.commonForumList.push({ fid: fid2, name: name2 });
            });
            write();
            alert("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58");
            close(dialogName2);
            location.reload();
          }).find('[name="reset"]').click(function() {
            if (!confirm("\u662F\u5426\u91CD\u7F6E\uFF1F")) return;
            Config.commonForumList = [];
            write();
            alert("\u8BBE\u7F6E\u5DF2\u91CD\u7F6E");
            close(dialogName2);
            location.reload();
          });
          show2(dialogName2);
        });
      };
      fillCommonForumPanel = function() {
        let commonForumList = Config.commonForumList.length > 0 ? Config.commonForumList : const_default.commonForumList;
        let html = "";
        for (let [index, { fid: fid2, name: name2 }] of commonForumList.entries()) {
          if (index === 0 || index % 3 === 0) html += '<div class="row mb-3">';
          html += `
<div class="col-4">
  <a class="btn btn-outline-primary btn-block" href="${makeUrl("thread")}/${fid2}">${name2}</a>
</div>`;
          if (index === commonForumList.length - 1 || index % 3 === 2) html += "</div>";
        }
        $(".common-forum-panel").html(html);
      };
      preventCloseWindow = function() {
        window.addEventListener("beforeunload", function(e) {
          if ($(".mask").length > 0) {
            let msg = "\u6B63\u5728\u8FDB\u884C\u64CD\u4F5C\u4E2D\uFF0C\u786E\u5B9A\u8981\u5173\u95ED\u9875\u9762\u5417\uFF1F";
            e.returnValue = msg;
            return msg;
          }
        });
      };
      showCommonImportOrExportConfigDialog = function(title2, configName, callback, callbackAfterSubmit) {
        const dialogName2 = "pdCommonImOrExConfigDialog";
        if ($("#" + dialogName2).length > 0) return;
        read();
        let bodyContent2 = `
<p class="font-size-sm">
  <b>\u5BFC\u5165\u8BBE\u7F6E\uFF1A</b>\u5C06\u8BBE\u7F6E\u5185\u5BB9\u7C98\u8D34\u5230\u6587\u672C\u6846\u4E2D\u5E76\u70B9\u51FB\u4FDD\u5B58\u6309\u94AE\u5373\u53EF<br>
  <b>\u5BFC\u51FA\u8BBE\u7F6E\uFF1A</b>\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF
</p>
<div class="form-group">
  <textarea class="form-control font-size-sm" name="commonConfig" rows="10" aria-label="\u8BBE\u7F6E\u5185\u5BB9" style="word-break: break-all;"></textarea>
</div>`;
        let footerContent2 = `
<button class="btn btn-primary" type="submit">\u4FDD\u5B58</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">\u53D6\u6D88</button>`;
        let $dialog2 = create(dialogName2, `\u5BFC\u5165\u6216\u5BFC\u51FA${title2}`, bodyContent2, footerContent2);
        $dialog2.submit(function(e) {
          e.preventDefault();
          if (!confirm("\u662F\u5426\u5BFC\u5165\u6587\u672C\u6846\u4E2D\u7684\u8BBE\u7F6E\uFF1F")) return;
          let options = $.trim($dialog2.find('[name="commonConfig"]').val());
          if (!options) return;
          try {
            options = JSON.parse(options);
          } catch (ex) {
            alert("\u8BBE\u7F6E\u6709\u9519\u8BEF");
            return;
          }
          if (!options || $.type(options) !== $.type(Config[configName])) {
            alert("\u8BBE\u7F6E\u6709\u9519\u8BEF");
            return;
          }
          Config[configName] = options;
          write();
          alert("\u8BBE\u7F6E\u5DF2\u5BFC\u5165");
          close(dialogName2);
          if (typeof callbackAfterSubmit === "function") callbackAfterSubmit();
          else location.reload();
        });
        show2(dialogName2);
        $dialog2.find('[name="commonConfig"]').val(JSON.stringify(Config[configName])).select().focus();
        if (typeof callback === "function") callback($dialog2);
      };
      followUsers = function() {
        if (!Config.followUserList.length) return;
        if (pageId === "indexPage" && Config.highlightFollowUserThreadInHPEnabled) {
          $(".thread-link").each(function() {
            let $this2 = $(this);
            if (inFollowOrBlockUserList($this2.data("author"), Config.followUserList) > -1) {
              $this2.addClass("text-danger");
            }
          });
        } else if (pageId === "threadPage") {
          $(".thread-link").each(function() {
            let $this2 = $(this);
            if (inFollowOrBlockUserList($this2.data("author"), Config.followUserList) > -1) {
              $this2.closest(".thread-list-item").find(".thread-footer-column a:first").addClass("text-danger");
              if (Config.highlightFollowUserThreadLinkEnabled) $this2.addClass("text-danger");
            }
          });
        } else if (pageId === "readPage") {
          $(".read-floor").each(function() {
            let $this2 = $(this);
            if (inFollowOrBlockUserList(getFloorUserName($this2.data("username")), Config.followUserList) > -1) {
              $this2.find(".floor-num").addClass("text-danger");
            }
          });
        } else if (pageId === "gjcPage" || pageId === "sharePage" || pageId === "searchPage") {
          $(".thread-list-group").find("a[data-author]").each(function() {
            let $this2 = $(this);
            if (inFollowOrBlockUserList($this2.data("author"), Config.followUserList) > -1) {
              $this2.addClass("text-danger");
            }
          });
        }
      };
      blockUsers = function() {
        if (!Config.blockUserList.length) return;
        let num2 = 0;
        if (pageId === "indexPage") {
          $(".thread-link").each(function() {
            let $this2 = $(this);
            let index = inFollowOrBlockUserList($this2.data("author"), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type <= 1) {
              num2++;
              $this2.closest(".thread-link-group").remove();
            }
          });
        } else if (pageId === "threadPage") {
          if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(Info.fid)) return;
          else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(Info.fid)) return;
          $(".thread-link").each(function() {
            let $this2 = $(this);
            let index = inFollowOrBlockUserList($this2.data("author"), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type <= 1) {
              num2++;
              $this2.closest(".thread-list-item").remove();
            }
          });
        } else if (pageId === "readPage") {
          if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(Info.fid)) return;
          else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(Info.fid)) return;
          $(".read-floor").each(function() {
            let $this2 = $(this);
            let index = inFollowOrBlockUserList(getFloorUserName($this2.data("username")), Config.blockUserList);
            if (index > -1) {
              let floor = parseInt($this2.data("floor"));
              if (Config.blockUserList[index].type === 2 && floor === 0) return;
              else if (Config.blockUserList[index].type === 1 && floor > 0) return;
              num2++;
              $this2.closest(".read-floor").remove();
            }
          });
          $(".read-content").find(".blockquote > p").each(function() {
            let $this2 = $(this);
            let content = $this2.text().trim();
            for (let data of Config.blockUserList) {
              if (data.type === 1) continue;
              try {
                let regex1 = new RegExp(`^\u5F15\u7528(\u7B2C\\d+\u697C|\u697C\u4E3B)${data.name}\u4E8E`, "i");
                let regex2 = new RegExp(`^\u56DE\\s*\\d+\u697C\\(${data.name}\\)\\s*\u7684\u5E16\u5B50`, "i");
                if (regex1.test(content) || regex2.test(content)) {
                  $this2.html(`<mark class="help" data-toggle="tooltip" title="\u88AB\u5C4F\u853D\u7528\u6237\uFF1A${data.name}">\u8BE5\u7528\u6237\u5DF2\u88AB\u5C4F\u853D</mark>`);
                }
              } catch (ex) {
              }
            }
          });
        } else if (pageId === "gjcPage" && Config.blockUserAtTipsEnabled) {
          $(".thread-list-group").find("a[data-author]").each(function() {
            let $this2 = $(this);
            if (inFollowOrBlockUserList($this2.data("author"), Config.blockUserList) > -1) {
              num2++;
              $this2.closest(".thread-list-item").remove();
            }
          });
        }
        if (num2 > 0) console.log(`\u3010\u5C4F\u853D\u7528\u6237\u3011\u5171\u6709${num2}\u4E2A\u4E3B\u9898\u6216\u56DE\u590D\u88AB\u5C4F\u853D`);
      };
      blockThread = function() {
        if (!Config.blockThreadList.length) return;
        const isBlock = function(title, userName, fid = 0) {
          for (let { keyWord, includeUser, excludeUser, includeFid, excludeFid } of Config.blockThreadList) {
            let regex = null;
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
          return false;
        };
        let num = 0;
        if (pageId === "indexPage") {
          $(".thread-link").each(function() {
            let $this2 = $(this);
            if (isBlock($this2.text().trim(), $this2.data("author"))) {
              num++;
              $this2.closest(".thread-link-group").remove();
            }
          });
        } else if (pageId === "threadPage") {
          $(".thread-link").each(function() {
            let $this2 = $(this);
            if (isBlock($this2.attr("title"), $this2.data("author"), Info.fid)) {
              num++;
              $this2.closest(".thread-list-item").remove();
            }
          });
        } else if (pageId === "readPage") {
          if (Info.currentPageNum !== 1) return;
          let $topFloor = $('.read-floor[data-floor="0"]');
          if (!$topFloor.length) return;
          if (isBlock($(".thread-title").text().trim(), getFloorUserName($topFloor.data("username")), Info.fid)) {
            num++;
            $topFloor.remove();
          }
        }
        if (num > 0) console.log(`\u3010\u5C4F\u853D\u4E3B\u9898\u3011\u5171\u6709${num}\u4E2A\u4E3B\u9898\u88AB\u5C4F\u853D`);
      };
    }
  });

  // public/static/src/js/module/index.js
  var module_exports = {};
  __export(module_exports, {
    handleAtTipsBtn: () => handleAtTipsBtn,
    handleIndexThreadPanel: () => handleIndexThreadPanel,
    handleSelectBg: () => handleSelectBg
  });
  var handleAtTipsBtn, handleIndexThreadPanel, handleSelectBg;
  var init_module = __esm({
    "public/static/src/js/module/index.js"() {
      "use strict";
      init_util();
      init_const();
      init_config();
      handleAtTipsBtn = function() {
        $("#atTips").click(function() {
          let $this2 = $(this);
          let time = $this2.data("time");
          let cookieValue = getCookie(const_default.atTipsTimeCookieName);
          if (!time || time === cookieValue) return;
          if (!cookieValue) {
            let curDate = (/* @__PURE__ */ new Date()).getDate().toString();
            setCookie(const_default.prevAtTipsTimeCookieName, curDate.padStart(2, "0") + "\u65E500\u65F600\u5206");
          } else if (cookieValue !== time) {
            setCookie(const_default.prevAtTipsTimeCookieName, cookieValue);
          }
          setCookie(const_default.atTipsTimeCookieName, time, getDate(`+${const_default.atTipsTimeExpires}d`));
          $this2.removeClass("btn-outline-danger").addClass("btn-outline-primary");
        });
      };
      handleIndexThreadPanel = function() {
        if (Config.activeNewExtraPanel) {
          $(`a[data-toggle="tab"][href="${Config.activeNewExtraPanel}"]`).tab("show");
        }
        $(document).on("shown.bs.tab", '[data-toggle="tab"]', function(e) {
          let $target = $(e.target);
          let targetPanel = $target.attr("href");
          if (!targetPanel.includes("newExtraPanel")) return;
          let typeName = "activeNewExtraPanel";
          if (typeName && Config[typeName] !== targetPanel) {
            read();
            Config[typeName] = targetPanel;
            write();
          }
        });
      };
      handleSelectBg = function() {
        $("#selectBgImage").on("click", "[data-id]", function() {
          let $this2 = $(this);
          let id = $this2.data("id");
          let fileName = $this2.data("filename");
          let path = $this2.parent().data("path");
          if (!id || !fileName || !path) return;
          if (confirm("\u662F\u5426\u9009\u62E9\u6B64\u80CC\u666F\u56FE\u7247\uFF1F")) {
            setCookie(const_default.bgStyleCookieName, id, getDate(`+${const_default.bgStyleExpires}d`), const_default.storagePrefix);
            $("body, .modal-content").css("background-image", 'url("' + path + fileName + '")');
            alert("\u80CC\u666F\u5DF2\u66F4\u6362\uFF08\u56FE\u7247\u53EF\u80FD\u9700\u8981\u4E00\u5B9A\u65F6\u95F4\u52A0\u8F7D\uFF09");
          }
        }).on("click", "[data-color]", function() {
          let $this2 = $(this);
          let color = $this2.data("color");
          if (!color) return;
          if (confirm("\u662F\u5426\u9009\u62E9\u6B64\u80CC\u666F\u989C\u8272\uFF1F")) {
            setCookie(const_default.bgStyleCookieName, color, getDate(`+${const_default.bgStyleExpires}d`), const_default.storagePrefix);
            $("body, .modal-content").css("background", color);
            alert("\u80CC\u666F\u5DF2\u66F4\u6362");
          }
        });
        $("#customBgStyle").click(function() {
          let value = getCookie(const_default.bgStyleCookieName, const_default.storagePrefix);
          if (!value || parseInt(value)) value = "";
          value = prompt(
            "\u8BF7\u8F93\u5165\u80CC\u666F\u56FE\u7247URL\u3001\u989C\u8272\u4EE3\u7801\u6216CSS\u6837\u5F0F\uFF1A\n\uFF08\u4F8B\uFF1Ahttp://xxx.com/abc.jpg \u6216 #fcfcfc\uFF0C\u7559\u7A7A\u8868\u793A\u6062\u590D\u9ED8\u8BA4\u80CC\u666F\uFF09\n\uFF08\u6CE8\uFF1A\u5EFA\u8BAE\u9009\u62E9\u7B80\u6D01\u3001\u4E0D\u82B1\u54E8\u3001\u504F\u6D45\u8272\u7CFB\u7684\u80CC\u666F\u56FE\u7247\u6216\u989C\u8272\uFF09",
            value
          );
          if (value === null) return;
          let $bg = $("body, .modal-content, .dialog-content");
          if ($.trim(value) === "") {
            deleteCookie(const_default.bgStyleCookieName, const_default.storagePrefix);
            alert("\u80CC\u666F\u5DF2\u6062\u590D\u9ED8\u8BA4");
            location.reload();
          } else if (/^https?:\/\/[^"']+/.test(value)) {
            setCookie(const_default.bgStyleCookieName, value, getDate(`+${const_default.bgStyleExpires}d`), const_default.storagePrefix);
            $bg.css("background-image", 'url("' + value + '")');
            alert("\u80CC\u666F\u5DF2\u66F4\u6362\uFF08\u56FE\u7247\u53EF\u80FD\u9700\u8981\u4E00\u5B9A\u65F6\u95F4\u52A0\u8F7D\uFF09");
          } else if (/^#[0-9a-f]{6}$/i.test(value)) {
            setCookie(const_default.bgStyleCookieName, value, getDate(`+${const_default.bgStyleExpires}d`), const_default.storagePrefix);
            $bg.css("background", value.toLowerCase());
            alert("\u80CC\u666F\u5DF2\u66F4\u6362");
          } else if (!/[<>{}]/.test(value)) {
            value = value.replace(";", "");
            setCookie(const_default.bgStyleCookieName, value, getDate(`+${const_default.bgStyleExpires}d`), const_default.storagePrefix);
            $bg.css("background", value);
            alert("\u80CC\u666F\u5DF2\u66F4\u6362\uFF08\u56FE\u7247\u53EF\u80FD\u9700\u8981\u4E00\u5B9A\u65F6\u95F4\u52A0\u8F7D\uFF09");
          } else {
            alert("\u683C\u5F0F\u4E0D\u6B63\u786E");
          }
        });
      };
    }
  });

  // public/static/src/js/module/read.js
  var read_exports = {};
  __export(read_exports, {
    addUserMemo: () => addUserMemo,
    bindMultiQuoteCheckClick: () => bindMultiQuoteCheckClick,
    copyBuyThreadList: () => copyBuyThreadList,
    gotoFloor: () => gotoFloor,
    handleBlockFloorBtn: () => handleBlockFloorBtn,
    handleBuyThreadBtn: () => handleBuyThreadBtn,
    handleCopyCodeBtn: () => handleCopyCodeBtn,
    handleCopyFloorLinkBtn: () => handleCopyFloorLinkBtn,
    handleFastGotoFloorBtn: () => handleFastGotoFloorBtn,
    handleFastReplyBtn: () => handleFastReplyBtn,
    handleFloorImage: () => handleFloorImage,
    handleGoodPostBtn: () => handleGoodPostBtn,
    handleMoveThreadBtn: () => handleMoveThreadBtn,
    handleTuiThreadBtn: () => handleTuiThreadBtn,
    replaceAttachLabel: () => replaceAttachLabel
  });
  var handleCopyFloorLinkBtn, handleFastReplyBtn, handleGoodPostBtn, handleBlockFloorBtn, handleBuyThreadBtn, copyBuyThreadList, handleFloorImage, gotoFloor, handleFastGotoFloorBtn, handleTuiThreadBtn, handleCopyCodeBtn, getCheckedMultiQuoteData, bindMultiQuoteCheckClick, addUserMemo, replaceAttachLabel, handleMoveThreadBtn;
  var init_read = __esm({
    "public/static/src/js/module/read.js"() {
      "use strict";
      init_util();
      init_const();
      init_config();
      init_msg();
      handleCopyFloorLinkBtn = function() {
        $(document).on("click", ".floor-num", function(e) {
          e.preventDefault();
          let $this2 = $(this);
          let link = getHostNameUrl() + $this2.attr("href");
          $this2.data("copy-text", link);
          if (!copyText($this2, $this2)) {
            prompt("\u672C\u697C\u7684\u8DF3\u8F6C\u94FE\u63A5\uFF1A", link);
          }
        });
      };
      handleFastReplyBtn = function() {
        $(document).on("click", ".fast-reply-btn", function() {
          let $article = $(this).closest("article");
          let floor = $article.data("floor");
          let userName2 = getFloorUserName($article.data("username"));
          $("#postGjc").val(userName2);
          let postContent = $("#postContent").get(0);
          postContent.value = `[quote]\u56DE ${floor}\u697C(${userName2}) \u7684\u5E16\u5B50[/quote]
`;
          postContent.selectionStart = postContent.value.length;
          postContent.selectionEnd = postContent.value.length;
          postContent.focus();
        });
      };
      handleGoodPostBtn = function() {
        $(document).on("click", ".handle-post-btn", function() {
          let $this2 = $(this);
          if ($this2.data("wait")) return;
          let $floor = $(this).closest(".read-floor");
          let pid = $floor.data("pid");
          let tips = "\u662F\u5426\u63D0\u4EA4\u672C\u697C\u5C42\u4E3A\u4F18\u79C0\u5E16\u5B50\uFF1F";
          if (Info.goodPostTips) tips += `
\uFF08${Info.goodPostTips}\uFF09`;
          if (!confirm(tips)) return;
          $this2.data("wait", true);
          $.post("/diy_read_cztz.php", `tid=${Info.tid}&pid=${pid}&safeid=${Info.safeId}`).done(function(html) {
            if (/已将本帖操作为优秀帖|该楼层已经是优秀帖/.test(html)) {
              let $content = $floor.find(".read-content");
              if (!$content.find('.fieldset-alert:contains("\u672C\u5E16\u4E3A\u4F18\u79C0\u5E16")').length) {
                $content.prepend('<fieldset class="fieldset fieldset-alert"><legend>\u2193</legend>\u672C\u5E16\u4E3A\u4F18\u79C0\u5E16</fieldset>');
              }
            }
            alert(html);
          }).always(() => $this2.removeData("wait"));
        });
      };
      handleBlockFloorBtn = function() {
        $(document).on("click", ".block-floor", () => confirm("\u786E\u8BA4\u8981\u5C4F\u853D\u8BE5\u56DE\u5E16\uFF1F\u672C\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF01\uFF08\u5C4F\u853D\u540E\u8BE5\u56DE\u5E16\u5C06\u5BF9\u5927\u5BB6\u4E0D\u53EF\u89C1\uFF09"));
      };
      handleBuyThreadBtn = function() {
        $(document).on("click", ".buy-thread-btn", function(e) {
          e.preventDefault();
          let $this2 = $(this);
          let pid = $this2.data("pid");
          let price = $this2.data("price");
          if (price > 5 && !confirm(`\u6B64\u8D34\u552E\u4EF7${price}KFB\uFF0C\u662F\u5426\u8D2D\u4E70\uFF1F`)) return;
          let $wait = wait("\u6B63\u5728\u8D2D\u4E70\u5E16\u5B50&hellip;");
          $.get(
            makeUrl("job/buytopic", `tid=${Info.tid}&pid=${pid}&verify=${Info.verify}&t=${(/* @__PURE__ */ new Date()).getTime()}`),
            function({ msg }) {
              remove($wait);
              if (msg === "\u64CD\u4F5C\u5B8C\u6210") {
                location.reload();
              } else if (msg.includes("\u60A8\u5DF2\u7ECF\u8D2D\u4E70\u6B64\u5E16")) {
                alert("\u4F60\u5DF2\u7ECF\u8D2D\u4E70\u8FC7\u6B64\u5E16");
                location.reload();
              } else {
                alert("\u5E16\u5B50\u8D2D\u4E70\u5931\u8D25");
              }
            }
          );
        });
      };
      copyBuyThreadList = function() {
        $(document).on("change", ".buy-thread-list", function() {
          let $this2 = $(this);
          if ($this2.val() !== "copyList") return;
          let list = $this2.find("option").map(function(index) {
            let name2 = $(this).text();
            if (index === 0 || index === 1 || name2.includes("-".repeat(11))) return null;
            else return name2;
          }).get().join("\n");
          $this2.get(0).selectedIndex = 0;
          if (!list) {
            alert("\u6682\u65F6\u65E0\u4EBA\u8D2D\u4E70");
            return;
          }
          let $dialog2 = $(`
<div class="modal fade" id="buyThreadListDialog" tabindex="-1" role="dialog" aria-labelledby="buyThreadListDialogTitle"
     aria-hidden="true">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="buyThreadListDialogTitle">\u8D2D\u4E70\u4EBA\u540D\u5355</h5>
        <button class="close" data-dismiss="modal" type="button" aria-label="\u5173\u95ED">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <textarea class="form-control" name="buyThreadListContent" rows="14" aria-label="\u8D2D\u4E70\u4EBA\u540D\u5355">${list}</textarea>
        </div>
      </div>
    </div>
  </div>
</div>
`).appendTo("body");
          $dialog2.on("shown.bs.modal", function() {
            $dialog2.find('[name="buyThreadListContent"]').select().focus();
          }).on("hidden.bs.modal", function() {
            $dialog2.remove();
          }).modal("show");
        });
      };
      handleFloorImage = function() {
        $(document).on("click", ".img", function() {
          let $this2 = $(this);
          if ($this2.parent().is("a") || this.naturalWidth <= $this2.closest(".read-content").width()) return;
          location.href = $this2.attr("src");
        });
      };
      gotoFloor = function() {
        if (Info.floor && Info.floor > 0) {
          let hashName = $(`article[data-floor="${Info.floor}"]`).prev("a").attr("name");
          if (hashName) location.hash = "#" + hashName;
        }
      };
      handleFastGotoFloorBtn = function() {
        $(".fast-goto-floor").click(function(e) {
          e.preventDefault();
          let action = $(this).data("url");
          if (!action) return;
          let floor = parseInt(prompt("\u4F60\u8981\u8DF3\u8F6C\u5230\u54EA\u4E00\u5C42\u697C\uFF1F"));
          if (!floor || floor <= 0) return;
          location.href = makeUrl(action, `page=${Math.floor(floor / Config.perPageFloorNum) + 1}&floor=${floor}`);
        });
      };
      handleTuiThreadBtn = function() {
        $(".tui-btn").click(function(e) {
          e.preventDefault();
          let $this2 = $(this);
          if ($this2.data("wait")) return;
          $this2.data("wait", true);
          $.ajax({
            type: "POST",
            url: "/diy_read_tui.php",
            data: `tid=${Info.tid}&safeid=${Info.safeId}`,
            success: function(msg) {
              let matches = /<span.+?\+\d+!<\/span>\s*(\d+)/i.exec(msg);
              if (matches) {
                let $num = $this2.find("span:first");
                $num.text("+1");
                setTimeout(() => {
                  $num.text(matches[1]);
                }, 1e3);
              } else if (/已推过/.test(msg)) {
                alert("\u5DF2\u63A8\u8FC7");
              } else {
                alert("\u64CD\u4F5C\u5931\u8D25");
              }
            },
            error: function() {
              alert("\u64CD\u4F5C\u5931\u8D25");
            },
            complete: function() {
              $this2.removeData("wait");
            }
          });
        });
      };
      handleCopyCodeBtn = function() {
        $(document).on("click", ".copy-code", function(e) {
          e.preventDefault();
          let $this2 = $(this);
          if (copyText($this2.next("pre"), $this2)) return;
          let code = $this2.data("code");
          if (code) {
            $this2.text("\u590D\u5236\u4EE3\u7801").removeData("code");
            $this2.next("textarea").remove();
            $this2.after(`<pre class="pre-scrollable">${code}</pre>`);
          } else {
            let $pre = $this2.next("pre");
            let html = $pre.html();
            $this2.text("\u8FD8\u539F\u4EE3\u7801").data("code", html);
            html = decodeHtmlSpecialChar(html);
            let height = $pre.height();
            if (height < 50) height = 50;
            if (height > 340) height = 340;
            $pre.remove();
            $(`<textarea class="form-control code-textarea" style="height: ${height}px" wrap="off">${html}</textarea>`).insertAfter($this2).select().focus();
          }
        });
      };
      getCheckedMultiQuoteData = function() {
        let quoteList = [];
        $(".multi-quote-check:checked").each(function() {
          let $article = $(this).closest("article");
          quoteList.push({ floor: $article.data("floor"), pid: $article.data("pid"), userName: getFloorUserName($article.data("username")) });
        });
        return quoteList;
      };
      bindMultiQuoteCheckClick = function() {
        $(document).on("click", ".multi-quote-check", function() {
          let data = localStorage[const_default.multiQuoteStorageName];
          if (data) {
            try {
              data = JSON.parse(data);
              if (!data || $.type(data) !== "object" || $.isEmptyObject(data)) data = null;
              else if (!("tid" in data) || data.tid !== Info.tid || $.type(data.quoteList) !== "object") data = null;
            } catch (ex) {
              data = null;
            }
          } else {
            data = null;
          }
          let quoteList = getCheckedMultiQuoteData();
          if (!data) {
            localStorage.removeItem(const_default.multiQuoteStorageName);
            data = { tid: Info.tid, quoteList: {} };
          }
          if (quoteList.length > 0) data.quoteList[Info.currentPageNum] = quoteList;
          else delete data.quoteList[Info.currentPageNum];
          localStorage[const_default.multiQuoteStorageName] = JSON.stringify(data);
        });
      };
      addUserMemo = function() {
        if ($.isEmptyObject(Config.userMemoList)) return;
        $(".read-floor").each(function() {
          let $this2 = $(this);
          let userName2 = getFloorUserName($this2.data("username"));
          let key = Object.keys(Config.userMemoList).find((name2) => name2 === userName2);
          if (!key) return;
          $this2.find(".floor-user").after(
            `<span class="tips font-size-sm" data-toggle="tooltip" title="\u5907\u6CE8\uFF1A${Config.userMemoList[key]}">[?]</span>`
          );
        });
      };
      replaceAttachLabel = function() {
        $(".attach-label").each(function() {
          let $this2 = $(this);
          if ($this2.closest(".blockquote").length > 0) return;
          let aid = $this2.data("aid");
          let pid = $this2.closest(".read-floor").data("pid");
          $this2.replaceWith(`<img class="img" src="/job.php?action=download&pid=${pid}&tid=${Info.tid}&aid=${aid}" alt="[\u9644\u4EF6\u56FE\u7247]">`);
        });
      };
      handleMoveThreadBtn = function() {
        $("#moveThreadBtn").click(function(e) {
          e.preventDefault();
          if (!confirm("\u662F\u5426\u5C06\u8BE5\u4E3B\u9898\u79FB\u5230[\u65E0\u9650\u5236\u8D44\u6E90\u533A]\uFF1F")) return;
          $.post("/diy_admin_read.php", `tid=${Info.tid}&safeid=${Info.safeId}`, function(msg) {
            alert(msg);
            location.reload();
          });
        });
      };
    }
  });

  // public/static/src/js/module/post.js
  var post_exports = {};
  __export(post_exports, {
    addRedundantKeywordWarning: () => addRedundantKeywordWarning,
    addSmileCode: () => addSmileCode,
    checkPostForm: () => checkPostForm,
    handleAttachBtns: () => handleAttachBtns,
    handleClearMultiQuoteDataBtn: () => handleClearMultiQuoteDataBtn,
    handleEditorBtns: () => handleEditorBtns,
    handleMultiQuote: () => handleMultiQuote,
    specialPostTitleChange: () => specialPostTitleChange
  });
  var handleEditorBtns, checkPostForm, handleAttachBtns, addSmileCode, handleMultiQuote, handleClearMultiQuoteDataBtn, addRedundantKeywordWarning, specialPostTitleChange;
  var init_post = __esm({
    "public/static/src/js/module/post.js"() {
      "use strict";
      init_util();
      init_const();
      init_msg();
      handleEditorBtns = function() {
        let textArea = $("#postContent").get(0);
        $(document).on("click", ".editor-btn-group button[data-action]", function() {
          let action = $(this).data("action");
          let value = "";
          switch (action) {
            case "link":
              value = prompt("\u8BF7\u8F93\u5165\u94FE\u63A5URL\uFF1A", "http://");
              break;
            case "img":
              value = prompt("\u8BF7\u8F93\u5165\u56FE\u7247URL\uFF1A", "http://");
              break;
            case "sell":
              value = prompt("\u8BF7\u8F93\u5165\u51FA\u552E\u91D1\u989D\uFF1A", 1);
              break;
            case "hide":
              value = prompt("\u8BF7\u8F93\u5165\u795E\u79D8\u7B49\u7EA7\uFF1A", 1);
              break;
            case "audio":
              {
                value = prompt("\u8BF7\u8F93\u5165HTML5\u97F3\u9891\u5B9E\u9645\u5730\u5740\uFF1A\n\uFF08\u53EF\u76F4\u63A5\u8F93\u5165\u7F51\u6613\u4E91\u97F3\u4E50\u7684\u5355\u66F2\u5730\u5740\uFF0C\u5C06\u81EA\u52A8\u8F6C\u6362\u4E3A\u5916\u94FE\u5730\u5740\uFF09", "http://");
                let matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(value);
                if (matches) value = `https://music.miaola.work/163/${matches[1]}.mp3`;
                matches = /^https?:\/\/www\.xiami\.com\/song\/(\w+)/i.exec(value);
                if (matches) value = `https://music.miaola.work/xiami/${matches[1]}.mp3`;
              }
              break;
            case "video":
              {
                value = prompt("\u8BF7\u8F93\u5165HTML5\u89C6\u9891\u5B9E\u9645\u5730\u5740\uFF1A\n\uFF08\u53EF\u76F4\u63A5\u8F93\u5165YouTube\u89C6\u9891\u9875\u9762\u7684\u5730\u5740\uFF0C\u5C06\u81EA\u52A8\u8F6C\u6362\u4E3A\u5916\u94FE\u5730\u5740\uFF09", "http://");
                let matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(value);
                if (matches) value = `https://video.miaola.work/youtube/${matches[1]}`;
                matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(value);
                if (matches) value = `https://video.miaola.work/youtube/${matches[1]}`;
              }
              break;
          }
          if (value === null) return;
          let selText = "";
          let code = "";
          switch (action) {
            case "link":
              selText = getSelText(textArea);
              code = `[url=${value}]${selText}[/url]`;
              break;
            case "img":
              code = `[img]${value}[/img]`;
              break;
            case "quote":
              selText = getSelText(textArea);
              code = `[quote]${selText}[/quote]`;
              break;
            case "code":
              selText = getSelText(textArea);
              code = `[code]${selText}[/code]`;
              break;
            case "sell":
              selText = getSelText(textArea);
              code = `[sell=${value}]${selText}[/sell]`;
              break;
            case "hide":
              selText = getSelText(textArea);
              code = `[hide=${value}]${selText}[/hide]`;
              break;
            case "bold":
              selText = getSelText(textArea);
              code = `[b]${selText}[/b]`;
              break;
            case "italic":
              selText = getSelText(textArea);
              code = `[i]${selText}[/i]`;
              break;
            case "underline":
              selText = getSelText(textArea);
              code = `[u]${selText}[/u]`;
              break;
            case "strike":
              selText = getSelText(textArea);
              code = `[strike]${selText}[/strike]`;
              break;
            case "super":
              selText = getSelText(textArea);
              code = `[sup]${selText}[/sup]`;
              break;
            case "sub":
              selText = getSelText(textArea);
              code = `[sub]${selText}[/sub]`;
              break;
            case "horizontal":
              code = `[hr]`;
              break;
            case "align-left":
              selText = getSelText(textArea);
              code = `[align=left]${selText}[/align]`;
              break;
            case "align-center":
              selText = getSelText(textArea);
              code = `[align=center]${selText}[/align]`;
              break;
            case "align-right":
              selText = getSelText(textArea);
              code = `[align=right]${selText}[/align]`;
              break;
            case "fly":
              selText = getSelText(textArea);
              code = `[fly]${selText}[/fly]`;
              break;
            case "audio":
              code = `[audio]${value}[/audio]`;
              break;
            case "video":
              code = `[video]${value}[/video]`;
              break;
          }
          if (!code) return;
          addCode(textArea, code, selText);
          textArea.focus();
        });
        $("#fontSizeDropdownMenu").on("click", "a", function(e) {
          e.preventDefault();
          let size = $(this).data("size");
          let selText = getSelText(textArea);
          let code = `[size=${size}]${selText}[/size]`;
          addCode(textArea, code, selText);
          textArea.focus();
        });
        $("#colorDropdownMenu, #bgColorDropdownMenu").on("click", "span", function() {
          let $this2 = $(this);
          let codeType = $this2.parent().is("#bgColorDropdownMenu") ? "backcolor" : "color";
          let color = $this2.data("color");
          let selText = getSelText(textArea);
          let code = `[${codeType}=${color}]${selText}[/${codeType}]`;
          addCode(textArea, code, selText);
          textArea.focus();
        });
      };
      checkPostForm = function() {
        $("#postForm").submit(function() {
          let $postType = $("#postType");
          if ($postType.length > 0 && !$postType.val()) {
            alert("\u6CA1\u6709\u9009\u62E9\u4E3B\u9898\u5206\u7C7B");
            $postType.focus();
            return false;
          }
          let $postTitle = $('[name="atc_title"]');
          if ($postTitle.length > 0) {
            let length = getStrByteLen($postTitle.val());
            if (!length) {
              alert("\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A");
              $postTitle.focus();
              return false;
            } else if (length > 100) {
              alert(`\u6807\u9898\u957F\u5EA6\u4E3A ${length} \u5B57\u8282(\u4E0D\u53EF\u8D85\u8FC7 100 \u5B57\u8282)\uFF0C\u8BF7\u51CF\u5C11\u6807\u9898\u957F\u5EA6`);
              $postTitle.focus();
              return false;
            }
          }
          let $voteItemContent = $("#voteItemContent");
          if ($voteItemContent.length > 0) {
            if (!$voteItemContent.val().trim()) {
              alert("\u6295\u7968\u9009\u9879\u4E0D\u80FD\u4E3A\u7A7A");
              $voteItemContent.focus();
              return false;
            }
          }
          let $postContent = $("#postContent");
          if ($postContent.length > 0) {
            let length = getStrByteLen($postContent.val().trim());
            if (length < 12) {
              alert("\u6587\u7AE0\u5185\u5BB9\u5C11\u4E8E 12 \u4E2A\u5B57\u8282");
              $postContent.focus();
              return false;
            } else if (length > 5e4) {
              alert("\u6587\u7AE0\u5185\u5BB9\u5927\u4E8E 50000 \u4E2A\u5B57\u8282");
              $postContent.focus();
              return false;
            }
          }
          let $postGjc = $("#postGjc");
          if ($postGjc.length > 0 && Info.action === "new" && !$postGjc.val().trim()) {
            alert("\u8BF7\u5728\u5185\u5BB9\u6587\u672C\u6846\u7684\u4E0B\u65B9\u586B\u5199\u5173\u952E\u8BCD\uFF0C\u4EE5\u65B9\u4FBF\u641C\u7D22\uFF0C\u4E5F\u53EF\u4EE5\u5728\u6807\u9898\u4E2D\u9009\u62E9\u4EFB\u610F\u4E00\u4E2A\u8BCD\u586B\u5165");
            $postGjc.focus();
            return false;
          }
        });
      };
      handleAttachBtns = function() {
        $(document).on("click", ".attach-area a[data-action]", function(e) {
          e.preventDefault();
          let $this2 = $(this);
          let $area = $this2.closest(".attach-area");
          let action = $this2.data("action");
          let id = $area.data("id");
          if (!id) return;
          if (action === "insert") {
            let type = $this2.data("type");
            let textArea = $("#postContent").get(0);
            let code = `[${type === "new" ? "upload" : "attachment"}=${id}]`;
            addCode(textArea, code);
            textArea.focus();
          } else if (action === "update") {
            $area.find(".attach-info").prop("hidden", true).after(
              `<label><input name="replace_${id}" type="file" aria-label="\u9009\u62E9\u9644\u4EF6"></label>`
            );
            $this2.data("action", "cancel").text("\u53D6\u6D88").blur();
            if (!$(document).data("attachUpdateAlert")) {
              alert("\u672C\u53CD\u5411\u4EE3\u7406\u670D\u52A1\u5668\u4E3A\u4E86\u63D0\u9AD8\u6027\u80FD\u5BF9\u56FE\u7247\u8BBE\u7F6E\u4E86\u7F13\u5B58\uFF0C\u66F4\u65B0\u9644\u4EF6\u56FE\u7247\u540E\u53EF\u80FD\u9700\u7B49\u5F85\u6700\u591A30\u5206\u949F\u624D\u80FD\u770B\u5230\u6548\u679C");
              $(document).data("attachUpdateAlert", true);
            }
          } else if (action === "cancel") {
            $area.find(".attach-info").prop("hidden", false).next("label").remove();
            $this2.data("action", "update").text("\u66F4\u65B0").blur();
          } else if (action === "delete") {
            $area.remove();
          }
        });
        $(document).on("change", '[type="file"]', function() {
          let $this2 = $(this);
          let matches = /\.(\w+)$/.exec($this2.val());
          if (!matches || !["jpg", "gif", "png", "torrent"].includes(matches[1].toLowerCase())) {
            alert("\u9644\u4EF6\u7C7B\u578B\u4E0D\u5339\u914D");
            return;
          }
          let type = $this2.data("type");
          if (type === "new") {
            $this2.removeData("type").parent().next().prop("hidden", false);
            let $newAttachArea = $("#newAttachArea");
            let totalNum = $newAttachArea.find('[type="file"]').length;
            if (totalNum >= 5) return;
            let $lastAttachArea = $newAttachArea.find('[type="file"]:last').closest(".attach-area");
            let id = parseInt($lastAttachArea.data("id"));
            if (!id) return;
            id++;
            $(`
<div class="form-group row font-size-sm attach-area" data-id="${id}">
  <div class="col-12 col-form-label">
    <label>
      <input name="attachment_${id}" data-type="new" type="file" aria-label="\u9009\u62E9\u9644\u4EF6">
    </label>
    <span hidden>
      <a data-action="insert" data-type="new" href="#">\u63D2\u5165</a>&nbsp;
      <a data-action="delete" href="#">\u5220\u9664</a>
    </span>
  </div>
  <div class="col-4">
    <label class="sr-only" for="atc_downrvrc${id}">\u795E\u79D8\u7CFB\u6570</label>
    <input class="form-control form-control-sm" id="atc_downrvrc${id}" name="atc_downrvrc${id}" data-toggle="tooltip" 
type="number" value="0" min="0" title="\u795E\u79D8\u7CFB\u6570" placeholder="\u795E\u79D8\u7CFB\u6570">
  </div>
  <div class="col-8">
    <label class="sr-only" for="atc_desc${id}">\u63CF\u8FF0</label>
    <input class="form-control form-control-sm" id="atc_desc${id}" name="atc_desc${id}" data-toggle="tooltip" type="text" 
title="\u63CF\u8FF0" placeholder="\u63CF\u8FF0">
  </div>
</div>
`).insertAfter($lastAttachArea).find('[data-toggle="tooltip"]').tooltip({ "container": "body" });
          }
        });
      };
      addSmileCode = function($node) {
        $(".smile-panel").on("click", "img", function() {
          $(".smile-panel").addClass("open");
          let textArea = $node.get(0);
          if (!textArea) return;
          let code = `[s:${$(this).data("id")}]`;
          addCode(textArea, code, "");
          textArea.blur();
        }).parent().on("shown.bs.dropdown", function() {
          $(".smile-panel img").each(function() {
            let $this2 = $(this);
            if (!$this2.attr("src")) {
              $this2.attr("src", $this2.data("src"));
            }
          });
        }).on("hide.bs.dropdown", function(e) {
          let $relatedTarget = $(e.relatedTarget);
          if (!$relatedTarget.data("open")) $relatedTarget.removeData("open");
          else return e.preventDefault();
        });
        $("#smileDropdownBtn").click(function() {
          let $this2 = $(this);
          $this2.data("open", !$this2.data("open"));
        });
      };
      handleMultiQuote = function(type = 1) {
        let data = localStorage[const_default.multiQuoteStorageName];
        if (!data) return;
        try {
          data = JSON.parse(data);
        } catch (ex) {
          return;
        }
        if (!data || $.type(data) !== "object" || $.isEmptyObject(data)) return;
        let { tid, quoteList } = data;
        if (!Info.tid || tid !== Info.tid || $.type(quoteList) !== "object") return;
        if (type === 2 && !Info.fid) return;
        let list = [];
        for (let data2 of Object.values(quoteList)) {
          if (!Array.isArray(data2)) continue;
          for (let quote of data2) {
            list.push(quote);
          }
        }
        if (!list.length) {
          localStorage.removeItem(const_default.multiQuoteStorageName);
          return;
        }
        let keywords = /* @__PURE__ */ new Set();
        let content = "";
        let $keywords = $('[name="diy_guanjianci"]');
        if (type === 2) {
          wait(`<span class="mr-3">\u6B63\u5728\u83B7\u53D6\u5F15\u7528\u5185\u5BB9\u4E2D&hellip;</span>\u5269\u4F59\uFF1A<em class="text-warning countdown-num">${list.length}</em>`);
          $(document).clearQueue("MultiQuote");
        }
        $.each(list, function(index, data2) {
          if (typeof data2.floor === "undefined" || typeof data2.pid === "undefined") return;
          keywords.add(data2.userName);
          if (type === 2) {
            $(document).queue("MultiQuote", function() {
              $.get(makeUrl(
                "post/index",
                `action=quote&fid=${Info.fid}&tid=${tid}&pid=${data2.pid}&article=${data2.floor}&t=${(/* @__PURE__ */ new Date()).getTime()}`
              ), function({ postContent }) {
                content += postContent ? postContent + (index === list.length - 1 ? "" : "\n") : "";
                let $countdownNum = $(".countdown-num:last");
                $countdownNum.text(parseInt($countdownNum.text()) - 1);
                if (index === list.length - 1) {
                  destroy();
                  $("#postContent").val(content).focus();
                  $keywords.trigger("change");
                } else {
                  setTimeout(() => $(document).dequeue("MultiQuote"), 100);
                }
              });
            });
          } else {
            content += `[quote]\u56DE ${data2.floor}\u697C(${data2.userName}) \u7684\u5E16\u5B50[/quote]
`;
          }
        });
        for (let [index, quote] of list.entries()) {
        }
        $keywords.val([...keywords].join(","));
        $("#postForm").submit(function() {
          localStorage.removeItem(const_default.multiQuoteStorageName);
        });
        if (type === 2) {
          $(document).dequeue("MultiQuote");
        } else {
          $("#postContent").val(content).focus();
          $keywords.trigger("change");
        }
      };
      handleClearMultiQuoteDataBtn = function() {
        $(".clear-multi-quote-data-btn").click(function(e) {
          e.preventDefault();
          if (!confirm("\u662F\u5426\u6E05\u9664\u591A\u91CD\u5F15\u7528\u6570\u636E\uFF1F")) return;
          localStorage.removeItem(const_default.multiQuoteStorageName);
          $('[name="diy_guanjianci"]').val("");
          $("#postContent").val("");
        });
      };
      addRedundantKeywordWarning = function() {
        $('input[name="diy_guanjianci"]').change(function() {
          let $this2 = $(this);
          let keywords = $.trim($this2.val()).split(",").filter((str) => str);
          if (keywords.length > 5) {
            alert("\u6240\u586B\u5173\u952E\u8BCD\u5DF2\u8D85\u8FC75\u4E2A\uFF0C\u591A\u4F59\u7684\u5173\u952E\u8BCD\u5C06\u88AB\u5FFD\u7565");
            $this2.select().focus();
          }
        });
      };
      specialPostTitleChange = function() {
        let wangPanType = $.trim($("#wangPanType").val());
        let fileSize = $.trim($("#fileSize").val());
        let expiryDate = $.trim($("#expiryDate").val());
        let fileFormat = $.trim($("#fileFormat").val());
        let ziGou = $("#ziGou").prop("checked") ? "[\u81EA\u8D2D]" : "";
        let xinZuo = $("#xinZuo").prop("checked") ? "[\u65B0\u4F5C]" : "";
        let fileTitle = $.trim($("#fileTitle").val());
        let now = /* @__PURE__ */ new Date();
        let month = (now.getMonth() + 1).toString().padStart(2, "0");
        let day = now.getDate().toString().padStart(2, "0");
        let previewTitle = `[${month}.${day}]${ziGou}${xinZuo}${fileTitle}[${wangPanType}${expiryDate}][${fileSize}]${fileFormat ? `[${fileFormat}]` : ""}`;
        let realTitle = `[${month}.${day}]${ziGou}${fileTitle}[${wangPanType}${expiryDate}][${fileSize}]${fileFormat ? `[${fileFormat}]` : ""}`;
        let titleLength = getStrByteLen(realTitle);
        if (titleLength > 100) {
          $("#previewTitle").text(`\u6807\u9898\u603B\u957F\u5EA6\u4E3A${titleLength}\u5B57\u8282(\u4E0D\u53EF\u8D85\u8FC7100\u5B57\u8282)\uFF0C\u8BF7\u51CF\u5C11\u6807\u9898\u957F\u5EA6`).addClass("text-danger");
        } else {
          $("#previewTitle").text(previewTitle).removeClass("text-danger");
        }
        $("#realTitle").val(realTitle);
      };
    }
  });

  // public/static/src/js/module/other.js
  var other_exports = {};
  __export(other_exports, {
    assignBirthdayField: () => assignBirthdayField,
    bindFavorPageBtnsClick: () => bindFavorPageBtnsClick,
    bindFriendPageBtnsClick: () => bindFriendPageBtnsClick,
    bindMessageActionBtnsClick: () => bindMessageActionBtnsClick,
    handleBuyItemBtns: () => handleBuyItemBtns,
    handleProfilePage: () => handleProfilePage,
    handleRegisterPage: () => handleRegisterPage,
    handleUploadAvatarFileBtn: () => handleUploadAvatarFileBtn,
    handleUserPageBtns: () => handleUserPageBtns,
    highlightUnReadAtTipsMsg: () => highlightUnReadAtTipsMsg,
    showMyInfoInItemShop: () => showMyInfoInItemShop,
    showSelfRateErrorSizeSubmitWarning: () => showSelfRateErrorSizeSubmitWarning,
    syncPerPageFloorNum: () => syncPerPageFloorNum
  });
  var highlightUnReadAtTipsMsg, bindFavorPageBtnsClick, bindFriendPageBtnsClick, assignBirthdayField, syncPerPageFloorNum, handleUploadAvatarFileBtn, bindMessageActionBtnsClick, handleRegisterPage, handleUserPageBtns, handleProfilePage, showSelfRateErrorSizeSubmitWarning, showMyInfoInItemShop, handleBuyItemBtns;
  var init_other = __esm({
    "public/static/src/js/module/other.js"() {
      "use strict";
      init_util();
      init_const();
      init_config();
      highlightUnReadAtTipsMsg = function() {
        if (Info.gjc !== Info.userName) return;
        let timeString = getCookie(const_default.prevAtTipsTimeCookieName);
        if (!timeString || !/^\d+日\d+时\d+分$/.test(timeString)) return;
        let prevString = "";
        $(".thread-list-item time").each(function(index) {
          let $this2 = $(this);
          let curString = $.trim($this2.text());
          if (index === 0) prevString = curString;
          if (timeString < curString && prevString >= curString) {
            $this2.addClass("text-danger");
            prevString = curString;
          } else return false;
        });
        $(document).on("click", ".thread-list-item .thread-link-item a", function() {
          deleteCookie(const_default.prevAtTipsTimeCookieName);
        });
      };
      bindFavorPageBtnsClick = function() {
        let $form = $('form[name="favorForm"]');
        $(document).on("click", ".remove-catalog", () => confirm("\u662F\u5426\u5220\u9664\u8BE5\u76EE\u5F55\uFF1F"));
        $("#addCatalog").click(function(e) {
          e.preventDefault();
          let type = $.trim(prompt("\u8BF7\u8F93\u5165\u6536\u85CF\u5939\u76EE\u5F55\u540D\u79F0\uFF1A"));
          if (!type) return;
          $form.find('[name="job"]').val("addtype");
          $form.find('[name="type"]').val(type);
          $form.submit();
        });
        $("#favorActionBtns").on("click", "button", function() {
          let action = $(this).data("action");
          if (action === "selectAll") {
            selectAll($('[name="delid[]"]'));
          } else if (action === "selectInverse") {
            selectInverse($('[name="delid[]"]'));
          } else if (action === "delete") {
            let $checked = $('[name="delid[]"]:checked');
            if ($checked.length > 0 && confirm(`\u662F\u5426\u5220\u9664\u8FD9${$checked.length}\u9879\uFF1F`)) {
              $form.find('[name="job"]').val("clear");
              $form.submit();
            }
          }
        });
        $("#convertCatalogDropdownMenu").on("click", "a", function(e) {
          e.preventDefault();
          let type = $(this).data("type");
          let $checked = $('[name="delid[]"]:checked');
          if ($checked.length > 0 && confirm(`\u662F\u5426\u5C06\u8FD9${$checked.length}\u9879\u8F6C\u6362\u5230\u6307\u5B9A\u76EE\u5F55\uFF1F`)) {
            $form.find('[name="job"]').val("change");
            $form.find('[name="type"]').val(type);
            $form.submit();
          }
        });
      };
      bindFriendPageBtnsClick = function() {
        $("#friendActionBtns").on("click", '[type="button"]', function() {
          let action = $(this).data("action");
          if (action === "selectAll") {
            selectAll($('[name="selid[]"]'));
          } else if (action === "selectInverse") {
            selectInverse($('[name="selid[]"]'));
          }
        });
      };
      assignBirthdayField = function() {
        $("#birthday").change(function() {
          let value = $(this).val().trim();
          let matches = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value);
          let year = "", month = "", day = "";
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
      syncPerPageFloorNum = function() {
        const syncConfig = function() {
          let perPageFloorNum = parseInt($('[name="p_num"]').val());
          if (perPageFloorNum === 0) perPageFloorNum = 10;
          if (!isNaN(perPageFloorNum) && perPageFloorNum !== Config.perPageFloorNum) {
            Config.perPageFloorNum = perPageFloorNum;
            write();
          }
        };
        syncConfig();
        $("#creator").submit(function() {
          read();
          syncConfig();
        });
      };
      handleUploadAvatarFileBtn = function() {
        $("#browseAvatar").change(function() {
          let $this2 = $(this);
          let matches = /\.(\w+)$/.exec($this2.val());
          if (!matches || !["jpg", "gif", "png"].includes(matches[1].toLowerCase())) {
            alert("\u5934\u50CF\u56FE\u7247\u7C7B\u578B\u4E0D\u5339\u914D");
          }
        });
      };
      bindMessageActionBtnsClick = function() {
        $("#messageActionBtns").on("click", "button", function() {
          let $form = $("#messageListForm");
          let name2 = $(this).attr("name");
          if (name2 === "selectAll") {
            selectAll($('[name="delid[]"]'));
          } else if (name2 === "selectInverse") {
            selectInverse($('[name="delid[]"]'));
          } else if (name2 === "selectCustom") {
            let title2 = $.trim(
              prompt("\u8BF7\u586B\u5199\u6240\u8981\u9009\u62E9\u7684\u5305\u542B\u6307\u5B9A\u5B57\u7B26\u4E32\u7684\u77ED\u6D88\u606F\u6807\u9898\uFF08\u53EF\u7528|\u7B26\u53F7\u5206\u9694\u591A\u4E2A\u6807\u9898\uFF09", "\u6536\u5230\u4E86\u4ED6\u4EBA\u8F6C\u8D26\u7684\u8D21\u732E|\u6536\u5230\u4E86\u4ED6\u4EBA\u8F6C\u8D26\u7684KFB|\u94F6\u884C\u6C47\u6B3E\u901A\u77E5|\u60A8\u7684\u6587\u7AE0\u88AB\u8BC4\u5206|\u60A8\u7684\u6587\u7AE0\u88AB\u5220\u9664")
            );
            if (!title2) return;
            $('[name="delid[]"]').prop("checked", false);
            $("a.thread-link").each(function() {
              let $this2 = $(this);
              for (let key of title2.split("|")) {
                if ($this2.text().toLowerCase().includes(key.toLowerCase())) {
                  $this2.parent().find('[name="delid[]"]').prop("checked", true);
                }
              }
            });
          } else if (name2 === "download") {
            let $checked = $('[name="delid[]"]:checked');
            if ($checked.length > 0 && confirm(`\u662F\u5426\u4E0B\u8F7D\u8FD9${$checked.length}\u9879\uFF1F`)) {
              $form.attr("action", "/message.php").find('[name="action"]').val("down");
              $form.submit();
            }
          } else if (name2 === "delete") {
            let $checked = $('[name="delid[]"]:checked');
            if ($checked.length > 0 && confirm(`\u662F\u5426\u5220\u9664\u8FD9${$checked.length}\u9879\uFF1F`)) {
              $form.attr("action", makeUrl("message/job")).find('[name="action"]').val("del");
              $form.submit();
            }
          }
        });
      };
      handleRegisterPage = function() {
        $(document).on("change", "input[name]", function() {
          let $this2 = $(this);
          let name2 = $this2.attr("name");
          let value = $this2.val();
          if (!value) {
            showValidationMsg($this2, "clear");
            return;
          }
          showValidationMsg($("#response"), "clear");
          if (name2 === "regpwd") {
            if (value.length > 16 || value.length < 6) {
              showValidationMsg($this2, "error", "\u5BC6\u7801\u957F\u5EA6\u4E0D\u6B63\u786E");
            } else {
              showValidationMsg($this2, "clear");
              $('[name="regpwdrepeat"]').trigger("change");
            }
          } else if (name2 === "regpwdrepeat") {
            if (value !== $('[name="regpwd"]').val()) showValidationMsg($this2, "error", "\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u76F8\u7B26");
            else showValidationMsg($this2, "clear");
          }
        });
        $("#registerBtn").click(function() {
          let $this2 = $(this);
          let $form = $this2.closest("form");
          if ($form.find(".has-danger").length > 0) {
            alert("\u8BF7\u6B63\u786E\u586B\u5199\u8868\u5355");
            return false;
          }
          let action = $this2.data("action");
          if (action === "check") {
            if (typeof window.namecheck !== "function") return;
            if (!window.namecheck()) return;
            let $response = $("#response");
            $this2.prop("disabled", true);
            showValidationMsg($response, "wait", "\u68C0\u67E5\u4E2D\uFF0C\u8BF7\u7A0D\u7B49&hellip;");
            $.post(makeUrl("register/check"), $('[name="checkForm"]').serialize(), ({ type, msg }) => {
              $this2.prop("disabled", false);
              showValidationMsg($response, type, msg);
              if (type === "success") $this2.data("action", "register").find("span:last-child").text("\u6CE8\u518C");
            }).fail(() => {
              showValidationMsg($response, "error", "\u54CD\u5E94\u5931\u8D25");
            });
          } else {
            $form.submit();
          }
        });
      };
      handleUserPageBtns = function() {
        let $area = $("#profileBtns");
        let userName2 = $area.data("username");
        $area.on("click", '[name="followUser"], [name="blockUser"]', function() {
          read();
          let $this2 = $(this);
          let str = "\u5173\u6CE8";
          let userList = Config.followUserList;
          if ($this2.attr("name") === "blockUser") {
            str = "\u5C4F\u853D";
            userList = Config.blockUserList;
            Config.blockUserEnabled = true;
          } else Config.followUserEnabled = true;
          if ($this2.text().includes("\u53D6\u6D88")) {
            let index = inFollowOrBlockUserList(userName2, userList);
            if (index > -1) {
              userList.splice(index, 1);
              write();
            }
            $this2.removeClass("btn-outline-danger").addClass("btn-outline-primary").find("span").text(str + "\u7528\u6237");
            alert("\u8BE5\u7528\u6237\u5DF2\u88AB\u53D6\u6D88" + str);
          } else {
            if (inFollowOrBlockUserList(userName2, userList) === -1) {
              if (str === "\u5C4F\u853D") {
                let type = Config.blockUserDefaultType;
                type = prompt("\u8BF7\u586B\u5199\u5C4F\u853D\u7C7B\u578B\uFF0C0\uFF1A\u4E3B\u9898\u548C\u56DE\u5E16\uFF1B1\uFF1A\u4E3B\u9898\uFF1B2\uFF1A\u56DE\u5E16", type);
                if (type === null) return;
                type = parseInt(type);
                if (isNaN(type) || type < 0 || type > 2) type = Config.blockUserDefaultType;
                userList.push({ name: userName2, type });
              } else {
                userList.push({ name: userName2 });
              }
              write();
            }
            $this2.removeClass("btn-outline-primary").addClass("btn-outline-danger").find("span").text("\u53D6\u6D88" + str);
            alert("\u8BE5\u7528\u6237\u5DF2\u88AB" + str);
          }
        }).find('[name="followUser"], [name="blockUser"]').each(function() {
          let $this2 = $(this);
          let str = "\u5173\u6CE8";
          let userList = Config.followUserList;
          if ($this2.attr("name") === "blockUser") {
            str = "\u5C4F\u853D";
            userList = Config.blockUserList;
          }
          if (inFollowOrBlockUserList(userName2, userList) > -1) {
            $this2.removeClass("btn-outline-primary").addClass("btn-outline-danger").find("span").text("\u53D6\u6D88" + str);
          }
        });
      };
      handleProfilePage = function() {
        let $registerDate = $("#registerDate");
        let matches = /(\d{4})-(\d{2})-(\d{2})/.exec($registerDate.text());
        if (matches) {
          let now = /* @__PURE__ */ new Date();
          let [, year, month, day] = matches;
          if (parseInt(month) === now.getMonth() + 1 && parseInt(day) === now.getDate() && parseInt(year) <= now.getFullYear()) {
            $registerDate.attr("title", `\u4ECA\u5929\u662F\u8BE5\u7528\u6237\u6CE8\u518C${now.getFullYear() - parseInt(year)}\u5468\u5E74\u7EAA\u5FF5\u65E5`).addClass("text-danger help");
          }
        }
      };
      showSelfRateErrorSizeSubmitWarning = function() {
        $('form[name="selfRate"]').submit(function() {
          let $this2 = $(this);
          let ratingSize = parseFloat($this2.find('[name="psize"]').val());
          if (isNaN(ratingSize) || ratingSize <= 0) return;
          if (parseInt($this2.find('[name="psizegb"]').val()) === 2) ratingSize *= 1024;
          let titleSize = parseInt($this2.find("a[data-title-size]").data("title-size"));
          if (titleSize && (titleSize > ratingSize * (100 + 3) / 100 + 1 || titleSize < ratingSize * (100 - 3) / 100 - 1)) {
            return confirm(`\u6807\u9898\u6587\u4EF6\u5927\u5C0F(${titleSize.toLocaleString()}M)\u4E0E\u8BA4\u5B9A\u6587\u4EF6\u5927\u5C0F(${ratingSize.toLocaleString()}M)\u4E0D\u4E00\u81F4\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F`);
          }
        });
      };
      showMyInfoInItemShop = function() {
        $.get(`/profile.php?action=show&uid=${Info.uid}&t=${$.now()}`, function(html) {
          let kfbMatches = /论坛货币：(\d+)\s*KFB/.exec(html);
          let gxMatches = /贡献数值：(\d+(?:\.\d+)?)/.exec(html);
          if (!kfbMatches && !gxMatches) return;
          let kfb = parseInt(kfbMatches[1]);
          let gx = parseFloat(gxMatches[1]);
          $("#myInfo").html(`\u5F53\u524D\u6301\u6709 <b>${kfb.toLocaleString()}</b> KFB \u548C <b>${gx}</b> \u8D21\u732E`);
        });
      };
      handleBuyItemBtns = function() {
        $("#itemList").on("click", 'button[name="buy"]', function() {
          let $this2 = $(this);
          let itemId = $this2.data("id");
          if (!confirm("\u662F\u5426\u8D2D\u4E70\u6B64\u7269\u54C1\uFF1F")) return;
          $this2.prop("disabled", true);
          $.post("/kf_fw_ig_shop.php", `buy=${itemId}&safeid=${Info.safeId}`).done(function(html) {
            let msg = removeHtmlTag(html);
            alert(msg);
          }).fail(() => alert("\u8FDE\u63A5\u8D85\u65F6")).always(() => $this2.prop("disabled", false));
        });
      };
    }
  });

  // public/static/src/js/app.js
  init_config();
  init_util();
  init_const();
  init_msg();
  init_dialog();
  init_script();
  init_public();
  init_module();
  init_read();
  init_post();
  init_other();
  init_configDialog();
  window.pageId = $("body").attr("id");
  var exportModule = function() {
    try {
      window.Util = (init_util(), __toCommonJS(util_exports));
      window.Const = (init_const(), __toCommonJS(const_exports)).default;
      window.Msg = (init_msg(), __toCommonJS(msg_exports));
      window.Dialog = (init_dialog(), __toCommonJS(dialog_exports));
      window.Script = (init_script(), __toCommonJS(script_exports));
      window.Public = (init_public(), __toCommonJS(public_exports));
      window.Index = (init_module(), __toCommonJS(module_exports));
      window.Read = (init_read(), __toCommonJS(read_exports));
      window.Post = (init_post(), __toCommonJS(post_exports));
      window.Other = (init_other(), __toCommonJS(other_exports));
      const Conf = (init_config(), __toCommonJS(config_exports));
      window.readConfig = Conf.read;
      window.writeConfig = Conf.write;
    } catch (ex) {
      console.log(ex);
    }
  };
  var init2 = function() {
    if (pageId === "loginPage") return;
    let startTime = /* @__PURE__ */ new Date();
    exportModule();
    if (pageId === "registerPage") {
      handleRegisterPage();
      return;
    }
    init();
    if (Config.customCssEnabled && Config.customCssContent) {
      $("head").append(`<style>${Config.customCssContent}</style>`);
    }
    if (Config.customScriptEnabled) {
      runCustomScript("start");
    }
    preventCloseWindow();
    handleMainMenu();
    handleMainMenuLink();
    if (Config.showSidebarBtnGroupEnabled) {
      showSidebarBtnGroup();
    }
    handleSidebarRollBtn();
    handleSearchDialog();
    fillCommonForumPanel();
    showEditCommonForumDialog();
    if ($(".page-input").length > 0) {
      handlePageInput();
    }
    bindFastSubmitShortcutKey();
    if (pageId === "indexPage") {
      handleAtTipsBtn();
      handleIndexThreadPanel();
      handleSelectBg();
    } else if (pageId === "readPage") {
      gotoFloor();
      if (Config.threadContentFontSize > 0) {
        $("head").append(`<style>.read-content { font-size: ${Config.threadContentFontSize}px; }</style>`);
      }
      handleFastGotoFloorBtn();
      handleTuiThreadBtn();
      handleCopyFloorLinkBtn();
      handleFastReplyBtn();
      handleGoodPostBtn();
      handleBlockFloorBtn();
      handleBuyThreadBtn();
      copyBuyThreadList();
      replaceAttachLabel();
      handleFloorImage();
      checkPostForm();
      handleCopyCodeBtn();
      addSmileCode($("#postContent"));
      addRedundantKeywordWarning();
      bindMultiQuoteCheckClick();
      handleClearMultiQuoteDataBtn();
      handleMoveThreadBtn();
      $(".multi-reply-btn").click(() => handleMultiQuote(1));
      if (Config.userMemoEnabled) {
        addUserMemo();
      }
      handleInstallScriptLink();
    } else if (pageId === "postPage") {
      addRedundantKeywordWarning();
      checkPostForm();
      handleEditorBtns();
      addSmileCode($("#postContent"));
      handleAttachBtns();
      handleClearMultiQuoteDataBtn();
      if (Info.multiQuote) handleMultiQuote(2);
      $("#postTitleFormatArea").on("change", '[type="text"], [type="checkbox"]', () => specialPostTitleChange());
    } else if (pageId === "gjcPage") {
      highlightUnReadAtTipsMsg();
    } else if (pageId === "userPage") {
      handleUserPageBtns();
      handleProfilePage();
    } else if (pageId === "favorPage") {
      bindFavorPageBtnsClick();
    } else if (pageId === "friendPage") {
      bindFriendPageBtnsClick();
    } else if (pageId === "modifyPage") {
      syncPerPageFloorNum();
      assignBirthdayField();
      handleUploadAvatarFileBtn();
    } else if (pageId === "messagePage") {
      bindMessageActionBtnsClick();
    } else if (pageId === "readMessagePage") {
      handleFloorImage();
      handleCopyCodeBtn();
    } else if (pageId === "writeMessagePage") {
      addSmileCode($("#msgContent"));
    } else if (pageId === "selfRateRatingPage") {
      showSelfRateErrorSizeSubmitWarning();
    } else if (pageId === "haloPage") {
      $("#buyHaloBtns").on("click", "a", function() {
        if (!confirm(`\u662F\u5426${$(this).text().trim()}\u63D0\u5347\u4E00\u6B21\u6218\u529B\u5149\u73AF\uFF1F`)) return false;
        localStorage.removeItem("pd_tmp_log_" + Info.uid);
      });
    } else if (pageId === "itemShopPage") {
      handleBuyItemBtns();
      showMyInfoInItemShop();
    }
    if (Config.blockUserEnabled) blockUsers();
    if (Config.blockThreadEnabled) blockThread();
    if (Config.followUserEnabled) followUsers();
    if (Config.kfSmileEnhanceExtensionEnabled && ["readPage", "postPage", "writeMessagePage"].includes(pageId)) {
      $("body").append(
        `<script src="${Info.rootPath}${Info.staticPath}js/userScript/KfEmotion.min.user.js?ts=${Info.resTimestamp}"><\/script>`
      );
    }
    if (Config.adminMemberEnabled) {
      $('a[data-not-click="true"]').removeClass("not-click-link");
    }
    if (location.host.endsWith(".miaola.info")) {
      $(".change-domain-tips").show();
    }
    if (Config.customScriptEnabled) {
      runCustomScript("end");
    }
    $('[data-toggle="tooltip"]').tooltip({ "container": "body" });
    console.log(`\u811A\u672C\u52A0\u8F7D\u5B8C\u6BD5\uFF0C\u8017\u65F6\uFF1A${/* @__PURE__ */ new Date() - startTime}ms`);
  };
  $(document).ready(init2);
})();
