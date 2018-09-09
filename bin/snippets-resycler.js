#!/usr/bin/env node
'use strict';

const fs = require('fs');
const Lib = require('../index');
const Opt = require('./opt');


const main = async() => {
  const lib = new Lib();
  let snippets = await lib.csonToJson();
  snippets = await JSON.parse(snippets);
  lib.writeVimSnippet(snippets, Opt.isOverwrite);
}

main();
