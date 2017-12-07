var gulp = require('gulp'),
// common
    lr = require('tiny-lr'),
    livereload = require('gulp-livereload'),
    lec = require('gulp-line-ending-corrector'),
    concat = require('gulp-concat'),
    server = lr(),
    expect = require('gulp-expect-file'),
// css
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
// js
    uglify = require('gulp-uglify'),
    fileinclude = require('gulp-file-include'),
    bower = require('gulp-bower'),
    angularFilesort = require('gulp-angular-filesort');

var express = require('express');
var vhost = require('vhost');
var proxyMiddleware = require('http-proxy-middleware');
var revHash = require('gulp-rev-hash');
var hash_src = require("gulp-hash-src");
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');
var https = require('https');

var jsPaths = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/angular/angular.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-cookies/angular-cookies.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angular-environment/dist/angular-environment.min.js',
    'bower_components/angular-jquery/dist/angular-jquery.min.js'
];

/**
 * Сборка Vendor JS
 */
gulp.task('js-vendor', ['bower'], function(){
    return gulp.src(jsPaths)
        .pipe(expect(jsPaths))
        .pipe(concat('vendor.js'))
        .pipe(lec({ eolc: 'LF', encoding:'utf8'}))
        .pipe(gulp.dest('./sites/src/js'))
});

/**
 * Сборка всего JS
 */
var jsGen = function(name){
    return function(){
        var gulpUrl = './assets/' + name + '/**/*.js',
            gulpDest = './sites/' + name + '/js';
        return gulp.src([gulpUrl])
            .pipe(angularFilesort())
            .pipe(concat('script.js'))
            .pipe(lec({eolc: 'LF', encoding:'utf8'}))
            .pipe(gulp.dest(gulpDest));
            //.pipe(livereload(server));
    };
};

gulp.task('js-stream', jsGen('chatfuel'));

/**
 * Сборка всего CSS + LESS
 */
var lessGen = function(name){
    return function (){
        var gulpSrc = './assets/' + name + '/core/styles/_common.less',
            gulpDest = './sites/' + name + '/css';
        return gulp.src(gulpSrc)
            .pipe(less({compress: true}))
            .pipe(autoprefixer())
            .pipe(concat('style.css'))
            .pipe(lec({eolc: 'LF', encoding:'utf8'}))
            .pipe(gulp.dest(gulpDest));
            //.pipe(livereload(server));
    };
};
gulp.task('less-stream', lessGen('chatfuel'));

/**
 * Сборка всего HTML
 */
var htmlGen = function(name) {
    return function (){
        var gulpSrc = './assets/'+name+'/modules/index.html',
            gulpHashSrc = './sites/' + name,
            gulpHashPath = './assets/' + name + '/modules',
            gulpDest = './sites/' + name;
        return gulp.src([gulpSrc])
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(revHash({assetsDir: './sites'}))
            .pipe(hash_src({build_dir: gulpHashSrc, src_path: gulpHashPath}))
            .pipe(gulp.dest(gulpDest));
    }
};
gulp.task('html-stream',['js-stream', 'templates'], htmlGen('chatfuel'));

/**
 * Сборка всех шаблонов в JS файл - kaskonokika
 */
function templateGen(name) {
    return function (){
        var gulpSrc = './assets/' + name + '/modules/**/*.html',
            gulpDest = './sites/' + name + '/js';
        return gulp.src([gulpSrc])
            .pipe(htmlmin({
                collapseWhitespace: true,
                conservativeCollapse: true
            }))
            .pipe(templateCache('templates.js', {
                module: name,
                root: '/'
            }))
            .pipe(gulp.dest(gulpDest));
            //.pipe(livereload(server));
    }
}
gulp.task('templates-stream', [], templateGen('chatfuel'));

/**
 * Запуск bower install перед сборкой, что бы у всех всегда совпадали версии либ.
 */
gulp.task('bower', ['bower-prune'], function() {
    return bower();
});

gulp.task('bower-prune', function() {
    return bower({cmd: 'prune'});
});

gulp.task('chatfuel', [
    'js-stream', 'less-stream', 'html-stream'
]);
gulp.task('templates', ['templates-stream']);
gulp.task('html', ['html-stream']);

gulp.task('build', ['chatfuel']);

var taskWatch = function(){
    gulp.run('build');

    gulp.watch(['./assets/chatfuel/**/*.html'], ['html-stream']);
    gulp.watch(['./assets/chatfuel/**/*.less'],['less-stream']);
    gulp.watch(['./assets/chatfuel/**/*.js'],['js-stream']);
};

// Watch
gulp.task('watch', function() {
    //livereload.listen();
    server.listen(35729, function(err) { //35729
        if (err) return console.log(err);
        taskWatch()
    });
    gulp.run('local-serverRu');
});

// configure proxy middleware options
var options = {
    target: 'http://api.chatfuel.ru', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    secure: false,                   //for https
    onProxyRes: function(proxyRes, req, res) {
        var cook = proxyRes.headers['set-cookie'];

        if(cook!=undefined ) {
            if (cook[0].indexOf('PLAY_SESSION')>-1) {
                proxyRes.headers['set-cookie'] = cook[0].replace('Domain=.chat.fuel','Domain=.chat.fuel');
                console.log('cookie created successfully');
            }
        }
    }
};

var proxy = proxyMiddleware(['/api','/kaskonomika'], options);

var serverGen = function(proxy1, cb){
    var streamApp = expressFunc('chatfuel');

    return function() {
        express()
            .use('/src', express.static('./sites/src'))
            .use(proxy1).on('upgrade', proxy1.upgrade)//
            .use(vhost('chat.fuel', streamApp))
            .listen(9360);
        cb()
    };

    function expressFunc(name) {
        return express()
            .use(express.static('./sites/' + name))
            .get('/*', function(req, res, next) {
                if (req.path.indexOf('/src') > -1) return next();
                res.sendFile("index.html", {"root": __dirname + '/sites/' + name});
            })
    }
};

// Local server
gulp.task('local-serverRu', serverGen(proxy, function(){}));

// Default
gulp.task('default', function() {
    gulp.run('watch');
});