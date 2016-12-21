'use strict';

var appName = 'thurst-co';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    shell = require('shelljs'),
    argv = require('yargs').argv;

$.wiredep = require('wiredep').stream;

var variables = {
    filters: {
        all: '**/*',
        css: '**/*.css',
        jade: '**/*.jade',
        jade_: '**/_*.jade',
        js: '**/*.js',
        js_spec: '**/*.spec.js',
        html: '**/*.html',
        scss: '**/*.scss',
        scss_: '**/_*.scss'
    },
    src: {
        tmp: '.tmp/',
        app: 'src/',
        components: 'components/',
        dist: 'www/'
    }
};
variables.src.appJs = [variables.src.app + variables.src.components + variables.filters.js, '!' + variables.src.app + variables.src.components + variables.filters.js_spec];
variables.src.jadeAll = [variables.src.app + variables.src.components + variables.filters.jade, variables.src.app + 'index.jade'];
variables.src.jadeChildren = variables.src.app + variables.src.components + variables.filters.jade_;
variables.src.jadeParents = variables.src.jadeAll.concat('!' + variables.src.jadeChildren);

gulp.task('default', ['jshint', 'bower', 'watch'], bSync);

gulp.task('build', ['jshint', 'build-styles', 'build-partials', 'build-fonts'], buildProject);
gulp.task('build-app', ['build'], buildApp);


gulp.task('jshint', jshint);
gulp.task('watch', ['watch-partials', 'watch-styles'], watch);
gulp.task('watch-partials', watchPartials);
gulp.task('watch-styles', watchStyles);

gulp.task('build-partials', buildPartials);
gulp.task('build-styles', ['build-clean'], buildStyles);
gulp.task('build-fonts', buildFonts);

gulp.task('bower', bowerComponents);

gulp.task('build-clean', clean);


function bSync() {
    var options = {
        port: 3000,
        files: [
            variables.src.appJs,
            variables.src.tmp + variables.filters.html,
            variables.src.tmp + variables.filters.css
        ],
        server: {
            baseDir: [
                variables.src.app,
                variables.src.tmp
            ],
            middleware: [],
            routes: {
                '/bower_components': 'bower_components'
            }
        },
        ghostMode: false,
        ui: false,
        notify: false
    };
    browserSync.init(options);
}

function buildProject(cb) {
    var jsFilter = $.filter(variables.filters.js);
    var cssFilter = $.filter(variables.filters.css);
    var assets = $.useref.assets();
    gulp
        .src([variables.src.tmp + 'index.html'])
        .pipe($.wiredep({}))
        .pipe($.inject(
            gulp
                .src(variables.src.appJs)
                .pipe($.naturalSort('asc'))
                .pipe($.angularFilesort()), {
                starttag: '<!-- inject:js -->',
                addRootSlash: false,
                addPrefix: '../'
            }
        ))
        .pipe($.inject(
            gulp
                .src(variables.src.tmp + variables.src.components + variables.filters.js), {
                starttag: '<!-- inject:partials -->',
                addRootSlash: false,
                addPrefix: '../'
            }
        ))
        .pipe($.inject(
            gulp
                .src(variables.src.tmp + '**/styles.css'), {
                starttag: '<!-- inject:css -->',
                addRootSlash: false,
                addPrefix: '../'
            }
        ))
        .pipe(assets)
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(variables.src.dist));

    gulp
        .src(['src/assets/**/*'], {
            base: 'src'
        })
        .pipe(gulp.dest(variables.src.dist));

    cb();
}
function buildApp() {
    var platform = argv.platform || '';

    shell.echo('cordova build ' + platform);
}

function jshint() {
    return gulp.src([variables.src.app + variables.filters.js])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
}
function watch() {
    $.watch([
        variables.src.app + variables.filters.js,
        variables.src.app + variables.filters.jade,
        variables.src.app + variables.filters.html
    ], function () {
        gulp.start('watch-partials');
    });
    $.watch([variables.src.app + variables.filters.js], function () {
        gulp.start('jshint');
    });
    $.watch([variables.src.app + variables.filters.scss], function () {
        gulp.start('watch-styles');
    });
    $.watch('bower.json', function () {
        gulp.start('watch-partials');
    });
}
function watchPartials() {
    var indexFilter = $.filter('index.html', {restore: true});
    var filesJade = gulp
        .src(variables.src.jadeParents)
        .pipe($.plumber())
        .pipe($.jade({pretty: true}))
        .pipe(indexFilter);

    var filesHtml = gulp
        .src(variables.src.app + variables.src.components + variables.filters.html);

    var filesJs = gulp
        .src(variables.src.appJs)
        .pipe($.naturalSort('asc'))
        .pipe($.angularFilesort());

    filesHtml
        .pipe($.cached('compiled-html'))
        .pipe(gulp.dest(variables.src.tmp));

    return filesJade
        .pipe($.inject(filesJs, {relative: true}))
        .pipe($.wiredep({}))
        .pipe(browserSync.stream())
        .pipe(gulp.dest(variables.src.tmp))
        .pipe(indexFilter.restore())
        .pipe($.cached('compiled-html'))
        .pipe(gulp.dest(variables.src.tmp + variables.src.components))
        .pipe(browserSync.stream());
}
function watchStyles() {
    return gulp
        .src([
            variables.src.app + variables.src.components + variables.filters.scss,
            '!' + variables.src.app + variables.src.components + variables.filters.scss_
        ])
        .pipe($.plumber())
        .pipe($.sass({
            sourceComments: 'map',
            errLogToConsole: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'Firefox > 2'],
            cascade: false
        }))
        .pipe($.flatten())
        .pipe(gulp.dest(variables.src.tmp))
        .pipe(browserSync.stream());
}

function buildStyles() {
    return gulp
        .src([
            variables.src.app + variables.src.components + variables.filters.scss,
            '!' + variables.src.app + variables.src.components + variables.filters.scss_
        ])
        .pipe($.plumber())
        .pipe($.sass({
            sourceComments: 'map',
            errLogToConsole: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'Firefox > 2'],
            cascade: false
        }))
        .pipe($.flatten())
        .pipe(gulp.dest(variables.src.tmp))
}
function buildPartials() {
    var indexFilter = $.filter('**/index.html');

    gulp
        .src(variables.src.app + variables.src.components + variables.filters.html)
        .pipe(gulp.dest(variables.src.tmp))
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'app',
            prefix: variables.src.components,
            declareModule: false
        }))
        .pipe($.count())
        .pipe(gulp.dest(variables.src.tmp + variables.src.components));

    return gulp
        .src(variables.src.jadeAll)
        .pipe($.jade({pretty: true}))
        .pipe(indexFilter)
        .pipe(gulp.dest(variables.src.tmp))
        .pipe(indexFilter.restore())
        .pipe($.ignore.exclude('index.html'))
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'app',
            prefix: variables.src.components,
            declareModule: false
        }))
        .pipe($.count())
        .pipe(gulp.dest(variables.src.tmp + variables.src.components));
}
function buildFonts() {
    var fonts = [
        '**/*.{eot,svg,ttf,woff,woff2}'
    ];
    var destination = variables.src.dist + 'fonts';
    gulp
        .src(fonts)
        .pipe($.flatten())
        .pipe(gulp.dest(destination));
}
function bowerComponents() {
    return $.bower();
}

function clean(cb) {
    del.sync([
        variables.src.dist + '**'
    ]);
    cb();
}
