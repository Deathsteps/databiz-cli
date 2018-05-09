'use strict'

var fs = require('fs')
var path = require('path')

var format = require('prettier-eslint')
var jsf = require('json-schema-faker')
jsf.extend('faker', () => require('faker'))
jsf.option({ alwaysFakeOptionals: true })

var utils = require('./utils')
var {
  buildFlowTypes,
  buildTableColumns,
  buildFilterFieldConfig,
  buildFilterForm,
  buildEditFormItems
} = require('./schema2code')

function formatCode (source) {
  var eslintConfig = { 'extends': 'react-app' }
  const options = {
    text: source,
    eslintConfig,
    prettierOptions: {
      bracketSpacing: true
    },
    fallbackPrettierOptions: {
      singleQuote: true
    }
  }
  return format(options)
}

function generateModel (cwd, templatesPath, model, schemaPath) {
  var data = { 'Model': utils.capitalize(model), 'model': model }
  var listSchema = utils.readSchema(cwd, schemaPath, data['Model'] + 'List.json')
  var formSchema = utils.readSchema(cwd, schemaPath, data['Model'] + 'Detail.json')
  data = {
    ...data,
    ...buildFlowTypes(model, listSchema, formSchema)
  }
  // make sure directories
  var modelDir = path.join(cwd, `src/models/${data['Model']}`)
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir)
  }
  // reducers
  var templateFile = path.join(templatesPath, 'code/model/reducers.js.tmpl')
  var code = utils.generateCode(templateFile, data)
  fs.writeFileSync(path.join(modelDir, 'reducers.js'), code)
  // saga
  templateFile = path.join(templatesPath, 'code/model/saga.js.tmpl')
  code = utils.generateCode(templateFile, data)
  fs.writeFileSync(path.join(modelDir, 'saga.js'), code)
  // service
  templateFile = path.join(templatesPath, 'code/model/service.js.tmpl')
  code = utils.generateCode(templateFile, data)
  fs.writeFileSync(path.join(modelDir, 'service.js'), code)
  console.log('Model generated')
}

function generateViews (cwd, templatesPath, model, schemaPath) {
  // build data
  var data = { 'Model': utils.capitalize(model), 'model': model }
  var filterSchema = utils.readSchema(cwd, schemaPath, data['Model'] + 'Filter.json')
  var listSchema = utils.readSchema(cwd, schemaPath, data['Model'] + 'List.json')
  var formSchema = utils.readSchema(cwd, schemaPath, data['Model'] + 'Detail.json')
  data = {
    ...data,
    filterFormStr: buildFilterForm(filterSchema.properties),
    filterFieldConfigStr: buildFilterFieldConfig(filterSchema.properties),
    columnStr: buildTableColumns(listSchema.items.properties),
    fieldConfigStr: buildFilterFieldConfig(formSchema.properties),
    formItemsStr: buildEditFormItems(formSchema.properties)
  }
  // make sure directories
  var listDir = path.join(cwd, `src/views/${data['Model']}List`)
  var detailDir = path.join(cwd, `src/views/${data['Model']}`)
  if (!fs.existsSync(listDir)) {
    fs.mkdirSync(listDir)
  }
  if (!fs.existsSync(detailDir)) {
    fs.mkdirSync(detailDir)
  }
  // List.jsx
  var templateFile = path.join(templatesPath, 'code/view/List.jsx.tmpl')
  var code = utils.generateCode(templateFile, data)
  fs.writeFileSync(path.join(listDir, 'index.js'), code)
  // Filter.jsx
  templateFile = path.join(templatesPath, 'code/view/Filter.jsx.tmpl')
  code = formatCode(utils.generateCode(templateFile, data))
  fs.writeFileSync(path.join(listDir, 'Filter.jsx'), code)
  // DataTable.jsx
  templateFile = path.join(templatesPath, 'code/view/DataTable.jsx.tmpl')
  code = formatCode(utils.generateCode(templateFile, data))
  fs.writeFileSync(path.join(listDir, 'DataTable.jsx'), code)
  // Detail.jsx
  templateFile = path.join(templatesPath, 'code/view/Detail.jsx.tmpl')
  code = utils.generateCode(templateFile, data)
  fs.writeFileSync(path.join(detailDir, 'index.js'), code)
  // InfoForm.jsx
  templateFile = path.join(templatesPath, 'code/view/InfoForm.jsx.tmpl')
  code = formatCode(utils.generateCode(templateFile, data))
  fs.writeFileSync(path.join(detailDir, 'InfoForm.jsx'), code)
  console.log('Views generated')
}

function generateMockData (cwd, model, schemaPath) {
  var modelName = utils.capitalize(model)
  var listSchema = utils.readSchema(cwd, schemaPath, modelName + 'List.json')
  var formSchema = utils.readSchema(cwd, schemaPath, modelName + 'Detail.json')
  Promise.all([
    jsf.resolve(listSchema),
    jsf.resolve(formSchema)
  ]).then(function (results) {
    var mockData = {
      [`POST /api/${model}/list`]: { totalCount: 100, list: results[0] },
      [`POST /api/${model}`]: results[1],
      [`POST /api/${model}/update`]: { success: true },
      [`POST /api/${model}/delete`]: { success: true }
    }
    var mockPath = path.join(cwd, 'mock/config.js')
    var mockConfig = require(mockPath)
    mockConfig = {
      ...mockConfig,
      ...mockData
    }
    fs.writeFileSync(mockPath, 'module.exports = ' + JSON.stringify(mockConfig, null, 2))
    console.log('Mock data generated')
  })
}

var inquirer = require('inquirer')

const QUESTION = [
  {
    type: 'list',
    name: 'type',
    message: 'Which type of code do you want to generate?',
    choices: ['model', 'views', 'all']
  },
  {
    type: 'input',
    name: 'model',
    message: 'Please enter a model name?',
    default: 'product'
  },
  {
    type: 'input',
    name: 'schemaPath',
    message: 'Please enter the path to schemas?',
    default: 'schemas'
  }
]

module.exports = function (modelName) {
  var templatesPath = path.join(__dirname, 'templates')
  var cwd = process.cwd()
  inquirer.prompt(QUESTION).then(answers => {
    switch (answers.type) {
      case 'model':
        generateModel(cwd, templatesPath, answers.model, answers.schemaPath)
        break
      case 'views':
        generateViews(cwd, templatesPath, answers.model, answers.schemaPath)
        break
      case 'all':
        generateModel(cwd, templatesPath, answers.model, answers.schemaPath)
        generateViews(cwd, templatesPath, answers.model, answers.schemaPath)
        break
    }
    generateMockData(cwd, answers.model, answers.schemaPath)
  })
}
