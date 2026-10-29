// ==UserScript==
// @name        发帖时自动附加额外内容
// @version     1.0
// @trigger     start
// @author      喵拉布丁
// @homepage    read/682170/spid/14035414/sf/6d7
// @description 在发帖时自动附加额外内容；可设置多组文本（发帖时将随机挑选一个进行附加），还可设置为函数；请勿加入过于影响论坛版面的文字（禁止加入图片、链接和购买框，字数有250字的限制）
// ==/UserScript==
// ==UserScript==
// @name        发帖时自动附加额外内容
// @version     1.0
// @trigger     start
// @author      喵拉布丁
// @homepage    read/682170/spid/14035414/sf/6d7
// @description 在发帖时自动附加额外内容；可设置多组文本（发帖时将随机挑选一个进行附加），还可设置为函数；请勿加入过于影响论坛版面的文字（禁止加入图片、链接和购买框，字数有250字的限制）
// ==/UserScript==
"use strict";(function(){if(pageId!=="readPage"&&pageId!=="postPage")return;const t={addText:[""],insertText:[""],excludeText:"",attachType:0,attachWhenLteWordNum:-1};let n=Util.getUrlParam("action");if(n==="modify")return;if(t.attachType===1&&(pageId==="readPage"||n==="reply"||n==="quote"))return;if(t.attachType===2&&pageId==="postPage"&&!n)return;$("#postForm").submit(function(){let a=$(this).find("#postContent"),i=a.val();if(!i)return;if(t.excludeText){if($.type(t.excludeText)==="regexp"){if(t.excludeText.test(i))return}else if(i.toLowerCase().includes(t.excludeText.toLowerCase()))return}if(t.attachWhenLteWordNum>-1&&i.length>t.attachWhenLteWordNum)return;const r=function(e){e=e.substring(0,250).replace(/\[(img|url|sell|audio|video).+?\/(img|url|sell|audio|video)\]/gi,"[代码已屏蔽]");let o=e.match(/\[size=\d+\]/gi);for(let s in o)parseInt(/\d+/.exec(o[s])[0])>=4&&(e=e.replace(o[s],"[size=1]"));return e},l=function(e){return typeof e=="function"?Util.removeUnpairedBBCodeContent(r(e().toString())):Util.removeUnpairedBBCodeContent(r(e[Math.floor(Math.random()*e.length)]))};r("[img]test[/img]").includes("[img]")||a.val(l(t.insertText)+i+l(t.addText))})})();
