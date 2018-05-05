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
  shell.cp('-rf', path.join(templatesPath, 'basic/*'), srcPath)
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
  // [antd requires javascriptEnabled](https://github.com/ant-design/ant-design/issues/7927)
  var lessLoaderContent = '{ loader: require.resolve(\'less-loader\'), options: { javascriptEnabled: true } },'
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
  shell.cp('-rf', path.join(templatesPath, 'less/flow'), projectPath)
  shell.cp('-f', path.join(templatesPath, 'less/.flowconfig'), projectPath)
}

/**
 * 1. npm install --save antd babel-plugin-import
 * 2. add babel plugin in package.json
 * 3. initialize basic layouts
 *  UserLayout
 *  MainLayout
 *  Routes and flew pages
 */
function useAntd (templatesPath, projectPath) {
  var srcPath = path.join(projectPath, 'src')
  // switch to project directory
  shell.cd(projectPath)
  // install antd
  shell.exec('npm i --save antd babel-plugin-import')
  console.log('Antd installed')
  // add babel plugin
  // eslint-disable-next-line
  utils.modifyPackageJSON(projectPath, {'babel': {'plugins': [[ 'import', [{'libraryName': 'antd', 'style': true}]]]}})
  console.log('babel-plugin-import added')
  // basic framework
  shell.cp('-rf', path.join(templatesPath, 'antd/*'), srcPath)
  console.log('Basic antd layouts added')
}

module.exports = function (projectName = '', options) {
  var commandPath = __dirname
  var templatesPath = path.join(commandPath, 'templates')
  var cwd = process.cwd()
  var projectPath = path.resolve(cwd, projectName)
  basicSetup(templatesPath, projectPath)
  if (options.less) {
    useLessCSS(templatesPath, projectPath)
  }
  if (options.antd) {
    useAntd(templatesPath, projectPath)
  }
  // exit
  console.log('Done.')
  shell.exit(1)
}
