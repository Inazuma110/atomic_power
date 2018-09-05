const rls = require('readline-sync');
const cson = require('cson');
const exec = require('child_process').exec;
const fs = require('fs');

const writeFile = (path, data) => {
  fs.appendFileSync(path, data, (err) => {
    if(err) throw error;
  });
}

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
  console.log(jsonSnippets);
  console.log('Please enter extension. ex) cpp');
  console.log("If you don't know extends, please check https://github.com/atom/autocomplete-plus/wiki/Autocomplete-Providers");

  for (let lang in jsonSnippets) {
    const extension = rls.question(`What is extension of ${lang}?: `);
    for(let name in jsonSnippets[lang]){
      for(let elem in jsonSnippets[lang][name]){
        const fileName = `./${extension}.snip`;
        writeFile(fileName, `snippet	${name}` + "\n");
        writeFile(fileName, `abbr	${jsonSnippets[lang][name]['prefix']}` + "\n");
        writeFile(fileName, `	${jsonSnippets[lang][name]['body']}` + "\n");
        // console.log(jsonSnippets[lang][name][elem]);
      }
    }
  }
}

// const parseBody = () => {

// }

(async() => {
  await csonToJson();
})();
