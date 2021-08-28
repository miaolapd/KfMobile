/* 设置对话框模块 */
'use strict';
import * as Util from './util';
import Const from './const';
import * as Dialog from './dialog';
import {
    read as readConfig,
    write as writeConfig,
    clear as clearConfig,
    normalize as normalizeConfig,
    Config as defConfig,
} from './config';
import * as Script from './script';
import * as Public from './public';

/**
 * 显示设置对话框
 */
export const show = function () {
    const dialogName = 'configDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    let bodyContent = `
<div class="btn-group-sm text-right mb-1">
  <a class="btn btn-link text-danger" data-name="clearTmpData" href="#">清除临时数据</a>
  <a class="btn btn-link" data-name="openRunCommandDialog" href="#">运行命令</a>
</div>
<fieldset class="fieldset mb-3 py-2">
  <legend class="form-check">
    <input class="form-check-input" id="${dialogName}_showSidebarBtnGroupEnabled" name="showSidebarBtnGroupEnabled" type="checkbox">
    <label class="form-check-label" for="${dialogName}_showSidebarBtnGroupEnabled">显示侧边栏按钮组</label>
    <span class="tips" data-toggle="tooltip" title="显示侧边栏按钮组，可在下方设置要显示的按钮">[?]</span>
  </legend>
  
  <div class="mb-2 d-sm-inline-block">
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName}_showSidebarRollBtnEnabled" name="showSidebarRollBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName}_showSidebarRollBtnEnabled">滚动到页顶/页底</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName}_showSidebarMainMenuBtnEnabled" name="showSidebarMainMenuBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName}_showSidebarMainMenuBtnEnabled">主菜单</label>
    </div>
  </div>
  
  <div class="mb-2 d-sm-inline-block">
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName}_showSidebarForumListBtnEnabled" name="showSidebarForumListBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName}_showSidebarForumListBtnEnabled">版块列表</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName}_showSidebarSearchBtnEnabled" name="showSidebarSearchBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName}_showSidebarSearchBtnEnabled">搜索</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" id="${dialogName}_showSidebarHomePageBtnEnabled" name="showSidebarHomePageBtnEnabled" type="checkbox">
      <label class="form-check-label" for="${dialogName}_showSidebarHomePageBtnEnabled">首页</label>
    </div>
  </div>
</fieldset>

<fieldset class="fieldset mb-3 py-2">
  <legend>主题页面相关</legend>
  
  <div class="form-group mb-2">
    <label for="perPageFloorNum">主题每页楼层数量</label>
    <select class="custom-select custom-select-sm w-auto" id="perPageFloorNum" name="perPageFloorNum">
      <option value="10">10</option><option value="20">20</option><option value="30">30</option>
    </select>
    <span class="tips" data-toggle="tooltip" title="主题页面中每页的楼层数量（用于电梯直达等功能），如果修改了论坛设置里的“文章列表每页个数”，请在此修改成相同的数目">[?]</span>
  </div>
  
  <div class="input-group mb-2">
    <div class="input-group-prepend">
      <span class="input-group-text">主题内容字体大小</span>
    </div>
    <input class="form-control" name="threadContentFontSize" data-toggle="tooltip" type="number" min="8" max="72"
           title="主题内容字体大小，留空表示使用默认大小，默认值：14px">
    <div class="input-group-append">
      <span class="input-group-text">px</span>
    </div>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName}_userMemoEnabled" name="userMemoEnabled" type="checkbox" data-disabled="[data-name=openUserMemoDialog]">
    <label class="form-check-label" for="${dialogName}_userMemoEnabled">显示用户备注</label>
    <span class="tips" data-toggle="tooltip" title="在楼层内的用户名旁显示该用户的自定义备注">[?]</span>
    <a class="ml-3" data-name="openUserMemoDialog" href="#" role="button">详细设置&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName}_kfSmileEnhanceExtensionEnabled" name="kfSmileEnhanceExtensionEnabled" type="checkbox">
    <label class="form-check-label" for="${dialogName}_kfSmileEnhanceExtensionEnabled">开启绯月表情增强插件</label>
    <span class="tips" data-toggle="tooltip" title="在发帖框上显示绯月表情增强插件，该插件由eddie32开发">[?]</span>
  </div>
</fieldset>

