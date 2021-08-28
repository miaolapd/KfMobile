# KfMobile
_为这美好的KF献上祝福！_

## 项目简介
本项目为【为这美好的KF献上祝福！】计划第三弹，旨在为广大KFer提供适用于移动浏览器的KF反向代理服务。  
_Present for every KFer!_

## 网址
https://m.miaola.work/

## 讨论帖
https://bbs.kfmax.com/read.php?tid=564787&sf=406

## 更新日志
[详细日志请参见此页面&raquo;](https://github.com/miaolapd/KfMobile/releases)

## 环境要求
本项目基于ThinkPHP、phpQuery以及Bootstrap打造，环境要求：

    php >= 5.6.0 && < 7.2.0
    cURL PHP Extension
    mbstring PHP Extension

## 源码下载方式
共分为两种方式：

### 1、直接下载
点击GitHub项目页面上方的`Clone or download` &gt; `Download ZIP`按钮下载最新版的打包文件。

### 2、使用git下载
在适当目录下执行：

    git clone https://github.com/miaolapd/KfMobile.git
以后在项目目录下执行`git pull`即可获取更新。

## 调试
在`application`目录下将`my.debug.php`示例文件复制一份并将其命名为`my.php`即可开启调试模式。  
注：Linux下，如出现`mkdir(): Permission denied`的错误，请将`runtime`目录的权限改为0777（如找不到该目录请自行建立）

### 编译静态资源文件
在项目目录下执行`npm install`安装依赖包（需安装Node.js）；  
执行`gulp bulid`，可对静态资源文件进行编译；  
执行`gulp watch`，可监视静态资源文件的改动并立即进行编译；

## 部署
删除`application`目录下之前用于调试的`my.php`文件，并在该目录下将`my.product.php`示例文件复制一份且将其命名为`my.php`。  
可修改`my.php`文件里的配置，还可增加任何在`application/config.php`文件中你想覆盖的配置。  
注：每次更新KfMobile之后，如发现网站界面未更新（在非调试模式下），请删除`runtime`目录下的`temp`模板缓存文件夹。

### 虚拟主机配置
网站的入口为`public/index.php`文件，因此请将虚拟主机的root目录设为项目目录下的`public`文件夹。

Nginx虚拟主机配置参考：

    proxy_connect_timeout      20s;
    proxy_read_timeout         60s;
    proxy_send_timeout         60s;
    proxy_buffer_size          32k;
    proxy_buffers              4 64k;
    proxy_busy_buffers_size    128k;
    proxy_temp_file_write_size 512k;
    proxy_temp_path            /var/lib/nginx/proxy;
    proxy_cache_path           /var/lib/nginx/cache levels=1:2 keys_zone=cache_kf:10m inactive=1d max_size=1g;
    
    server {
        listen      80;
        listen      [::]:80;
        server_name m.miaola.work;
        root        /var/www/KfMobile/public;
        access_log  /var/log/nginx/m.miaola.work.access.log  combined;
        index       index.php index.html;
    
        location / {
            if (!-e $request_filename) {
                rewrite ^/index.php/(.*)$ /index.php?s=$1 last;
                rewrite ^/(.*)$ /index.php?s=$1 last;
                break;
            }
        }
    
        location ^~ /static/ {
            index   index.html;
            expires 7d;
            charset utf-8;
        }
    
        location ~ ^/(ys|js|data|\d+)/ {
            proxy_pass https://www.kfmax.com;
            expires 1d;
    
            proxy_cache_key       'kf_$request_uri';
            proxy_cache           cache_kf;
            proxy_cache_valid     200 304 30m;
            proxy_cache_valid     301 302 30m;
            proxy_cache_valid     500 502 503 5s;
            proxy_cache_valid     any 1m;
            proxy_cache_use_stale invalid_header error timeout http_500 http_502 http_503;
    
            proxy_set_header     Host www.kfmax.com;
            proxy_set_header     X-Real-IP $remote_addr;
            proxy_set_header     X-Forwarded-For $remote_addr;
            proxy_set_header     Accept-Encoding '';
            proxy_ignore_headers 'Cache-Control' 'Expires';
        }
    
        location ~ ^/(?!index)\w+\.php$ {
            proxy_pass https://www.kfmax.com;
            proxy_redirect off;
    
            proxy_set_header Host www.kfmax.com;
            proxy_set_header User-Agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:52.0) Gecko/20100101 Firefox/52.0';
            proxy_set_header Referer https://www.kfmax.com;
            proxy_set_header Accept-Encoding '';
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $remote_addr;
    
            sub_filter 'https://www.kfmax.com' '$scheme://$host';
        }
    
        location ~ \.php$ {
            try_files      $uri =404;
            fastcgi_pass   unix:/run/php/php7.0-fpm.sock;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }
    }

## License
[MIT](http://opensource.org/licenses/MIT)
