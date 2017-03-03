var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    inject = require('gulp-inject'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    fontmin = require('gulp-fontmin'),
    gulpsync = require('gulp-sync')(gulp);

var config = {
    'src': './src',
    'dest': './dist',
    'html': {
        'src': './src/*.html',
        'dest': './dist/'
    },
    'sass': {
        'dest': './dist/css',
        'src': './src/styles/style.scss'
    },
    'js': {
        'src': [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/tether/dist/js/tether.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            './src/js/*.js'
        ],
        'dest': './dist/js'
    },
    'img': {
        'dest': './dist/images/',
        'src': './src/images/*'
    }
};

gulp.task('copy:html', function () {
    return gulp.src(config.html.src)
        .pipe(gulp.dest(config.html.dest));
});

gulp.task('minify:html', function() {
    return gulp.src(config.html.src)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.html.dest));
});

gulp.task('img', function () {
    return gulp.src(config.img.src)
        .pipe(gulp.dest(config.img.dest));
});

gulp.task('minify:img', function () {
        return gulp.src(config.img.src)
            .pipe(imagemin())
            .pipe(gulp.dest(config.img.dest));
    }
);

gulp.task('sass', function () {
    return gulp.src(config.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: '> 5%'
        }))
        .pipe(cssnano())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(config.sass.dest));
});

gulp.task('js', function () {
    return gulp.src(config.js.src)
        .pipe(concat('app.min.js'))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest(config.dest + '/js'));
});

gulp.task('css', ['sass'], function () {
    return gulp.src(config.css.src)
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(config.dest + '/css'));
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/*.ttf')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('inject', ['css', 'js', 'img', 'js:optional', 'copy:html'], function () {
    return gulp.src(config.html.src)
        .pipe(inject(
            gulp.src([
                './dist/js/app.min.js',
                './dist/css/app.min.css'
            ], {read: false})
            , {relative: true}
        ))
        .pipe(gulp.dest(config.html.dest));
});

gulp.task('clean', function () {
    return gulp.src(config.dest, {read: false})
        .pipe(clean());
});

gulp.task('default', gulpsync.sync(['clean', ['minify:html', 'minify:img', 'sass', 'js', 'fonts']]));

gulp.task('build',['minify:html', 'minify:img', 'sass', 'js'], function () {});

gulp.task('watch', function () {
    gulp.watch([
        config.sass.path + '/**/*.scss',
        config.js.path + '/**/*.js',
        config.html.src
    ], ['build']);
});
