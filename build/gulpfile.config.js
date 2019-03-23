const { host } = require('./utils');

const folder = {
  src: 'src/', // 源文件目录
  dist: 'dist/' // 文件处理目录
};

const distFiles = folder.dist + '**'; // 目标路径下的所有文件

const Config = {
  connect: {
    root: 'dist',
    livereload: true,
    port: 1234,
    host
  },
  src: folder.src,
  dist: folder.dist,
  distFiles: distFiles,
  html: {
    src: folder.src + 'pages/**/*.html',
    dist: folder.dist + 'pages/'
  },
  css: {
    src: folder.src + 'css/**/*.styl',
    avoid: '!' + folder.src + 'css/stylus/*',
    dist: folder.dist + 'css/'
  },
  js: {
    src: folder.src + 'js/**/*.js',
    dist: folder.dist + 'js/'
  },
  images: {
    src: folder.src + 'images/**/*',
    dist: folder.dist + 'images/'
  },
  libs: {
    src: folder.src + 'libs/**/*',
    dist: folder.dist + 'libs/'
  },
  entryJS: {
    src: folder.src + 'js/**/*.entry.js',
    avoid: '!' + folder.src + 'js/**/*.entry.js'
  },
  blockJS: {
    src: folder.src + 'js/**/*.block.js',
    avoid: '!' + folder.src + 'js/**/*.block.js'
  }
};

module.exports = Config;
