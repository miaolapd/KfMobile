'use strict';
/* 导入模块 */
const gulp = require('gulp');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const del = require('del');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const runSequence = require('run-sequence');

/* 路径、文件名常量定义 */
const staticPath = 'public/static/';
const appJsFileName = 'app.js';

const srcPath = staticPath + 'src/';
const jsSrcPath = srcPath + 'js/';
const jsLibSrcPath = jsSrcPath + 'lib/';
const jsUserScriptSrcPath = jsSrcPath + 'userScript/';
const sassSrcPath = srcPath + 'sass/';
const cssSrcPath = srcPath + 'css/';
const fontSrcPath = srcPath + 'fonts/';
const imgSrcPath = srcPath + 'img/';

const distPath = staticPath + 'dist/';
const jsDistPath = distPath + 'js/';
const jsLibDistPath = jsDistPath + 'lib/';
const jsUserScriptDistPath = jsDistPath + 'userScript/';
const cssDistPath = distPath + 'css/';
const fontDistPath = distPath + 'fonts/';
const imgDistPath = distPath + 'img/';

/**
 * 打包模块
 * @returns {*}
 */
const getBundler = function () {
    return browserify({entries: [jsSrcPath + 'app.js'], debug: true})
        .transform(babelify, {presets: ['es2015']});
};

/**
 * 编译脚本
 * @param bundler
 * @returns {*}
 */
const compileScript = function (bundler) {
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Compile Script Error:\n'))
        .pipe(source(appJsFileName))
        .pipe(replace(/\r\n/g, '\n'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest(jsDistPath))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDistPath));
};

// 编译脚本的任务
gulp.task('script', function () {
    return compileScript(getBundler());
});

// 编译Sass的任务
gulp.task('sass', function () {
    gulp.src(sassSrcPath + '*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssSrcPath))
        .pipe(cleanCss())
        .pipe(autoprefixer({
            browsers: [
                'Chrome >= 45',
                'Firefox >= 38',
                'Edge >= 12',
                'Explorer >= 10',
                'iOS >= 9',
                'Safari >= 9',
                'Android >= 4.4',
                'Opera >= 30'
            ]
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(cssDistPath));
});

const bundler = watchify(getBundler());
// 监视任务
gulp.task('watch', function () {
    gulp.watch(sassSrcPath + '*.scss', ['sass']);

    bundler.on('update', function () {
        console.log('-> Compiling Script...');
        compileScript(bundler);
    });
    bundler.on('log', gutil.log);
    return compileScript(bundler);
});

// 清除编译文件夹的任务
gulp.task('clean', function (cb) {
    return del([cssSrcPath, distPath], cb);
});

// 将源文件夹的文件复制到编译文件夹的任务
gulp.task('copy', function () {
    gulp.src(jsLibSrcPath + '*.js')
        .pipe(gulp.dest(jsLibDistPath));

    gulp.src(jsUserScriptSrcPath + '*.js')
        .pipe(gulp.dest(jsUserScriptDistPath));

    gulp.src(fontSrcPath + '**/*.*')
        .pipe(gulp.dest(fontDistPath));

    gulp.src(imgSrcPath + '**/*.*')
        .pipe(gulp.dest(imgDistPath));
});

// 生成所有文件的任务
gulp.task('build', function (cb) {
    runSequence('clean', ['sass', 'script', 'copy'], cb);
});

// 默认任务
gulp.task('default', ['build']);
