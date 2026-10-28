<?php

namespace app\middleware;

use Closure;
use think\Request;
use think\response\Html;

/**
 * 兼容 TP5 的 AJAX 自动响应：
 * TP8 依据 Accept 是否包含 json 选择响应类型，而旧版依据 X-Requested-With。
 * 这里把 AJAX 请求下携带数组数据的 HTML 响应转换为 JSON。
 */
class AjaxResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->isAjax() && $response instanceof Html && is_array($response->getData())) {
            $json = json($response->getData());
            $json->code($response->getCode());

            foreach ($response->getHeader() as $name => $value) {
                // 保留状态/自定义头，但不要覆盖 JSON 的 Content-Type/Content-Length
                if (in_array(strtolower($name), ['content-type', 'content-length'], true)) {
                    continue;
                }
                $json->header([$name => $value]);
            }

            return $json;
        }

        return $response;
    }
}