<fieldset class="fieldset mb-3 py-2">
  <legend>其它设置</legend>
  
  <div class="input-group mb-2">
    <div class="input-group-prepend">
      <span class="input-group-text">消息显示时间</span>
    </div>
    <input class="form-control" name="defShowMsgDuration" data-toggle="tooltip" type="number" min="-1" required
           title="默认的消息显示时间（秒），设置为-1表示永久显示，例：15">
    <div class="input-group-append">
      <span class="input-group-text">秒</span>
    </div>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName}_customCssEnabled" name="customCssEnabled" type="checkbox" data-disabled="[data-name=openCustomCssDialog]">
    <label class="form-check-label" for="${dialogName}_customCssEnabled">添加自定义CSS</label>
    <span class="tips" data-toggle="tooltip" title="为页面添加自定义的CSS内容，请点击详细设置填写自定义的CSS内容">[?]</span>
    <a class="ml-3" data-name="openCustomCssDialog" href="#" role="button">详细设置&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName}_customScriptEnabled" name="customScriptEnabled" type="checkbox" data-disabled="[data-name=openCustomScriptDialog]">
    <label class="form-check-label" for="${dialogName}_customScriptEnabled">执行自定义脚本</label>
    <span class="tips" data-toggle="tooltip" title="执行自定义的javascript脚本，请点击详细设置填入自定义脚本内容">[?]</span>
    <a class="ml-3" data-name="openCustomScriptDialog" href="#" role="button">详细设置&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName}_adminMemberEnabled" name="adminMemberEnabled" type="checkbox">
    <label class="form-check-label" for="${dialogName}_adminMemberEnabled">我是管理成员</label>
    <span class="tips" data-toggle="tooltip" title="管理成员可开启此功能，助手会开启部分只有管理成员才能使用的功能，非管理成员开启此功能无效">[?]</span>
  </div>
</fieldset>

<fieldset class="fieldset mb-3 py-2">
  <legend>关注和屏蔽</legend>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName}_followUserEnabled" name="followUserEnabled" type="checkbox" data-disabled="[data-name=openFollowUserDialog]">
    <label class="form-check-label" for="${dialogName}_followUserEnabled">关注用户</label>
    <span class="tips" data-toggle="tooltip" title="开启关注用户的功能，所关注的用户将被加注记号，请点击详细设置管理关注用户">[?]</span>
    <a class="ml-3" data-name="openFollowUserDialog" href="#" role="button">详细设置&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName}_blockUserEnabled" name="blockUserEnabled" type="checkbox" data-disabled="[data-name=openBlockUserDialog]">
    <label class="form-check-label" for="${dialogName}_blockUserEnabled">屏蔽用户</label>
    <span class="tips" data-toggle="tooltip" title="开启屏蔽用户的功能，你将看不见所屏蔽用户的发言，请点击详细设置管理屏蔽用户">[?]</span>
    <a class="ml-3" data-name="openBlockUserDialog" href="#" role="button">详细设置&raquo;</a>
  </div>
  
  <div class="form-check">
    <input class="form-check-input" id="${dialogName}_blockThreadEnabled" name="blockThreadEnabled" type="checkbox" data-disabled="[data-name=openBlockThreadDialog]">
    <label class="form-check-label" for="${dialogName}_blockThreadEnabled">屏蔽主题</label>
    <span class="tips" data-toggle="tooltip" title="开启屏蔽标题中包含指定关键字的主题的功能，请点击详细设置管理屏蔽关键字">[?]</span>
    <a class="ml-3" data-name="openBlockThreadDialog" href="#" role="button">详细设置&raquo;</a>
  </div>
</fieldset>`;
    let footerContent = `
