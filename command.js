var argv = require('yargs')
  .option('name', {
    alias: 'n',
    demand: false,
    default: 'app-icon',
    describe: 'iontFont name use in calss like class="app-icon-xxx"',
    type: 'string'
  })
  .option('svgPath', {
    alias: 'i',
    demand: false,
    default: 'svg',
    describe: 'input svg path, read from {svgPath}/*.svg',
    type: 'string'
  })
  .option('outPath', {
    alias: 'o',
    demand: false,
    default: 'icon',
    describe: 'output for font、css、demo path',
    type: 'string'
  })
  .option('auto', {
    alias: 'a',
    demand: false,
    default: true,
    describe: 'auto open demo.html in browser, when run generate it',
    type: 'boolean'
  })
  .usage('Usage: svg2icon [options]')
  .example('svg2icon -n app-icon -i ./src/icon/svg -o ./src/icon/ -a false')
  .example('svg2icon : just simple command with a .svg2iconrc.js config file')
  .example('more detail : https://www.npmjs.com/package/svg2icon')
  .help('h')
  .alias('h', 'help')
  .version('v', '1.0.0')
  .alias('v', 'version')
  .argv

module.exports = argv
