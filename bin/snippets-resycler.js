#!/usr/bin/env node

const fs = require('fs');
const Lib = require('../index');

const main = async() => {
  const lib = new Lib();
  await lib.csonToJson();
  let snippets = await fs.readFileSync('./snippet.json',  'utf-8');
  snippets = await JSON.parse(snippets);
  lib.writeVimSnippet(snippets);
}

main();
