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
var yargs = require('yargs')
var config = require('./.svg2iconrc')
var fontName = config.fontName || 'app-icon'
var svgPath = config.svgPath || 'svg'
var outPath = config.outPath || 'icon'

gulp.task('icon', function (done) {
  var iconStream = gulp.src([`${svgPath}/*.svg`])
    .pipe(iconfont({
      fontName: fontName,
      // prependUnicode: true,
      // startUnicode: 0xE001,
      formats: ['svg', 'ttf', 'eot', 'woff'],
      normalize: true,
      centerHorizontally: true,
      fontHeight: 1024 // must need for perfect icon
    }))
  async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function (glyphs, options) {
        glyphs.forEach(function (glyph, idx, arr) {
          arr[idx].codePoint = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
        })
        gulp.src(path.resolve(__dirname, './template/iconTemplate.ejs'))
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: fontName,
            fontPath: '../fonts/',
            cssClass: fontName
          }))
          .pipe(rename('icons.css'))
          .pipe(gulp.dest(path.resolve(outPath, './css')))
          .on('finish', cb)
      })
    },
    function handleFonts (cb) {
      iconStream.pipe(gulp.dest(path.resolve(outPath, './fonts')))
        .on('finish', cb)
    }
  ], done)
})

gulp.task('demo', function () {
  Promise.all([
    readFile(path.resolve(outPath, './css/icons.css')),
    readFile(path.resolve(__dirname, './template/demoTemplate.html'))
  ]).then(function (values) {
    var data = {
      total: 0,
      arr: []
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
  }).catch(function (err) {
    console.log(err)
  })
})

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
