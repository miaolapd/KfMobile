/* 自定义脚本模块 */
'use strict';
import * as Util from './util';
import * as Dialog from './dialog';
import {read as readConfig, write as writeConfig} from './config';

// 默认脚本名称
const defScriptName = '未命名脚本';
// 脚本meta信息的正则表达式
const metaRegex = /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i;

/**
 * 运行命令
 * @param {string} cmd 命令
 * @param {boolean} isOutput 是否在控制台上显示结果
 * @returns {{isError: boolean, response: string}} isError：是否出错；response：执行结果
 */
export const runCmd = function (cmd, isOutput = false) {
    let isError = false;
    let response = '';
    try {
        response = eval(cmd);
        if (isOutput) console.log(response);
    }
    catch (ex) {
        isError = true;
        response = ex;
        console.log(ex);
    }
    return {isError, response: String(response)};
};

/**
 * 执行自定义脚本
 * @param {string} type 脚本执行时机，start：在脚本开始时执行；end：在脚本结束时执行
 */
export const runCustomScript = function (type = 'end') {
    for (let {enabled, trigger, content} of Config.customScriptList) {
        if (enabled && trigger === type && content) {
            runCmd(content);
        }
    }
};

/**
 * 获取脚本meta信息
 * @param {string} content 脚本内容
 * @returns {{}} 脚本meta信息
 */