<button class="btn btn-warning mr-auto" name="openImportOrExportSettingDialog" type="button">导入/导出</button>
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>
<button class="btn btn-danger" name="reset" type="button">重置</button>`;
    let $dialog = Dialog.create(dialogName, '助手设置', bodyContent, footerContent);

    $dialog.submit(function (e) {
        e.preventDefault();
        readConfig();
        let options = getMainConfigValue($dialog);
        options = normalizeConfig(options);
        $.extend(Config, options);
        writeConfig();
        Dialog.close(dialogName);
    }).on('click', 'a[data-name^="open"][href="#"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        if ($this.hasClass('disabled-link')) return;
        let name = $this.data('name');
        if (name === 'openRunCommandDialog') showRunCommandDialog();
        else if (name === 'openUserMemoDialog') showUserMemoDialog();
        else if (name === 'openCustomCssDialog') showCustomCssDialog();
        else if (name === 'openCustomScriptDialog') Script.showDialog();
        else if (name === 'openFollowUserDialog') showFollowUserDialog();
        else if (name === 'openBlockUserDialog') showBlockUserDialog();
        else if (name === 'openBlockThreadDialog') showBlockThreadDialog();
    }).find('[data-name="clearTmpData"]').click(function (e) {
        e.preventDefault();
        let type = prompt(
            '可清除与助手有关的Cookies和本地临时数据（不包括助手设置和日志）\n请填写清除类型，0：全部清除；1：清除Cookies；2：清除本地临时数据', 0
        );
        if (type === null) return;
        type = parseInt(type);
        if (!isNaN(type) && type >= 0) {
            clearTmpData(type);
            alert('缓存已清除');
        }
    }).end().find('[name="reset"]').click(function () {
        if (confirm('是否重置所有设置？')) {
            clearConfig();
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
const setMainConfigValue = function ($dialog) {
    $dialog.find('input[name], select[name]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean') $this.prop('checked', Config[name] === true);
            else $this.val(Config[name]);
        }
    });
    $dialog.find('[name="threadContentFontSize"]').val(Config.threadContentFontSize > 0 ? Config.threadContentFontSize : '');
};

/**
 * 获取主对话框中字段值的Config对象
 * @param {jQuery} $dialog 助手设置对话框对象
 * @returns {{}} 字段值的Config对象
 */
const getMainConfigValue = function ($dialog) {
    let options = {};
    $dialog.find('input[name], select[name]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean')
                options[name] = Boolean($this.prop('checked'));
            else if (typeof Config[name] === 'number') {
                options[name] = parseInt($this.val());
                if (name === 'threadContentFontSize' && isNaN(options[name])) options[name] = 0;
            }
            else options[name] = $.trim($this.val());
        }
    });
    return options;
};

/**
 * 清除临时数据
 * @param {number} type 清除类别，0：全部清除；1：清除Cookies；2：清除本地临时数据
 */
const clearTmpData = function (type = 0) {
    if (type === 0 || type === 1) {
        for (let key in Const) {
            if (/CookieName$/.test(key)) {
                Util.deleteCookie(Const[key]);
            }
        }
    }
    if (type === 0 || type === 2) {
        //TmpLog.clear();
        localStorage.removeItem(Const.multiQuoteStorageName);
    }
};

/**
 * 显示运行命令对话框
 */
const showRunCommandDialog = function () {
    const dialogName = 'runCommandDialog';
    if ($('#' + dialogName).length > 0) return;
    let bodyContent = `
<p class="font-size-sm">
  运行命令快捷键：<kbd>Ctrl+Enter</kbd>；清除命令快捷键：<kbd>Ctrl+退格键</kbd>
</p>
<div class="form-group">
  <label for="cfgCmd">命令内容：</label>
  <textarea class="form-control" name="cmd" id="cfgCmd" rows="6" wrap="off" aria-label="命令内容" style="white-space: pre;"></textarea>
</div>
<div class="form-group">
  <label for="cfgResult">运行结果：</label>
  <textarea class="form-control font-size-sm" name="result" id="cfgResult" rows="6" wrap="off" aria-label="运行结果" style="white-space: pre;"></textarea>
</div>`;
    let footerContent = `
<button class="btn btn-primary" type="submit">运行</button>
<button class="btn btn-danger" name="clear" type="button">清除</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">关闭</button>`;
    let $dialog = Dialog.create(dialogName, '运行命令', bodyContent, footerContent);
    let $cmd = $dialog.find('[name="cmd"]');
    let $result = $dialog.find('[name="result"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        let content = $cmd.val();
        if (!$.trim(content)) return;
        let {response} = Script.runCmd(content, true);
        $result.val(response);
    }).end().find('[name="clear"]').click(function () {
        $cmd.val('').focus();
    });

    $cmd.keydown(function (e) {
        if (e.ctrlKey && e.keyCode === 13) {
            $dialog.submit();
        }
        else if (e.ctrlKey && e.keyCode === 8) {
            $dialog.find('[name="clear"]').click();
        }
    });

    Dialog.show(dialogName);
    $cmd.focus();
};

/**
 * 显示导入或导出设置对话框
 */
