const rls = require('readline-sync');
const cson = require('cson');
const exec = require('child_process').exec;

exec('node_modules/cson/bin/cson2json snippet.cson > snippet.json', (err, stdout, stderr) => {
  if (err) { console.log(err); }
  console.log(stdout);
});

