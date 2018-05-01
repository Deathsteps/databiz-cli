#!/usr/bin/env node

'use strict';

var program = require('commander');

program
  .version('0.1.0')

var setup = require('../lib/setup');
program
  .command('setup [projectName]')
  .description('setup proejct')
  .action(function (projectName) {
    setup(projectName)
  })

var create = require('../lib/create');
program
  .command('create [modelName]')
  .description('create CRUD actions')
  .action(function (modelName) {
    create(modelName)
  })

program
  .parse(process.argv);