const showImportOrExportSettingDialog = function () {
    const dialogName = 'imOrExSettingDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    let bodyContent = `
<p class="font-size-sm">
  <b>导入设置：</b>将设置内容粘贴到文本框中并点击保存按钮即可<br>
  <b>导出设置：</b>复制文本框里的内容并粘贴到别处即可<br>
  <span class="text-danger">注：本设置与电脑版的KFOL助手并不完全通用</span>
</p>
<div class="form-group">
  <textarea class="form-control font-size-sm font-monospace" name="setting" rows="10" aria-label="设置内容" style="word-break: break-all;"></textarea>
</div>`;
    let footerContent = `
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>`;
    let $dialog = Dialog.create(dialogName, '导入或导出设置', bodyContent, footerContent);

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        let options = $.trim($dialog.find('[name="setting"]').val());
        if (!options) return;
        try {
            options = JSON.parse(options);
        }
        catch (ex) {
            alert('设置有错误');
            return;
        }
        if (!options || $.type(options) !== 'object') {
            alert('设置有错误');
            return;
        }
        options = normalizeConfig(options);
        window.Config = $.extend(true, {}, defConfig, options);
        writeConfig();
        alert('设置已导入');
        location.reload();
    });
    Dialog.show(dialogName);
    $dialog.find('[name="setting"]').val(JSON.stringify(Util.getDifferenceSetOfObject(defConfig, Config))).select().focus();
};

/**
 * 显示用户备注对话框
 */
const showUserMemoDialog = function () {
    const dialogName = 'userMemoDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    let bodyContent = `
<p class="font-size-sm">按照<code>用户名:备注</code>的格式（注意是英文冒号），每行一个</p>
<div class="form-group">
  <textarea class="form-control" name="userMemoList" rows="13" wrap="off" aria-label="用户备注" style="white-space: pre;"></textarea>
</div>`;
    let footerContent = `
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>`;
    let $dialog = Dialog.create(dialogName, '用户备注', bodyContent, footerContent);
    let $userMemoList = $dialog.find('[name="userMemoList"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        let content = $.trim($userMemoList.val());
        Config.userMemoList = {};
        for (let line of content.split('\n')) {
            line = $.trim(line);
            if (!line) continue;
            if (!/.+?:.+/.test(line)) {
                alert('格式不正确');
                $userMemoList.focus();
                return;
            }
            let [user, memo = ''] = line.split(':');
            if (!memo) continue;
            Config.userMemoList[user.trim()] = memo.trim();
        }
        writeConfig();
        Dialog.close(dialogName);
    });

    let content = '';
    for (let [user, memo] of Object.entries(Config.userMemoList)) {
        content += `${user}:${memo}\n`;
    }
    Dialog.show(dialogName);
    $userMemoList.val(content).focus();
};

/**
 * 显示自定义CSS对话框
 */
const showCustomCssDialog = function () {
    const dialogName = 'customCssDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    let bodyContent = `
<div class="form-group">
  <textarea class="form-control font-size-sm font-monospace" name="customCssContent" rows="15" wrap="off" aria-label="自定义CSS内容" style="white-space: pre;"></textarea>
</div>`;
    let footerContent = `
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>`;
    let $dialog = Dialog.create(dialogName, '自定义CSS', bodyContent, footerContent);
    let $content = $dialog.find('[name="customCssContent"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.customCssContent = $.trim($content.val());
        writeConfig();
        Dialog.close(dialogName);
        alert('自定义CSS修改成功（需刷新页面后才可生效）');
    });
    Dialog.show(dialogName);
    $content.val(Config.customCssContent).focus();
};

/**
 * 显示关注用户对话框
 */
const showFollowUserDialog = function () {
    const dialogName = 'followUserDialog';
    if ($('#' + dialogName).length > 0) return;
    let bodyContent = `
<div class="form-check">
  <input class="form-check-input" id="${dialogName}_highlightFollowUserThreadInHpEnabled" name="highlightFollowUserThreadInHpEnabled" type="checkbox">
  <label class="form-check-label" for="${dialogName}_highlightFollowUserThreadInHpEnabled">高亮所关注用户的首页主题链接</label>
  <span class="tips" data-toggle="tooltip" title="高亮所关注用户在首页下的主题链接">[?]</span>
</div>
<div class="form-check mb-3">
  <input class="form-check-input" id="${dialogName}_highlightFollowUserThreadLinkEnabled" name="highlightFollowUserThreadLinkEnabled" type="checkbox">
  <label class="form-check-label" for="${dialogName}_highlightFollowUserThreadLinkEnabled">高亮所关注用户的主题链接</label>
  <span class="tips" data-toggle="tooltip" title="高亮所关注用户在版块页面下的主题链接">[?]</span>
</div>
<ul class="list-unstyled" id="followUserList"></ul>
<div class="btn-group btn-group-sm mb-3" role="group">
  <button class="btn btn-secondary" name="selectAll" type="button">全选</button>
  <button class="btn btn-secondary" name="selectInverse" type="button">反选</button>
  <button class="btn btn-danger" name="deleteSelect" type="button">删除</button>
</div>
<div class="input-group mb-3">
  <input class="form-control" name="addUser" data-toggle="tooltip" type="text" title="添加多个用户请用英文逗号分隔" aria-label="添加关注用户">
  <div class="input-group-append">
    <button class="btn btn-success" name="add" type="button">添加</button>
  </div>
</div>
`;
    let footerContent = `
<button class="btn btn-warning mr-auto" name="openImOrExFollowUserListDialog" type="button">导入/导出</button>
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>`;
    let $dialog = Dialog.create(dialogName, '关注用户', bodyContent, footerContent);
    let $followUserList = $dialog.find('#followUserList');

    /**
     * 添加关注用户
     * @param {string} name 用户名
     */
    const addFollowUser = function (name) {
        $(`
<li class="input-group input-group-sm mb-2">
  <div class="input-group-prepend">
    <div class="input-group-text">
      <input type="checkbox" aria-label="选择用户">
    </div>
  </div>
  <input class="form-control" name="userName" type="text" value="${name}" maxlength="12" aria-label="编辑关注用户">
  <div class="input-group-append">
    <button class="btn btn-danger" name="delete" type="button" aria-label="删除关注用户">
      <i class="fa fa-trash" aria-hidden="true"></i>
    </button>
  </div>
</li>
`).appendTo($followUserList);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.highlightFollowUserThreadInHPEnabled = $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked');
        Config.highlightFollowUserThreadLinkEnabled = $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked');
        Config.followUserList = [];
        $followUserList.find('li').each(function () {
            let $this = $(this);
            let name = $.trim($this.find('[name="userName"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                Config.followUserList.push({name});
            }
        });
        writeConfig();
        Dialog.close(dialogName);
    }).find('[name="deleteSelect"]').click(function () {
        let $checked = $followUserList.find('li:has([type="checkbox"]:checked)');
        if (!$checked.length) return;
        if (confirm('是否删除所选用户？')) $checked.remove();
    }).end().find('[name="addUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next().find('button').click();
        }
    }).end().find('[name="add"]').click(function () {
        let $addUser = $dialog.find('[name="addUser"]');
        for (let name of $.trim($addUser.val()).split(',')) {
            name = $.trim(name);
            if (!name) continue;
            if (Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) addFollowUser(name);
        }
        $addUser.val('');
        $followUserList.find('li:last-child [type="checkbox"]').focus();
    }).end().find('[name="openImOrExFollowUserListDialog"]').click(function () {
        Public.showCommonImportOrExportConfigDialog('关注用户', 'followUserList');
    }).end().find('[name="selectAll"]').click(() => Util.selectAll($followUserList.find('[type="checkbox"]')))
        .end().find('[name="selectInverse"]').click(() => Util.selectInverse($followUserList.find('[type="checkbox"]')));

    $followUserList.on('click', '[name="delete"]', function () {
        $(this).closest('li').remove();
    });

    $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked', Config.highlightFollowUserThreadInHPEnabled);
    $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked', Config.highlightFollowUserThreadLinkEnabled);
    for (let user of Config.followUserList) {
        addFollowUser(user.name);
    }
    Dialog.show(dialogName);
};

/**
 * 显示屏蔽用户对话框
 */
const showBlockUserDialog = function () {
    const dialogName = 'blockUserDialog';
    if ($('#' + dialogName).length > 0) return;
    let bodyContent = `
<div class="form-group mb-2">
  <label for="blockUserDefaultType">默认屏蔽类型</label>
  <select class="custom-select custom-select-sm w-auto" id="blockUserDefaultType" name="blockUserDefaultType">
    <option value="0">主题和回帖</option><option value="1">主题</option><option value="2">回帖</option>
  </select>
  <div class="form-check form-check-inline ml-3">
    <input class="form-check-input" id="${dialogName}_blockUserAtTipsEnabled" name="blockUserAtTipsEnabled" type="checkbox">
    <label class="form-check-label" for="${dialogName}_blockUserAtTipsEnabled">屏蔽@提醒</label>
    <span class="tips" data-toggle="tooltip" title="屏蔽被屏蔽用户的@提醒">[?]</span>
  </div>
</div>
<div class="form-group mb-2">
  <label for="blockUserForumType">版块屏蔽范围</label>
  <select class="custom-select custom-select-sm w-auto" id="blockUserForumType" name="blockUserForumType">
    <option value="0">所有版块</option><option value="1">包括指定版块</option><option value="2">排除指定版块</option>
  </select>
</div>
<div class="form-group">
  <label>版块ID列表</label>
  <span class="tips" data-toggle="tooltip" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span>
  <input class="form-control form-control-sm" name="blockUserFidList" type="text">
</div>
<ul class="list-unstyled" id="blockUserList"></ul>
<div class="btn-group btn-group-sm mb-3" role="group">
  <button class="btn btn-secondary" name="selectAll" type="button">全选</button>
  <button class="btn btn-secondary" name="selectInverse" type="button">反选</button>
  <div class="btn-group btn-group-sm dropup">
    <button class="btn btn-info dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false">
      修改为
    </button>
    <div class="dropdown-menu" data-name="modifyMenu">
      <a class="dropdown-item" data-value="0" href="#">主题和回帖</a>
      <a class="dropdown-item" data-value="1" href="#">主题</a>
      <a class="dropdown-item" data-value="2" href="#">回帖</a>
    </div>
  </div>
  <button class="btn btn-danger" name="deleteSelect" type="button">删除</button>
</div>
<div class="input-group mb-3">
  <input class="form-control" name="addUser" data-toggle="tooltip" type="text" title="添加多个用户请用英文逗号分隔" aria-label="添加屏蔽用户">
  <div class="input-group-append">
    <button class="btn btn-success" name="add" type="button">添加</button>
  </div>
</div>`;
    let footerContent = `
<button class="btn btn-warning mr-auto" name="openImOrExBlockUserListDialog" type="button">导入/导出</button>
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>`;
    let $dialog = Dialog.create(dialogName, '屏蔽用户', bodyContent, footerContent);
    let $blockUserList = $dialog.find('#blockUserList');

    /**
     * 添加屏蔽用户
     * @param {string} name 用户名
     * @param {number} type 屏蔽类型
     */
    const addBlockUser = function (name, type) {
        $(`
<li class="form-group row no-gutters mb-2">
  <div class="col-7 input-group input-group-sm">
    <div class="input-group-prepend">
      <div class="input-group-text">
        <input type="checkbox" aria-label="选择用户">
      </div>
    </div>
    <input class="form-control" name="userName" type="text" value="${name}" maxlength="12" aria-label="编辑屏蔽用户">
  </div>
  <div class="col-5 input-group input-group-sm">
    <select class="form-control" name="blockType">
      <option value="0">主题和回帖</option><option value="1">主题</option><option value="2">回帖</option>
    </select>
    <div class="input-group-append">
      <button class="btn btn-danger" name="delete" type="button" aria-label="删除屏蔽用户">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</li>
`).appendTo($blockUserList).find('[name="blockType"]').val(type);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.blockUserDefaultType = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        Config.blockUserAtTipsEnabled = $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked');
        Config.blockUserForumType = parseInt($dialog.find('[name="blockUserForumType"]').val());
        let blockUserFidList = new Set();
        for (let fid of $.trim($dialog.find('[name="blockUserFidList"]').val()).split(',')) {
            fid = parseInt(fid);
            if (!isNaN(fid) && fid > 0) blockUserFidList.add(fid);
        }
        Config.blockUserFidList = [...blockUserFidList];
        Config.blockUserList = [];
        $blockUserList.find('li').each(function () {
            let $this = $(this);
            let name = $.trim($this.find('[name="userName"]').val());
            if (name && Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                let type = parseInt($this.find('[name="blockType"]').val());
                Config.blockUserList.push({name, type});
            }
        });
        writeConfig();
        Dialog.close(dialogName);
    }).find('[data-name="modifyMenu"]').on('click', 'a', function (e) {
        e.preventDefault();
        let value = parseInt($(this).data('value'));
        $blockUserList.find('li:has([type="checkbox"]:checked) select').val(value);
    }).end().find('[name="deleteSelect"]').click(function () {
        let $checked = $blockUserList.find('li:has([type="checkbox"]:checked)');
        if (!$checked.length) return;
        if (confirm('是否删除所选用户？')) $checked.remove();
    }).end().find('[name="addUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next().find('button').click();
        }
    }).end().find('[name="add"]').click(function () {
        let $addUser = $dialog.find('[name="addUser"]');
        let type = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        for (let name of $.trim($addUser.val()).split(',')) {
            name = $.trim(name);
            if (!name) continue;
            if (Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) addBlockUser(name, type);
        }
        $addUser.val('');
        $blockUserList.find('li:last-child [type="checkbox"]').focus();
    }).end().find('[name="blockUserForumType"]').change(function () {
        $dialog.find('[name="blockUserFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('[name="openImOrExBlockUserListDialog"]').click(function () {
        Public.showCommonImportOrExportConfigDialog('屏蔽用户', 'blockUserList');
    }).end().find('[name="selectAll"]').click(() => Util.selectAll($blockUserList.find('[type="checkbox"]')))
        .end().find('[name="selectInverse"]').click(() => Util.selectInverse($blockUserList.find('[type="checkbox"]')));

    $blockUserList.on('click', '[name="delete"]', function () {
        $(this).closest('li').remove();
    });

    $dialog.find('[name="blockUserDefaultType"]').val(Config.blockUserDefaultType);
    $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked', Config.blockUserAtTipsEnabled);
    $dialog.find('[name="blockUserForumType"]').val(Config.blockUserForumType).triggerHandler('change');
    $dialog.find('[name="blockUserFidList"]').val(Config.blockUserFidList.join(','));
    for (let user of Config.blockUserList) {
        addBlockUser(user.name, user.type);
    }
    Dialog.show(dialogName);
};

/**
 * 显示屏蔽主题对话框
 */
const showBlockThreadDialog = function () {
    const dialogName = 'blockThreadDialog';
    if ($('#' + dialogName).length > 0) return;
    let bodyContent = `
<p class="font-size-sm">
  标题关键字可使用普通字符串或正则表达式，正则表达式请使用<code>/abc/</code>的格式，例：<code>/关键字A.*关键字B/i</code><br>
  用户名和版块ID为可选项（多个用户名或版块ID请用英文逗号分隔）<br>
</p>
<div class="form-group mb-2">
  <label for="blockThreadDefForumType">默认版块屏蔽范围</label>
  <select class="custom-select custom-select-sm w-auto" id="blockThreadDefForumType" name="blockThreadDefForumType">
    <option value="0">所有版块</option><option value="1">包括指定版块</option><option value="2">排除指定版块</option>
  </select>
</div>
<div class="form-group">
  <label for="blockThreadDefFidList">默认版块ID列表</label>
  <input class="form-control form-control-sm" id="blockThreadDefFidList" name="blockThreadDefFidList" type="text">
</div>
<div class="table-responsive">
  <table class="table table-sm table-hover table-center text-nowrap">
    <thead>
      <tr>
        <th>标题关键字(必填)</th>
        <th>屏蔽用户</th>
        <th>用户名</th>
        <th>屏蔽范围</th>
        <th>版块ID</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="blockThreadList"></tbody>
  </table>
</div>
<div class="btn-group btn-group-sm mb-3" role="group">
  <button class="btn btn-success" name="add" type="button">增加</button>
  <button class="btn btn-danger" name="clear" type="button">清空</button>
</div>`;
    let footerContent = `
<button class="btn btn-warning mr-auto" name="openImOrExBlockThreadListDialog" type="button">导入/导出</button>
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>`;
    let $dialog = Dialog.create(dialogName, '屏蔽主题', bodyContent, footerContent);
    let $blockThreadList = $dialog.find('#blockThreadList');

    /**
     * 添加屏蔽主题
     * @param {string} keyWord 标题关键字
     * @param {number} userType 屏蔽用户，0：所有；1：包括；2：排除
     * @param {string[]} userList 用户名
     * @param {number} fidType 屏蔽范围，0：所有；1：包括；2：排除
     * @param {number[]} fidList 版块ID列表
     */
    const addBlockThread = function (keyWord, userType, userList, fidType, fidList) {
        $(`
<tr>
  <td>
    <input class="form-control form-control-sm" name="keyWord" type="text" value="${keyWord}" aria-label="标题关键字" style="min-width: 12rem;">
  </td>
  <td>
    <select class="form-control form-control-sm" name="userType" aria-label="屏蔽用户类型" style="min-width: 4.5rem;">
      <option value="0">所有</option><option value="1">包括</option><option value="2">排除</option>
    </select>
  </td>
  <td>
    <input class="form-control form-control-sm" name="userList" type="text" value="${userList.join(',')}" aria-label="用户名"
           ${userType === 0 ? 'disabled' : ''} style="min-width: 12rem;">
  </td>
  <td>
    <select class="form-control form-control-sm" name="fidType" aria-label="屏蔽范围" style="min-width: 4.5rem;">
      <option value="0">所有</option><option value="1">包括</option><option value="2">排除</option>
    </select>
  </td>
  <td>
    <input class="form-control form-control-sm" name="fidList" type="text" value="${fidList.join(',')}" aria-label="版块ID列表"
           ${fidType === 0 ? 'disabled' : ''} style="min-width: 9rem;">
  </td>
  <td class="text-left">
    <button class="btn btn-danger btn-sm" name="delete" type="button" aria-label="删除">
      <i class="fa fa-trash" aria-hidden="true"></i>
    </button>
  </td>
</tr>
`).appendTo($blockThreadList).find('[name="userType"]').val(userType)
            .end().find('[name="fidType"]').val(fidType);
    };

    /**
     * 验证设置是否正确
     * @returns {boolean} 是否验证通过
     */
    const verify = function () {
        let flag = true;
        $blockThreadList.find('tr').each(function () {
            let $this = $(this);
            let $txtKeyWord = $this.find('[name="keyWord"]');
            let keyWord = $txtKeyWord.val();
            if (!$.trim(keyWord)) return;
            if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
                try {
                    eval(keyWord);
                }
                catch (ex) {
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
        let blockThreadDefFidList = new Set();
        for (let fid of $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(',')) {
            fid = parseInt(fid);
            if (!isNaN(fid) && fid > 0) blockThreadDefFidList.add(fid);
        }
        Config.blockThreadDefFidList = [...blockThreadDefFidList];
        Config.blockThreadList = [];
        $blockThreadList.find('tr').each(function () {
            let $this = $(this);
            let keyWord = $this.find('[name="keyWord"]').val();
            if (!$.trim(keyWord)) return;
            let newObj = {keyWord};

            let userType = parseInt($this.find('[name="userType"]').val());
            if (userType > 0) {
                let userList = new Set();
                for (let user of $.trim($this.find('[name="userList"]').val()).split(',')) {
                    user = $.trim(user);
                    if (user) userList.add(user);
                }
                if (userList.size > 0) newObj[userType === 2 ? 'excludeUser' : 'includeUser'] = [...userList];
            }

            let fidType = parseInt($this.find('[name="fidType"]').val());
            if (fidType > 0) {
                let fidList = new Set();
                for (let fid of $.trim($this.find('[name="fidList"]').val()).split(',')) {
                    fid = parseInt(fid);
                    if (!isNaN(fid) && fid > 0) fidList.add(fid);
                }
                if (fidList.size > 0) newObj[fidType === 2 ? 'excludeFid' : 'includeFid'] = [...fidList];
            }
            Config.blockThreadList.push(newObj);
        });
        writeConfig();
        Dialog.close(dialogName);
    }).find('[name="clear"]').click(function () {
        if (confirm('是否清除所有屏蔽关键字？')) $blockThreadList.html('');
    }).end().find('[name="add"]').click(function () {
        addBlockThread(
            '', 0, [],
            parseInt($dialog.find('[name="blockThreadDefForumType"]').val()),
            $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(',')
        );
    }).end().find('[name="blockThreadDefForumType"]').change(function () {
        $dialog.find('[name="blockThreadDefFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('[name="openImOrExBlockThreadListDialog"]').click(function () {
        Public.showCommonImportOrExportConfigDialog('屏蔽主题', 'blockThreadList');
    }).end().find('[name="selectAll"]').click(() => Util.selectAll($blockThreadList.find('[type="checkbox"]')))
        .end().find('[name="selectInverse"]').click(() => Util.selectInverse($blockThreadList.find('[type="checkbox"]')));

    $blockThreadList.on('change', 'select', function () {
        let $this = $(this);
        $this.closest('td').next('td').find('input').prop('disabled', parseInt($this.val()) === 0);
    }).on('click', '[name="delete"]', function () {
        $(this).closest('tr').remove();
    });

    $dialog.find('[name="blockThreadDefForumType"]').val(Config.blockThreadDefForumType).triggerHandler('change');
    $dialog.find('[name="blockThreadDefFidList"]').val(Config.blockThreadDefFidList.join(','));
    for (let data of Config.blockThreadList) {
        let {keyWord, includeUser, excludeUser, includeFid, excludeFid} = data;
        let userType = 0;
        let userList = [];
        if (typeof includeUser !== 'undefined') {
            userType = 1;
            userList = includeUser;
        }
        else if (typeof excludeUser !== 'undefined') {
            userType = 2;
            userList = excludeUser;
        }

        let fidType = 0;
        let fidList = [];
        if (typeof includeFid !== 'undefined') {
            fidType = 1;
            fidList = includeFid;
        }
        else if (typeof excludeFid !== 'undefined') {
            fidType = 2;
            fidList = excludeFid;
        }
        addBlockThread(keyWord, userType, userList, fidType, fidList);
    }
    Dialog.show(dialogName);
};
