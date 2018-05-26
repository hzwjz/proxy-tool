#!/usr/bin/env node

let server = require('../src/server');
let program = require('commander');
let path = require('path');
let customConfig;

program
  .version('0.1.0')
  .option('-c, --config [value]', 'custom config file path')
  .parse(process.argv);

if (program.config){
    try{
        customConfig = require(path.join(process.cwd(), program.config));
    }catch(err){
        console.error('config file read error:' + err.message);
        process.exit(1);
    }
}

(new server(customConfig)).start();