#!/usr/bin/env node

'use strict'

var program = require('commander')

program
  .version('0.1.0')

var setup = require('../lib/setup')
program
  .command('setup [projectName]')
  .description('Setup proejct')
  .action(function (projectName) {
    setup(projectName)
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
