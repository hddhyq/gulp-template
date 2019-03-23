# gulp template
一个简单的gulp模板，用来写一下简单的移动端静态页面


## 安装
```bash
# 如果之前安装过3.0版本 需卸载
npm rm --global gulp

# 安装gulp4.0
npm install gulp-cli -g
npm install gulp -D

# 然后安装 也可以 yarn install 速度更快一些哦
npm install

# 开发环境
npm run dev

# 生产环境
npm run build
``` 

## 目录分析
``` bash
├── build    # gulp 构造文件
|  ├── gulpfile.build.js
|  ├── gulpfile.config.js
|  └── utils.js
├── src      # 源码文件夹
|  ├── css
|  |   └── stylus # stylus配置文件，此文件夹不会通过gulp
|  ├── images
|  ├── js # js文件，会通过babel打包
|  |  ├── *.entry.js # 用于browserify文件
|  |  ├── *.block.js # 通过entry中require('*.block.js'), 此文件不会存在在dist目录
|  |  └── *.js # 正常js文件
|  ├── libs
|  |  └── common # 相关库文件 文件夹内文件会生成 *.vendor.js 用于整合库文件， 减少http请求。
|  └── pages
├── static # 静态文件，包括一些常用的库
├── .babelrc # babel配置文件
├── .gitignore
├── .postcssrc.js # postcss 配置文件
├── gulpfile.js
├── package.json
└── README.md 
```

## 配置分析

### css文件
css文件会通过，`postcss`和`stylus`打包，对应`stylus`文件会生成css文件，postcss文件的配置文件在外部`.postcssrc.js`配置。

### js文件
js文件会通过babel转译。libs文件夹存放引入的js库文件，如jq等，对应文件夹会生成对应文件夹名的`*.vendor.js`。

js文件夹的`*.entry.js`用于browserify，方便引入相关的npm模块包，供浏览器使用。对应的`*.block.js`，不会在js文件中生成，主要针对多个js文件在`*.entry.js`的合并。

### 配置信息
相关配置文件的解析看`build/gulpfile.build.js`。
