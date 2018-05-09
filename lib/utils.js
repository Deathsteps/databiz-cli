var fs = require('fs')
var path = require('path')
var merge = require('deepmerge')

exports.modifyPackageJSON = function (projectPath, config) {
  var filePath = path.join(projectPath, 'package.json')
  var content = fs.readFileSync(filePath, 'utf-8')
  if (typeof content !== 'string') {
    console.error('Error: package.json is not found')
  } else {
    try {
      var packageJSON = JSON.parse(content)
      packageJSON = merge(packageJSON, config)
      fs.writeFileSync(filePath, JSON.stringify(packageJSON, null, 2))
    } catch (e) {
      console.log('Error: package.json is broken')
    }
  }
}

exports.modifyWebpackConfig = function (projectPath, modifyFn, type = 'dev') {
  var configPath = path.join(projectPath, `config/webpack.config.${type}.js`)
  var content = fs.readFileSync(configPath, 'utf-8')
  if (typeof content !== 'string') {
    console.error(`Error: webpack.config.${type}.js is not found`)
  } else {
    fs.writeFileSync(configPath, modifyFn(content))
  }
}

exports.modifyFile = function (projectPath, filename, modifyFn) {
  var filepath = path.join(projectPath, filename)
  var filecontent = fs.readFileSync(filepath, 'utf-8')
  if (typeof filecontent !== 'string') {
    console.error(`Error: ${filename} is not found`)
  } else {
    fs.writeFileSync(filepath, modifyFn(filecontent))
  }
}

exports.capitalize = function capitalize (str) {
  str = str.toLowerCase()
  return str.charAt(0).toUpperCase() + str.substring(1)
}

exports.generateCode = function (templateFile, data) {
  var codeStr = fs.readFileSync(templateFile, 'utf-8')
  if (typeof codeStr !== 'string') {
    console.error(`Error: ${templateFile} is not found`)
    return ''
  } else {
    return codeStr.replace(/\[\[(\w+)\]\]/g, function (_, w, i) {
      return data[w]
    })
  }
}

exports.readSchema = function (cwd, schemaPath, filename) {
  var schemaStr = fs.readFileSync(path.join(cwd, schemaPath, filename), 'utf-8')
  return JSON.parse(schemaStr)
}
