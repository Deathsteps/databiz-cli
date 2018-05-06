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

var generate = require('../lib/generate')
program
  .command('generate')
  .description('Generate code')
  .action(function () {
    generate()
  })

program
  .parse(process.argv)
