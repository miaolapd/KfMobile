// ==UserScript==
// @name        发帖常用文本
// @version     1.0
// @trigger     end
// @author      喵拉布丁
// @homepage    read/682170/spid/14036917/sf/6d7
// @description 在发帖框旁会显示常用文本下拉列表，选择相应项目即可在发帖框内快速添加相应文本
// ==/UserScript==
// ==UserScript==
// @name        发帖常用文本
// @version     1.0
// @trigger     end
// @author      喵拉布丁
// @homepage    read/682170/spid/14036917/sf/6d7
// @description 在发帖框旁会显示常用文本下拉列表，选择相应项目即可在发帖框内快速添加相应文本
// ==/UserScript==
"use strict";(function(){if(pageId!=="readPage"&&pageId!=="postPage")return;const s=['<a class="dropdown-item" href="#">感谢楼主的分享！</a>','<a class="dropdown-item" data-value="恭喜楼主！[s:44]" href="#">恭喜楼主！</a>','<a class="dropdown-item" data-action="隐藏内容" href="#">隐藏内容...</a>'],r={隐藏内容:function(){let o=parseInt(prompt("请输入神秘等级：",300));return isNaN(o)?"":"[hide="+o+"]隐藏内容[/hide]"}};let a=$(`
<div class="${pageId==="postPage"?"dropup mr-1":"dropdown ml-1"}">
  <button class="btn btn-secondary dropdown-toggle" id="commonPostTextDropdownBtn" type="button" data-toggle="dropdown" title="发帖常用文本"
          aria-label="发帖常用文本" aria-haspopup="true" aria-expanded="false">
    <i class="fa fa-list" aria-hidden="true"></i>
  </button>
  <div class="dropdown-menu common-post-text-dropdown-menu ${pageId==="readPage"?"dropdown-menu-right":""}" aria-labelledby="commonPostTextDropdownBtn">
    ${s.join("")}
  </div>
</div>
`);pageId==="postPage"?$("#smileDropdownBtn").parent().after(a):$("#smileDropdownBtn").parent().before(a),a.find(".dropdown-menu").on("click",".dropdown-item",function(o){o.preventDefault();let d=$(this),t="",i=d.data("action");if(i?typeof r[i]=="function"&&(t=r[i]()):(t=d.data("value"),t=t||$.trim(d.text())),t){let n=$("#postContent"),e=n.val();e+=(e&&!/\n$/.test(e)?`
`:"")+t,n.val(e).focus(),n.get(0).selectionStart=e.length,n.get(0).selectionEnd=e.length}})})();
