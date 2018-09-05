const rls = require('readline-sync');
const cson = require('cson');
const exec = require('child_process').exec;
const fs = require('fs');


const csonToJson = () => {
  exec('node_modules/cson/bin/cson2json snippet.cson > snippet.json', (err, stdout, stderr) => {
    if (err) { console.log(err); }
    else console.log('Cson snippet trans json.');

    let jsonSnippets;
    try {
      jsonSnippets = JSON.parse(fs.readFileSync('./snippet.json',  'utf-8'));
    } catch (e) {
      throw new Error('Error! check your cson file.')
    }
    writeVimSnippet(jsonSnippets);
  });
}

const writeVimSnippet = (jsonSnippets) => {
  // console.log(jsonSnippets);
  console.log('Please enter extension. ex) cpp');
  console.log("If you don't know extends, please check https://github.com/atom/autocomplete-plus/wiki/Autocomplete-Providers");

  for (let lang in jsonSnippets) {
    const extension = rls.question(`What is extension of ${lang}?: `);
    for(let name in jsonSnippets[lang]){
      for(let elem in jsonSnippets[lang][name]){
        // console.log(jsonSnippets[lang][name][elem]);
      }
    }
  }
}

(async() => {
  await csonToJson();
})();
