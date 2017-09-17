# svg2icon
## use iconfont has never been so simple

### Why use it
- not rely on a third party to generate font and copy link or download again and again
- simply manage your iconfont svg in multiple develop git branch, no longer worry about conflict or your partner cover lost your icon
- provide demo.html for view all already existing icon
- faster and more simple to generate font

### How it work
![图片](https://pt-starimg.didistatic.com/static/starimg/img/1505621845013aMlEjyeQUhTrOk5qn0I.png)

### Install
```
npm install svg2icon --save-dev
```

### Usage
configure the priority: command > .svg2iconrc.js > default

#### example with command param
``` shell
svg2icon -n app-icon -i ./icon/svg -o ./icon/ -a true
```
#### example with file `.svg2iconrc.js` config param
```js
module.exports = {
  auto: true,
  name: 'app-icon',
  svgPath: './icon/svg',
  outPath: './icon'
}
```

![图片](https://pt-starimg.didistatic.com/static/starimg/img/1505622455246WkgbadoNrOweq70k4bv.png)