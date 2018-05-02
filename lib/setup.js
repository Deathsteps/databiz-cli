var path = require('path')
var shell = require('shelljs')

var utils = require('./utils')

// NOTE:
// 1. Install default type checker: flow
//  npm install --save flow-bin
//  Add "flow": "flow" to the scripts section of your package.json.
//  Run npm run flow init to create a .flowconfig file in the root directory.
// 2. Install redux, react-redux, redux-saga, react-router-dom, react-router-redux, redux-devtools-extension
//  npm i --save redux react-redux redux-saga react-router-dom react-router-redux@next redux-devtools-extension
// 3. Install other libraries
//  npm i --save babel-polyfill
// Optional step: install antd
// Optional step: install less

module.exports = function (projectName) {
  // TODO: deal with empty projectName
  var commandPath = __dirname
  var templatesPath = path.join(commandPath, 'templates')
  var excutePath = process.cwd()
  var projectPath = path.resolve(excutePath, projectName)
  var srcPath = path.join(projectPath, 'src')
  // copy templates to target directory
  shell.cp('-rf', path.join(templatesPath, 'common'), srcPath)
  shell.cp('-rf', path.join(templatesPath, 'components'), srcPath)
  shell.cp('-rf', path.join(templatesPath, 'models'), srcPath)
  shell.cp('-rf', path.join(templatesPath, 'views'), srcPath)
  shell.cp('-f', path.join(templatesPath, '*.js'), srcPath)
  console.log('Files are created.')
  // switch to project directory
  shell.cd(projectPath)
  // install flow
  shell.exec('npm i --save flow-bin')
  utils.modifyPackageJSON(projectPath, { 'scripts': { 'flow': 'flow' } })
  shell.exec('npm run flow init')
  console.log('Flow is installed.')
  // install dependencies
  shell.exec('npm i --save redux react-redux redux-saga react-router-dom react-router-redux@next redux-devtools-extension babel-polyfill')
  console.log('Dependencies are installed.')
  // exit
  console.log('Done.')
  shell.exit(1)
}
