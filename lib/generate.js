'use strict'

function generateModel (cwd, model, schemaPath) {

}

function generateListView (cwd, model, schemaPath) {

}

function generateFormView (cwd, model, schemaPath) {

}

var inquirer = require('inquirer')

const QUESTION = [
  {
    type: 'list',
    name: 'type',
    message: 'Which type of code do you want to generate?',
    choices: ['model', 'listview', 'formview']
  },
  {
    type: 'input',
    name: 'model',
    message: 'Please enter a model name?',
    default: 'Product'
  },
  {
    type: 'input',
    name: 'schemaPath',
    message: 'Please enter the path to schemas?',
    default: 'schemas'
  }
]

module.exports = function (modelName) {
  var cwd = process.cwd()
  inquirer.prompt(QUESTION).then(answers => {
    switch (answers.type) {
      case 'model':
        generateModel(cwd, answers.model, answers.schemaPath)
        break
      case 'listview':
        generateListView(cwd, answers.model, answers.schemaPath)
        break
      case 'formview':
        generateFormView(cwd, answers.model, answers.schemaPath)
        break
    }
  })
}
