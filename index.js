const rls = require('readline-sync');
const cson = require('cson');
const exec = require('child_process').exec;
const fs = require('fs');

const HOME = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
let ATOM_SNIPPET_DIR = `${HOME}/.atom`;
let VIM_SNIPPET_DIR = `${HOME}/.config/nvim/snippets`;

const appendFile = (path, data) => {
  fs.appendFile(path, data, (err) => {
    if(err) throw error;
  });
}

const csonToJson = (callback) => {
  exec(`node_modules/cson/bin/cson2json ${ATOM_SNIPPET_DIR}/snippets.cson > snippet.json`, (err, stdout, stderr) => {
    if (err) { console.log(err); }
    else console.log('Cson snippet trans json.');

    let jsonSnippets;
    try {
      jsonSnippets = JSON.parse(fs.readFileSync('./snippet.json',  'utf-8'));
    } catch (e) {
      throw new Error('Error! check your cson file.')
    }
    callback(jsonSnippets);
  });
}

const writeVimSnippet = (jsonSnippets) => {
  console.log('Please enter extension. ex) cpp');
  console.log("If you don't know extension,");
  console.log("please check https://github.com/atom/autocomplete-plus/wiki/Autocomplete-Providers");

  for (let lang in jsonSnippets) {
    const extension = rls.question(`What is extension of ${lang}?: `);
    for(let name in jsonSnippets[lang]){
      let fileName = `${VIM_SNIPPET_DIR}/${extension}.snip`;
      let body;
      try {
        body = parseBody(jsonSnippets[lang][name]['body']);
      } catch (e) {
        console.log("Cannot find " + jsonSnippets[lang][name]['prefix'] + "'s body.");
        console.log("this is skipeed.");
        continue;
      }
      appendFile(fileName, `snippet	${name}` + "\n");
      appendFile(fileName, `abbr	${jsonSnippets[lang][name]['prefix']}` + "\n");
      appendFile(fileName, "\t" + body + "\n\n");
    }
  }
}

const parseBody = (body) => {
  let indent = '(  )+?';
  indent = new RegExp(indent, 'g');
  body = body.replace(indent, '\t');
  body = body.replace(/\n/g, '\n\t');
  body = body.replace(/(\$)(\d)/g, '$1{$2}')

  let newest = '1';
  while (true) {
    let isFirst = true;
    let search = '(\\$)(\\{)' + newest + '(:)(.+?)(\\})';
    let searchReg = new RegExp(search);
    let matchIndex = body.match(searchReg);
    if(matchIndex == null) break;
    let firstIndex;
    while (true) {
      let index = body.match(searchReg);
      if(index == null) break;
      // first $? has to be ${num:keyword} format.
      // so append '@' to save first elem's index.
      if(isFirst){
        isFirst = false;
        firstIndex = index;
        body = body.replace(searchReg, '$1$2@' + newest + '$3$4$5');
      }
      else body = body.replace(searchReg, '$1' + newest);
    }
    // appended '@' delete.
    body = body.slice(0, firstIndex['index']+2) + body.slice(firstIndex['index']+3);
    newest = (Number(newest)+1) + '';
  }
  return body;
}


(() => {
  const NEW_VIM_SNIPPET_DIR = rls.question(`Your vim snippet directory(${VIM_SNIPPET_DIR}) :`);
  if(NEW_VIM_SNIPPET_DIR != '') VIM_SNIPPET_DIR = NEW_VIM_SNIPPET_DIR;
  const NEW_ATOM_SNIPPET_DIR = rls.question(`Your Atom snippet directory(${ATOM_SNIPPET_DIR}) :`);
  if(NEW_VIM_SNIPPET_DIR != '') ATOM_SNIPPET_DIR = NEW_ATOM_SNIPPET_DIR;

  csonToJson(writeVimSnippet);
})();

