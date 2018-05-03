'use strict'

var path = require('path')
var shell = require('shelljs')

var utils = require('./utils')

/**
 * 1. Install default type checker: flow
 *  npm install --save flow-bin
 *  Add "flow": "flow" to the scripts section of your package.json.
 *  Run npm run flow init to create a .flowconfig file in the root directory.
 * 2. Install redux, react-redux, redux-saga, react-router-dom, react-router-redux, redux-devtools-extension
 *  npm i --save redux react-redux redux-saga react-router-dom react-router-redux@next redux-devtools-extension
 * 3. Install other libraries
 *  npm i --save babel-polyfill
 */
function basicSetup (templatesPath, projectPath) {
  var srcPath = path.join(projectPath, 'src')
  // copy templates to target directory
  shell.cp('-rf', path.join(templatesPath, 'common'), srcPath)
  shell.cp('-rf', path.join(templatesPath, 'components'), srcPath)
  shell.cp('-rf', path.join(templatesPath, 'models'), srcPath)
  shell.cp('-rf', path.join(templatesPath, 'views'), srcPath)
  shell.cp('-f', path.join(templatesPath, '*.js'), srcPath)
  console.log('Files created.')
  // switch to project directory
  shell.cd(projectPath)
  // install flow
  shell.exec('npm i --save flow-bin')
  utils.modifyPackageJSON(projectPath, { 'scripts': { 'flow': 'flow' } })
  shell.exec('npm run flow init')
  console.log('Flow installed.')
  // install dependencies
  shell.exec('npm i --save redux react-redux redux-saga react-router-dom react-router-redux@next redux-devtools-extension babel-polyfill')
  console.log('Dependencies installed.')
}

/**
 * 1. npm install less less-loader --save
 * 2. modify webpack.config
 *  /\.css$/ => /\.(css|less)$/
 *  use less-loader
 * 3. make flow not show error message
 *  add flow/CSSModule.js.flow
 *  modify .flowconfig
 */
function useLessCSS (templatesPath, projectPath) {
  // switch to project directory
  shell.cd(projectPath)
  // install less
  shell.exec('npm i --save less less-loader')
  console.log('Less installed')
  // modify webpack config
  var reg = /flexbox: 'no-2009',(\s*)}\),(\s*)],(\s*)},(\s*)},/m
  var lessLoaderContent = '{ loader: require.resolve(\'less-loader\') },'
  var modify = function (content) {
    var matches = content.match(reg)
    content = content.replace(reg, matches[0] + matches[4] + lessLoaderContent)
    content = content.replace('/\\.css$/', '/\\.(css|less)$/')
    return content
  }
  utils.modifyWebpackConfig(projectPath, modify, 'dev')
  utils.modifyWebpackConfig(projectPath, modify, 'prod')
  console.log('Less config is added to webpack configs.')
  // config flow
  shell.cp('-rf', path.join(templatesPath, 'flow'), projectPath)
  shell.cp('-f', path.join(templatesPath, '.flowconfig'), projectPath)
}

// Optional step: install antd
function useAntd (projectPath) {

}

module.exports = function (projectName = '', options) {
  // var commandPath = __dirname
  // var templatesPath = path.join(commandPath, 'templates')
  var excutePath = process.cwd()
  var projectPath = path.resolve(excutePath, projectName)
  // basicSetup(templatesPath, projectPath)
  if (options.less) {
    useLessCSS(projectPath)
  }
  if (options.antd) {
    useAntd(projectPath)
  }
  // exit
  console.log('Done.')
  shell.exit(1)
}
