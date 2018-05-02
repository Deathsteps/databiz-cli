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