export const getScriptMeta = function (content) {
    let meta = {
        name: defScriptName,
        version: '',
        trigger: 'end',
        homepage: '',
        author: '',
    };
    let matches = metaRegex.exec(content);
    if (!matches) return meta;
    let metaContent = matches[1];
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
export const showDialog = function (showIndex = null) {
    const dialogName = 'customScriptDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();

    let bodyContent = `
<div class="d-flex mb-3">
  <div class="btn-group btn-group-sm">
    <button class="btn btn-success" name="add" type="button">添加脚本</button>
    <button class="btn btn-secondary" name="insertSample" type="button">插入范例</button>
  </div>
  
  <div class="btn-group btn-group-sm ml-auto">
    <a class="btn btn-link" href="${window.Info.rootPath}read/682170/sf/6d7" target="_blank">脚本收集贴</a>
  </div>
</div>
<div id="customScriptList"></div>
`;
    let footerContent = `
<button class="btn btn-warning mr-auto" name="openImOrExCustomScriptDialog" type="button">导入/导出</button>
<button class="btn btn-primary" type="submit">保存</button>
<button class="btn btn-secondary" data-dismiss="dialog" type="button">取消</button>
<button class="btn btn-danger" name="clear" type="button">清空</button>`;
    let $dialog = Dialog.create(dialogName, '自定义脚本', bodyContent, footerContent);
    let $customScriptList = $dialog.find('#customScriptList');

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.customScriptList = [];
        $customScriptList.find('textarea[name="customScriptContent"]').each(function () {
            let $this = $(this);
            let content = $this.val();
            if (!$.trim(content)) return;
            let enabled = $this.closest('.custom-script-container').find('[name="enabled"]').prop('checked');
            Config.customScriptList.push($.extend(getScriptMeta(content), {enabled, content}));
        });
        writeConfig();
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
    const addCustomScript = function ({
                                          enabled = true,
                                          name = defScriptName,
                                          version = '',
                                          homepage = '',
                                          trigger = 'end',
                                          content = '',
                                      } = {}) {
        let count = $customScriptList.find('.custom-script-container').length;
        $customScriptList.append(`
<div class="card custom-script-container">
  <div class="card-header d-flex p-1" id="customScriptHeader${count}">
    <div class="form-check form-check-inline mx-1">
      <input class="form-check-input position-static" name="enabled" type="checkbox" ${enabled ? 'checked' : ''} title="是否启用" aria-label="是否启用">
    </div>

    <button class="btn btn-link btn-sm mx-1 px-0 text-truncate custom-script-name" data-toggle="collapse" data-target="#customScriptContent${count}" type="button"
            title="${name}" aria-expanded="true" aria-controls="customScriptContent${count}">${name}</button>

    <div class="ml-auto col-auto px-0">
      <a class="badge badge-primary align-middle custom-script-homepage" ${!homepage ? 'hidden' : ''}
         href="${homepage.startsWith('http') ? '' : Info.rootPath}${homepage}" target="_blank">主页</a>
      <span class="badge badge-warning align-middle custom-script-version" ${!version ? 'hidden' : ''}>${version}</span>
      <span class="badge badge-${trigger === 'start' ? 'danger' : 'info'} align-middle custom-script-trigger" title="脚本执行时机">${trigger === 'start' ? '开' : '结'}</span>
      <button class="btn btn-link btn-sm text-danger" name="delete" type="button">删</button>
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

    $dialog.find('[name="add"]').click(function () {
        $customScriptList.find('.custom-script-content.show').collapse();
        addCustomScript();
        $customScriptList.find('.custom-script-content:last').collapse();
        //Dialog.resize(dialogName);
    }).end().find('[name="insertSample"]').click(function () {
        let $content = $customScriptList.find('.custom-script-content.show textarea[name="customScriptContent"]');
        $content.val(`
// ==UserScript==
// @name        ${defScriptName}
// @version     1.0
// @author      ${Info.userName}
// @trigger     end
// @homepage    read/682170/spid/14034074/sf/6d7
// @description 这是一个未命名脚本
// ==/UserScript==
`.trim() + '\n' + $content.val()).focus();
    }).end().find('[name="openImOrExCustomScriptDialog"]').click(function () {
        Public.showCommonImportOrExportConfigDialog('自定义脚本', 'customScriptList');
    });

    $customScriptList.on('click', '[name="delete"]', function () {
        if (!confirm('是否删除此脚本？')) return;
        $(this).closest('.custom-script-container').remove();
    }).on('change', 'textarea[name="customScriptContent"]', function () {
        let $this = $(this);
        let {name, version, homepage, trigger} = getScriptMeta($this.val());
        let $container = $this.closest('.custom-script-container');
        $container.find('.custom-script-name').text(name ? name : defScriptName);
        $container.find('.custom-script-homepage').attr('href', homepage ? homepage : '').prop('hidden', !homepage);
        $container.find('.custom-script-version').text(version).prop('hidden', !version);
        $container.find('.custom-script-trigger').text(trigger === 'start' ? '开' : '结')
            .removeClass(`badge-${trigger === 'start' ? 'info' : 'danger'}`)
            .addClass(`badge-${trigger === 'start' ? 'danger' : 'info'}`);
    });

    for (let data of Config.customScriptList) {
        addCustomScript(data);
    }

    Dialog.show(dialogName);
    if (typeof showIndex === 'number') {
        $customScriptList.find('#customScriptContent' + showIndex).collapse();
    }
};

/**
 * 处理安装自定义脚本按钮
 */
export const handleInstallScriptLink = function () {
    $('main').on('click', 'a[href$="#install-mobile-script"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        let $area = $this.nextAll('.code-area').eq(0).find('pre');
        if (!$area.length) return;
        let content = Util.htmlDecode($area.html().replace(/<legend>.+?<\/legend>/i, '')).trim();
        if (!metaRegex.test(content)) return;

        readConfig();
        let meta = getScriptMeta(content);
        let index = Config.customScriptList.findIndex(script => script.name === meta.name && script.author === meta.author);
        let isUpdate = index > -1;
        if (!confirm(`是否${isUpdate ? '更新' : '安装'}此脚本？`)) return;
        Config.customScriptEnabled = true;
        let script = $.extend(meta, {enabled: true, content});
        if (isUpdate) {
            Config.customScriptList[index] = script;
        }
        else {
            Config.customScriptList.push(script);
        }
        writeConfig();
        Dialog.close('customScriptDialog');
        showDialog(index);
    }).on('click', 'a[href$="#install-script"]', function (e) {
        e.preventDefault();
        alert('无法安装适用于电脑版论坛的自定义脚本');
    });
};