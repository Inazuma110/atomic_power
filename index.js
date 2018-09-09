#!/usr/bin/env node
'use strict';

const rls = require('readline-sync');
const cson = require('cson');
const exec = require('child_process').execSync;
const fs = require('fs');
const CSON = require('cson');

const HOME = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
let ATOM_SNIPPET_DIR = `${HOME}/.atom/`;
let VIM_SNIPPET_DIR = `${HOME}/.config/nvim/snippets/`;

class Lib {
  constructor() {
    const NEW_VIM_SNIPPET_DIR = rls.question(`Your vim path/to/snippet-directory(${VIM_SNIPPET_DIR}) :`);
    if(NEW_VIM_SNIPPET_DIR != '')
      VIM_SNIPPET_DIR = NEW_VIM_SNIPPET_DIR;
    const NEW_ATOM_SNIPPET_DIR = rls.question(`Your Atom path/to/snippet-directory(${ATOM_SNIPPET_DIR}) :`);
    if(NEW_ATOM_SNIPPET_DIR != '')
      ATOM_SNIPPET_DIR = NEW_ATOM_SNIPPET_DIR;
    if(VIM_SNIPPET_DIR.slice(-1) != '/') VIM_SNIPPET_DIR += '/';
    if(ATOM_SNIPPET_DIR.slice(-1) != '/') ATOM_SNIPPET_DIR += '/';
  }

  appendFile(path, data) {
    fs.appendFile(path, data, (err) => {
      if(err) throw err;
    });
  }

  writeFile(path, data){
    fs.writeFile(path, data, (err) => {
      if(err) throw err;
    });
  }

  async csonToJson() {
    let jsonStr;
    try {
      jsonStr = await CSON.parseCSONFile(`${ATOM_SNIPPET_DIR}snippets.cson`);
      jsonStr = await CSON.createJSONString(jsonStr);
    } catch (e) {
      console.log(e);
    }
    return jsonStr;
  }


  async writeVimSnippet(jsonSnippets, isOverwrite) {
    console.log('Please enter extension. ex) cpp');
    console.log("If you don't know extension,");
    console.log("please check https://github.com/atom/autocomplete-plus/wiki/Autocomplete-Providers");

    for (let lang in jsonSnippets) {
      const extension = rls.question(`What is extension of ${lang}?: `);
      let fileName = `${VIM_SNIPPET_DIR}${extension}.snip`;
      if(isOverwrite) await this.writeFile(fileName, '');
      let indentInfo;
      while (true)
      {
        indentInfo = await rls.question('This snippet indent(If you use 2 spaces, pleas enter 2.\nIf you use tab char, please enter tab.): ');
        if(Number.isInteger(Number(indentInfo)) || indentInfo == 'tab') break;
        else console.log('This is neither integer nor tab. Please enter agein.');
      }
      for(let name in jsonSnippets[lang]){
        let body;
        try { body = await this.parseBody(jsonSnippets[lang][name]['body'], indentInfo); }
        catch (e)
        {
          if(e instanceof TypeError)
          {
            console.log("Cannot find " + jsonSnippets[lang][name]['prefix'] + "'s body.");
            console.log("This is skipeed.");
            continue;
          }
          else throw e;
        }
        await this.appendFile(fileName, `snippet\t${name}` + "\n");
        await this.appendFile(fileName, `abbr\t${jsonSnippets[lang][name]['prefix']}` + "\n");
        await this.appendFile(fileName, "\t" + body + "\n\n");
      }
    }
  }

  parseBody(body, indentInfo) {
    let indent;
    if(indentInfo == 'tab') indent = "\t";
    else
    {
      indent = '';
      for (let i = 0; i < Number(indentInfo); i++) indent += ' ';
      indent = `(${indent})+?`;
      indent = new RegExp(indent, 'g');
      body = body.replace(indent, '\t');
      body = body.replace(/\n/g, '\n\t');
    }

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
}

module.exports = Lib;
