## svg2icon [![npm](https://img.shields.io/badge/npm-v1.1.0-blue.svg)](https://www.npmjs.com/package/svg2icon)
### use iconfont has never been so simple

### Why use it
- not rely on a third party to generate font and copy link or download again and again
- simply manage your iconfont svg in multiple develop git branch, no longer worry about conflict or your partner cover lost your icon
- provide demo.html for view all already existing icon
- faster and more simple to generate font

### How it work
![图片](https://pt-starimg.didistatic.com/static/starimg/img/1505625862063ZHeJtR2sAGHOKgP1ZaQ.png)

### Install
```
npm install svg2icon --save-dev
```

### Usage
configure the `priority`: command > .svg2iconrc.js > default

#### example 1 with command param
``` shell
svg2icon -n app-icon -i ./icon/svg -o ./icon/ -a true
```
#### example 2  with file `.svg2iconrc.js` config (`recommend`)
```js
module.exports = {
  auto: true,
  name: 'app-icon',
  svgPath: './icon/svg',
  outPath: './icon'
}
```

### more
``` shell
$ svg2icon -h

Usage: svg2icon [options]
选项：
  --name, -n     iontFont name use in calss like class="app-icon-xxx"
                                                   [字符串] [默认值: "app-icon"]
  --svgPath, -i  input svg path, read from {svgPath}/*.svg
                                                   [字符串] [默认值: "icon/svg"]
  --outPath, -o  output for font、css、demo path       [字符串] [默认值: "icon"]
  --auto, -a     auto open demo.html in browser, when run generate it
                                                           [布尔] [默认值: true]
  -h, --help     显示帮助信息                                             [布尔]
  -v, --version  显示版本号                                               [布尔]

示例：
  svg2icon -n app-icon -i ./icon/svg -o ./icon/ -a true
  svg2icon : just simple command with a .svg2iconrc.js config file
  more detail : https://www.npmjs.com/package/svg2icon

```