#!/usr/bin/env node

const fs = require('fs');
const Lib = require('../index');

const main = async() => {
  const lib = new Lib();
  let snippets = await lib.csonToJson();
  snippets = await JSON.parse(snippets);
  lib.writeVimSnippet(snippets);
}

main();
