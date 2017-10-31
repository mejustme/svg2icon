/**
 * make svg to iconfont with config in .svg2iconrc, also provide all icon view demo.html。
 * 通过简单的配置，将svg文件变成字体，并提供所有icon可视化展现页面
 */
var gulp = require('gulp')
var iconfont = require('gulp-iconfont')
var consolidate = require('gulp-consolidate')
var rename = require('gulp-rename')
var async = require('async')
var ejs = require('ejs')
var fs = require('fs')
var path = require('path')
var log = require('fancy-log')
var opn = require('opn')
var defaults = require('defaults')
var argv = require('./command')

var config = {}
if (fs.existsSync(path.resolve('.svg2iconrc.js'))) {
  config = require(path.resolve('.svg2iconrc.js'))
}
config = defaults(config, {
  name: 'app-icon',
  svgPath: 'icon/svg',
  outPath: 'icon',
  auto: true
})
// command has default value
// priority command > .svg2iconrc > default
var fontName = argv.name === 'app-icon' ? config.name : argv.name
var svgPath = argv.svgPath === 'icon/svg' ? config.svgPath : argv.svgPath
var outPath = argv.outPath === 'icon' ? config.outPath : argv.outPath
var openDemo = argv.auto === undefined ? config.auto : argv.auto

// generate icon
function icon (callback) {
  var iconStream = gulp.src([`${svgPath}/*.svg`])
    .pipe(iconfont({
      fontName: fontName,
      // prependUnicode: true,
      // startUnicode: 0xE001,
      formats: ['svg', 'ttf', 'eot', 'woff'],
      normalize: true,
      centerHorizontally: true,
      fontHeight: 1024, // must need for perfect icon
      log: function () {} // for disable third part log
    }))
  async.parallel([
    function handleGlyphs () {
      iconStream.on('glyphs', function (glyphs, options) {
        glyphs.forEach(function (glyph, idx, arr) {
          arr[idx].codePoint = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
        })
        gulp.src(path.join(__dirname, './template/iconTemplate.ejs'))
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: fontName,
            fontPath: '../fonts/',
            cssClass: fontName
          }))
          .pipe(rename('icons.css'))
          .pipe(gulp.dest(path.resolve(outPath, './css')))
          .on('finish', function () {
            log('svg2icon: Css Created')
            callback()
          })
      })
    },
    function handleFonts () {
      iconStream.pipe(gulp.dest(path.resolve(outPath, './fonts')))
        .on('finish', function () {
          log('svg2icon: Font Created')
        })
    }
  ])
}

// generate demo
function demo () {
  Promise.all([
    readFile(path.resolve(outPath, './css/icons.css')),
    readFile(path.join(__dirname, './template/demoTemplate.html'))
  ]).then(function (values) {
    var data = {
      total: 0,
      arr: [],
      fontName: fontName
    }
    // window \r\n and linux \n
    var regexpStr = `\\.(${fontName}-.+):before[^"]+"\\\\(.+)"`
    values[0].replace(new RegExp(regexpStr, 'g'), function ($0, $1, $2) {
      var obj = {}
      obj.key = $1
      obj.value = $2
      data.arr.push(obj)
      data.total++
    })
    if (!fs.existsSync(path.resolve(outPath, './demo'))) {
      fs.mkdirSync(path.resolve(outPath, './demo'))
    }
    fs.writeFileSync(path.resolve(outPath, './demo/demo.html'), ejs.render(values[1], data), 'utf8')
    log('svg2icon: Demo Created')
    if (openDemo !== false) {
      opn(path.resolve(outPath, './demo/demo.html'), {wait: false})
    }
  }).catch(function (err) {
    log.error(err)
  })
}

function readFile (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, 'utf8', function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = {
  icon,
  demo
}
