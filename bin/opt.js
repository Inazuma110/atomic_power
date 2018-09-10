#!/usr/bin/env node
'use strict';

const program = require('commander');
const packageInfo = require('../package.json');

program
  .version(packageInfo.version, '-v, --version')
  .option('-o, --overwrite', 'overwrite snippets')
  .parse(process.argv)


exports.isOverwrite = program.overwrite;
