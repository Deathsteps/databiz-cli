#!/usr/bin/env node

'use strict'

var program = require('commander')

program
  .version('0.1.0')
  .option('-l, --less', 'Use less as css preprocessor')
  .option('-a, --antd', 'Use antd components')

var setup = require('../lib/setup')
program
  .command('setup [projectName]')
  .description('Setup proejct')
  .action(function (projectName) {
    setup(projectName, program)
  })

var create = require('../lib/create')
program
  .command('create [modelName]')
  .description('Create CRUD actions')
  .action(function (modelName) {
    create(modelName)
  })

program
  .parse(process.argv)
