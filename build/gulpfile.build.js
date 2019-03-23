const gulp = require('gulp');
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const glob = require('glob'); // 检测需要分类文件或文件夹
const merge = require('merge-stream'); // 合并多个任务
const browserify = require('browserify'); // 用于browserify打包
const babelify = require('babelify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const postcssrc = require('postcss-load-config'); // 加载 .postcssrc.js
const concat = require('gulp-concat'); // 拼接文件
const uglify = require('gulp-uglify'); // 压缩js
const connect = require('gulp-connect'); // websock更新文件刷新浏览器
const plumber = require('gulp-plumber'); // 避免出错task终止
const minimist = require('minimist'); // 用于命令行传参数
const gulpif = require('gulp-if'); // 用于命令行传参
const cleanCSS = require('gulp-clean-css'); // 缩小css文件
const changed = require('gulp-newer'); // 增量更新
const babel = require('gulp-babel');
const opn = require('opn'); // 开启浏览器
const del = require('del'); // 删除dist文件夹
const Config = require('./gulpfile.config');
const { getPort } = require('./utils');

// 命令行传参数
const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};
const options = minimist(process.argv.slice(2), knownOptions);

// 删除dist目录
const clean = () => {
  return del(['dist']);
};
// 检查端口冲突
const checkPort = async () => {
  Config.connect.port = await getPort();
};

// 开启文件服务器
const openServer = async () => await connect.server(Config.connect);

// HTML文件
const htmls = () => {
  return gulp
    .src(Config.html.src)
    .pipe(changed(Config.html.dist))
    .pipe(plumber())
    .pipe(gulp.dest(Config.html.dist))
    .pipe(connect.reload());
};

// CSS文件
const styles = async () => {
  const config = await postcssrc();
  return gulp
    .src([Config.css.src, Config.css.avoid])
    .pipe(changed(Config.css.dist))
    .pipe(plumber())
    .pipe(stylus())
    .pipe(postcss(config.plugins, config.options))
    .pipe(gulpif(options.env === 'production', cleanCSS()))
    .pipe(gulp.dest(Config.css.dist))
    .pipe(connect.reload());
};

// 图片文件
const images = () => {
  return gulp
    .src(Config.images.src)
    .pipe(changed(Config.images.dist))
    .pipe(plumber())
    .pipe(gulp.dest(Config.images.dist))
    .pipe(connect.reload());
};

// JS文件
const scripts = () => {
  return gulp
    .src([Config.js.src, Config.blockJS.avoid, Config.entryJS.avoid])
    .pipe(changed(Config.js.dist))
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulpif(options.env === 'production', uglify()))
    .pipe(gulp.dest(Config.js.dist))
    .pipe(connect.reload());
};

// 相关js库文件
const libs = async () => {
  const dir = glob.sync(Config.src + 'libs/*');
  const tasks = dir.map(folder => {
    const distName = folder.split('/').slice(-1)[0]; // 文件夹名字， 需要将库文件放到子目录
    return gulp
      .src(`${folder}/*.js`)
      .pipe(plumber())
      .pipe(uglify())
      .pipe(concat(`${distName}.vendor.js`))
      .pipe(gulp.dest(Config.libs.dist + distName))
      .pipe(connect.reload());
  });

  return merge(tasks);
};

// 自动打开浏览器
const openBrowser = async () => {
  const { host, port } = Config.connect;
  const url = `http://${host}:${port}/pages`;
  opn(url);
};

// 观测文件变化

const browserJS = async () => {
  const entrys = await glob.sync(Config.src + 'js/**/*.entry.js');

  const tasks = entrys.map(entry => {
    const distName = entry.split('src/js/').slice(-1)[0]; // dest任务导出
    return browserify({ entries: [entry] })
      .transform('babelify')
      .bundle()
      .pipe(source(distName))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(gulpif(options.env === 'production', uglify()))
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(Config.js.dist))
      .pipe(connect.reload());
  });

  return merge(tasks);
};

const watchFiles = () => {
  gulp.watch(Config.html.src, htmls);
  gulp.watch(Config.css.src, styles);
  gulp.watch(Config.images.src, images);
  gulp.watch(Config.js.src, gulp.parallel(scripts, browserJS));
  gulp.watch(Config.libs.src, libs);
};

// 任务分类 build task && dev task
const devBuild = gulp.series(
  clean,
  checkPort,
  gulp.parallel(openServer, htmls, styles, images, scripts, libs, browserJS),
  openBrowser
);

const prodbuild = gulp.series(
  clean,
  gulp.parallel(htmls, styles, images, scripts, libs, browserJS)
);

const build = options.env === 'production' ? prodbuild : devBuild;
options.env === 'production' ? null : watchFiles(); // in prod env close watchFiles.

module.exports = build;
