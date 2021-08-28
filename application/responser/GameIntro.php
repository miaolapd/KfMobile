<?php
namespace app\responser;

/**
 * 游戏介绍页面响应类
 * @package app\responser
 */
class GameIntro extends Responser
{
    /**
     * 获取游戏介绍首页的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function index($extraData = [])
    {
        debug('begin');
        $doc = null;
        $initTime = 0;
        try {
            debug('initBegin');
            $doc = \phpQuery::newDocumentHTML($this->response['document']);
            debug('initEnd');
            $initTime = debug('initBegin', 'initEnd');
        } catch (\Exception $ex) {
            $this->handleError($ex);
        }
        $commonData = array_merge($this->getCommonData($doc), $extraData);
        $matches = [];

        // 游戏介绍链接列表
        $currentMonthGameAttentionRankList = [];
        $nextMonthGameAttentionRankList = [];
        $latestGameIntroList = [];
        $allGameAttentionRankList = [];
        foreach (pq('#intro_index_field1:lt(4)') as $i => $area) {
            $pqArea = pq($area);
            if ($i === 0) $list = &$currentMonthGameAttentionRankList;
            elseif ($i === 1) $list = &$nextMonthGameAttentionRankList;
            elseif ($i === 2) $list = &$latestGameIntroList;
            else $list = &$allGameAttentionRankList;

            foreach ($pqArea->find('> div > a') as $item) {
                $pqItem = pq($item);
                $id = 0;
                $title = '';
                if (preg_match('/id=(\d+)/i', $pqItem->attr('href'), $matches)) {
                    $id = intval($matches[1]);
                }
                $title = trim_strip($pqItem->text());
                $list[] = ['id' => $id, 'title' => $title];
            }
        }

        $data = [
            'currentMonthGameAttentionRankList' => $currentMonthGameAttentionRankList,
            'nextMonthGameAttentionRankList' => $nextMonthGameAttentionRankList,
            'latestGameIntroList' => $latestGameIntroList,
            'allGameAttentionRankList' => $allGameAttentionRankList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取游戏搜索页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function search($extraData = [])
    {
        debug('begin');
        $doc = null;
        $initTime = 0;
        try {
            debug('initBegin');
            $doc = \phpQuery::newDocumentHTML($this->response['document']);
            debug('initEnd');
            $initTime = debug('initBegin', 'initEnd');
        } catch (\Exception $ex) {
            $this->handleError($ex);
        }
        $commonData = array_merge($this->getCommonData($doc), $extraData);
        $matches = [];
        $request = request();

        $pqArea = pq('#div740_2 > div:nth-child(2)');
        // 搜索关键字、搜索类型
        $keyword = '';
        $searchType = 'game';
        if (preg_match('/您搜索的类型为 “(.+?)” ，关键字为 “(.*?)”/', $pqArea->text(), $matches)) {
            $searchType = trim_strip($matches[1]);
            switch ($searchType) {
                case '会社':
                    $searchType = 'inc';
                    break;
                case '人名':
                    $searchType = 'cv';
                    break;
                default:
                    $searchType = 'game';
            }
            $keyword = trim_strip($matches[2]);
        }

        // 分页导航
        $currentPageNum = 1;
        $maxPageNum = 1;
        $pageParam = '';
        $pqPages = pq('.pages:first');
        if (preg_match('/-\s*(\d+)\s*-/', $pqPages->find('li > a[href="javascript:;"]')->text(), $matches)) {
            $currentPageNum = intval($matches[1]);
        }
        $pqEndPage = $pqPages->find('li:last-child > a');
        if (preg_match('/(?<!\w)page=(\d+)/', $pqEndPage->attr('href'), $matches)) {
            $maxPageNum = intval($matches[1]);
        }
        $pageParam = http_build_query($request->except('page'));

        // 游戏列表
        $gameList = [];
        foreach ($pqArea->find('> table > tr') as $item) {
            $pqItem = pq($item);
            $img = $pqItem->find('> td:first-child > a > img')->attr('src');

            $id = 0;
            $gameName = '';
            $aliasName = '';
            $company = '';
            $sellTime = '';
            $gameType = '';
            $property = '';
            $pqLinkCell = $pqItem->find('> td:last-child');
            $pqLink = $pqLinkCell->find('> b > a');
            if (preg_match('/id=(\d+)/i', $pqLink->attr('href'), $matches)) {
                $id = intval($matches[1]);
            }
            $gameName = trim_strip($pqLink->text());
            if (preg_match('/别名：(.*?)<br><br>会社：(.*?)发售时间:(.+?)<br><br>类型：(.*?)属性：(.*)/', $pqLinkCell->html(), $matches)) {
                $aliasName = trim($matches[1]);
                $company = trim($matches[2]);
                $sellTime = trim($matches[3]);
                $gameType = trim($matches[4]);
                $property = trim($matches[5]);
            }

            $gameList[] = [
                'img' => $img,
                'id' => $id,
                'gameName' => $gameName,
                'aliasName' => $aliasName,
                'company' => $company,
                'sellTime' => $sellTime,
                'type' => $gameType,
                'property' => $property,
            ];
        }

        $data = [
            'keyword' => $keyword,
            'searchType' => $searchType,
            'currentPageNum' => $currentPageNum,
            'prevPageNum' => $currentPageNum > 1 ? $currentPageNum - 1 : 1,
            'nextPageNum' => $currentPageNum < $maxPageNum ? $currentPageNum + 1 : $maxPageNum,
            'maxPageNum' => $maxPageNum,
            'pageParam' => $pageParam,
            'gameList' => $gameList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取本月新作页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function moon($extraData = [])
    {
        debug('begin');
        $doc = null;
        $initTime = 0;
        try {
            debug('initBegin');
            $doc = \phpQuery::newDocumentHTML($this->response['document']);
            debug('initEnd');
            $initTime = debug('initBegin', 'initEnd');
        } catch (\Exception $ex) {
            $this->handleError($ex);
        }
        $commonData = array_merge($this->getCommonData($doc), $extraData);
        $matches = [];

        // 年份、月份列表
        $yearList = [];
        $monthList = [];
        foreach (pq('.pages') as $i => $items) {
            $pqItems = pq($items);
            if ($i === 0) $list = &$yearList;
            else $list = &$monthList;

            foreach ($pqItems->find('li') as $item) {
                $pqItem = pq($item);
                $year = 0;
                $month = 0;
                if (preg_match('/g_moon_y=(\d+)&g_moon_m=(\d+)/i', $pqItem->find('a')->attr('href'), $matches)) {
                    $year = intval($matches[1]);
                    $month = intval($matches[2]);
                }
                $name = trim_strip($pqItem->text());
                $list[] = ['year' => $year, 'month' => $month, 'name' => $name];
            }
        }

        // 该月标题
        $pqMoonTitle = pq('div[style="font-size:18px;font-weight:bold;"]:contains("发售的游戏列表（按日期时间排列）")');
        $moonTitle = trim_strip($pqMoonTitle->text());
        $moonTitle = str_replace('（按日期时间排列）', '', $moonTitle);

        // 该月游戏图片
        $gameImgList = [];
        foreach (pq('img[src$="title_s.jpg"]') as $item) {
            $pqItem = pq($item);
            $pqParent = $pqItem->parent();
            $id = 0;
            $img = '';
            $gameName = '';
            $img = $pqItem->attr('src');
            if (preg_match('/id=(\d+)/i', $pqParent->attr('href'), $matches)) {
                $id = intval($matches[1]);
            }
            $pqContents = $pqParent->contents();
            $gameName = trim_strip($pqContents->eq($pqContents->length - 1)->text());
            $gameImgList[] = ['id' => $id, 'img' => $img, 'name' => $gameName];
        }

        // 该月游戏列表
        $moonGameList = [];
        foreach (explode('<br><br>', $pqMoonTitle->next('div')->html()) as $html) {
            if (preg_match('/\[\s*([\d\-]+)\s*\]\s*<a href="g_intro\.php\?id=(\d+)" target="_blank">([^<>]+)<\/a>\s*(.*)/i', trim($html), $matches)) {
                $id = intval($matches[2]);
                $gameName = trim($matches[3]);
                $sellTime = $matches[1];
                $property = trim($matches[4]);
                $moonGameList[] = ['id' => $id, 'name' => $gameName, 'sellTime' => $sellTime, 'property' => $property];
            }
        }

        $data = [
            'yearList' => array_reverse($yearList),
            'monthList' => array_reverse($monthList),
            'gameImgList' => $gameImgList,
            'moonTitle' => $moonTitle,
            'moonGameList' => $moonGameList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取游戏介绍页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function game($extraData = [])
    {
        debug('begin');
        $doc = null;
        $initTime = 0;
        try {
            debug('initBegin');
            $doc = \phpQuery::newDocumentHTML($this->response['document']);
            debug('initEnd');
            $initTime = debug('initBegin', 'initEnd');
        } catch (\Exception $ex) {
            $this->handleError($ex);
        }
        $commonData = array_merge($this->getCommonData($doc), $extraData);
        $matches = [];

        $pqArea = pq('.intro1');

        // 游戏ID及名称
        $gameId = 0;
        $gameName = '';
        if (preg_match('/id=(\d+)/i', pq('a[href*="tui=1"]')->attr('href'), $matches)) {
            $gameId = intval($matches[1]);
        }
        $gameName = $pqArea->find('> tr:first-child > td')->text();
        $gameName = trim_strip(str_replace(' - 游戏介绍', '', $gameName));

        // 基本信息
        $pqInfoArea = $pqArea->find('> tr:nth-child(2)');
        $pqCoverCell = $pqInfoArea->find('> td:first-child');
        $largeCover = $pqCoverCell->find('a')->attr('href');
        $smallCover = $pqCoverCell->find('a > img')->attr('src');
        $tuiNum = trim_strip($pqCoverCell->find('span:first')->text());
        $gameInfo = replace_common_html_content($pqInfoArea->find('> td:nth-child(2)')->html());
        $gameInfo = str_ireplace('别名：<br>', '别名：无<br>', $gameInfo);
        $gameInfo = str_ireplace('<font color="#0066ff">资料来源', '<font class="text-danger">资料来源', $gameInfo);
        $gameInfo = str_ireplace('</a>.<br>', '</a><br>', $gameInfo);
        $gameInfo = str_ireplace('</a>.<a', '</a>&nbsp;&nbsp;<a', $gameInfo);
        $gameInfo = preg_replace_callback(
            '/初版正式发售日：(\d+)-(\d+)-(\d+)/',
            function ($matches) {
                return sprintf(
                    '初版正式发售日：<a href="%s">%d-%d-%d</a>',
                    url('GameIntro/moon', 'year=' . $matches[1] . '&month=' . $matches[2]),
                    $matches[1],
                    $matches[2],
                    $matches[3]
                );
            },
            $gameInfo
        );

        // 额外信息
        $pqExtraInfoCell = $pqArea->find('> tr:nth-child(3) > td');
        $gameImgList = [];
        foreach ($pqExtraInfoCell->find('div:first > a') as $item) {
            $pqItem = pq($item);
            $largeImg = $pqItem->attr('href');
            $thumbImg = str_replace(config('game_image_domain'), '', $largeImg);
            $thumbImg = str_replace('/', '-', $thumbImg);
            $smallImg = $pqItem->find('img')->attr('src');
            $gameImgList[] = ['largeImg' => $largeImg, 'thumbImg' => $thumbImg, 'smallImg' => $smallImg];
        }
        $pqExtraInfoCell->find('div:first')->remove();
        $gameExtraInfo = replace_common_html_content($pqExtraInfoCell->html());
        $gameExtraInfo = preg_replace('/^[\s\n]*(<br>)+|(<br>)+[\s\n]*$/i', '', $gameExtraInfo);
        $gameExtraInfo = preg_replace('/(<br>){4,}/i', '<br><br>', $gameExtraInfo);

        // 人物列表
        $characterList = [];
        foreach ($pqArea->find('> tr:gt(2):not(:empty)') as $item) {
            $pqItem = pq($item);
            $img = $pqItem->find('td:first-child > img')->attr('src');
            $intro = replace_common_html_content($pqItem->find('td:nth-child(2)')->html());
            $intro = preg_replace('/^[\s\n]*(<br>)+|(<br>)+[\s\n]*$/i', '', $intro);
            $intro = str_ireplace('　CV：', '<br>CV：', $intro);
            $intro = preg_replace('/　　|　 /', '<br>', $intro);
            $characterList[] = ['img' => $img, 'intro' => $intro];
        }

        $data = [
            'id' => $gameId,
            'gameName' => $gameName,
            'largeCover' => $largeCover,
            'smallCover' => $smallCover,
            'tuiNum' => $tuiNum,
            'gameInfo' => $gameInfo,
            'gameImgList' => $gameImgList,
            'gameExtraInfo' => $gameExtraInfo,
            'characterList' => $characterList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取游戏公司介绍页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function company($extraData = [])
    {
        debug('begin');
        $doc = null;
        $initTime = 0;
        try {
            debug('initBegin');
            $doc = \phpQuery::newDocumentHTML($this->response['document']);
            debug('initEnd');
            $initTime = debug('initBegin', 'initEnd');
        } catch (\Exception $ex) {
            $this->handleError($ex);
        }
        $commonData = array_merge($this->getCommonData($doc), $extraData);
        $matches = [];

        // 公司ID及名称
        $companyId = 0;
        $companyName = '';
        if (preg_match('/id=(\d+)/i', pq('a[href*="tui=1"]')->attr('href'), $matches)) {
            $companyId = intval($matches[1]);
        }
        $companyName = pq('#div940_2 > #divtitle1')->text();
        $companyName = trim_strip(str_replace(' - 会社介绍', '', $companyName));

        // 基本信息
        $pqInfoArea = pq('#div740_2:first > div:nth-child(2)');
        $companyCover = $pqInfoArea->find('> div:last-child > img')->attr('src');
        $companyInfo = replace_common_html_content($pqInfoArea->find('> div:first-child')->html());
        $companyInfo = str_ireplace('<br><br>', '<br>', $companyInfo);
        $companyInfo = str_ireplace('<font color="#0066ff">资料来源', '<font class="text-danger">资料来源', $companyInfo);
        $tuiNum = trim_strip(pq('#div200_2:eq(1) > #divtitle2 > span:first')->text());

        // 公司介绍
        $companyIntro = pq('#div740_2:eq(1) > div:last-child')->html();

        // 主要人员
        $companyStaff = pq('#div740_2:eq(2) > div:last-child')->html();

        // 相关信息
        $companyExtraInfo = pq('#div740_2:eq(3) > div:last-child')->html();

        // 该公司受关注作品排行
        $gameAttentionRankList = [];;
        foreach (pq('#div200_2:eq(2) > #divtitle2 > a') as $item) {
            $pqItem = pq($item);
            $id = 0;
            $gameName = '';
            if (preg_match('/id=(\d+)/i', $pqItem->attr('href'), $matches)) {
                $id = intval($matches[1]);
            }
            $gameName = trim_strip($pqItem->text());
            $gameAttentionRankList[] = ['id' => $id, 'name' => $gameName];
        }

        $data = [
            'id' => $companyId,
            'companyName' => $companyName,
            'companyCover' => $companyCover,
            'companyInfo' => $companyInfo,
            'tuiNum' => $tuiNum,
            'companyIntro' => $companyIntro,
            'companyStaff' => $companyStaff,
            'companyExtraInfo' => $companyExtraInfo,
            'gameAttentionRankList' => $gameAttentionRankList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取游戏类型介绍页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function type($extraData = [])
    {
        debug('begin');
        $doc = null;
        $initTime = 0;
        try {
            debug('initBegin');
            $doc = \phpQuery::newDocumentHTML($this->response['document']);
            debug('initEnd');
            $initTime = debug('initBegin', 'initEnd');
        } catch (\Exception $ex) {
            $this->handleError($ex);
        }
        $commonData = array_merge($this->getCommonData($doc), $extraData);
        $matches = [];

        // 游戏类型ID及名称
        $typeId = 0;
        $typeName = '';
        if (preg_match('/id=(\d+)/i', pq('a[href*="tui=1"]')->attr('href'), $matches)) {
            $typeId = intval($matches[1]);
        }
        $typeName = pq('#div940_2 > div:first > font')->text();

        // 基本信息
        $pqInfoArea = pq('#div740_2:first > div:nth-child(2)');
        $typeCover = $pqInfoArea->find('> div:last-child > img')->attr('src');
        $typeInfo = replace_common_html_content($pqInfoArea->find('> div:first-child')->html());
        $typeInfo = preg_replace('/^[\s\n]*(<br>)+|(<br>)+[\s\n]*$/i', '', $typeInfo);
        $typeInfo = str_ireplace('<br><br>', '<br>', $typeInfo);
        $typeInfo = str_ireplace('<font color="#0066ff">资料来源', '<font class="text-danger">资料来源', $typeInfo);
        $tuiNum = trim_strip(pq('#div200_2:eq(1) > #divtitle2 > span:first')->text());

        // 类型说明
        $typeIntro = pq('#div740_2:eq(1) > div:last-child')->html();

        // 该类型游戏举例
        $typeExample = pq('#div740_2:eq(2) > div:last-child')->html();

        // 相关信息
        $typeExtraInfo = pq('#div740_2:eq(3) > div:last-child')->html();

        // 该游戏类型受关注排行
        $gameAttentionRankList = [];;
        foreach (pq('#div200_2:eq(2) > #divtitle2 > a') as $item) {
            $pqItem = pq($item);
            $id = 0;
            $gameName = '';
            if (preg_match('/id=(\d+)/i', $pqItem->attr('href'), $matches)) {
                $id = intval($matches[1]);
            }
            $gameName = trim_strip($pqItem->text());
            $gameAttentionRankList[] = ['id' => $id, 'name' => $gameName];
        }

        $data = [
            'id' => $typeId,
            'typeName' => $typeName,
            'typeCover' => $typeCover,
            'typeInfo' => $typeInfo,
            'tuiNum' => $tuiNum,
            'typeIntro' => $typeIntro,
            'typeExample' => $typeExample,
            'typeExtraInfo' => $typeExtraInfo,
            'gameAttentionRankList' => $gameAttentionRankList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }

    /**
     * 获取游戏属性介绍页面的响应数据
     * @param array $extraData 额外参数
     * @return array 响应数据
     */
    public function property($extraData = [])
    {
        debug('begin');
        $doc = null;
        $initTime = 0;
        try {
            debug('initBegin');
            $doc = \phpQuery::newDocumentHTML($this->response['document']);
            debug('initEnd');
            $initTime = debug('initBegin', 'initEnd');
        } catch (\Exception $ex) {
            $this->handleError($ex);
        }
        $commonData = array_merge($this->getCommonData($doc), $extraData);
        $matches = [];

        // 游戏属性ID及名称
        $propertyId = 0;
        $propertyName = '';
        if (preg_match('/id=(\d+)/i', pq('a[href*="tui=1"]')->attr('href'), $matches)) {
            $propertyId = intval($matches[1]);
        }
        $propertyName = pq('#div940_2 > div:first > font')->text();

        // 基本信息
        $pqInfoArea = pq('#div740_2:first > div:nth-child(2)');
        $propertyCover = $pqInfoArea->find('> div:last-child > img')->attr('src');
        $propertyInfo = replace_common_html_content($pqInfoArea->find('> div:first-child')->html());
        $propertyInfo = str_ireplace('<br><br>', '<br>', $propertyInfo);
        $propertyInfo = str_ireplace('<font color="#0066ff">资料来源', '<font class="text-danger">资料来源', $propertyInfo);
        $tuiNum = trim_strip(pq('#div200_2:eq(1) > #divtitle2 > span:first')->text());

        // 属性说明
        $propertyIntro = pq('#div740_2:eq(1) > div:last-child')->html();

        // 人物举例
        $personExample = pq('#div740_2:eq(2) > div:last-child')->html();

        // 相关信息
        $propertyExtraInfo = pq('#div740_2:eq(3) > div:last-child')->html();

        // 游戏属性受关注排行
        $gameAttentionRankList = [];;
        foreach (pq('#div200_2:eq(2) > #divtitle2 > a') as $item) {
            $pqItem = pq($item);
            $id = 0;
            $gameName = '';
            if (preg_match('/id=(\d+)/i', $pqItem->attr('href'), $matches)) {
                $id = intval($matches[1]);
            }
            $gameName = trim_strip($pqItem->text());
            $gameAttentionRankList[] = ['id' => $id, 'name' => $gameName];
        }

        $data = [
            'id' => $propertyId,
            'propertyName' => $propertyName,
            'propertyCover' => $propertyCover,
            'propertyInfo' => $propertyInfo,
            'tuiNum' => $tuiNum,
            'propertyIntro' => $propertyIntro,
            'personExample' => $personExample,
            'propertyExtraInfo' => $propertyExtraInfo,
            'gameAttentionRankList' => $gameAttentionRankList,
        ];
        debug('end');
        trace('phpQuery解析用时：' . debug('begin', 'end') . 's' . '（初始化：' . $initTime . 's）');
        if (config('app_debug')) trace('响应数据：' . json_encode($data, JSON_UNESCAPED_UNICODE));
        return array_merge($commonData, $data);
    }
}
