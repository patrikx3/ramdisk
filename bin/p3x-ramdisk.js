#!/usr/bin/env node
if (!require('fs').existsSync(`${__dirname}/../node_modules`)) {
    require('child_process').execSync(`cd ${__dirname}/..; yarn install`, {
        stdio: 'inherit'
    });
}

const commander = require('commander');
const utils = require('corifeus-utils');
const pkg = require('../package.json');
const mz = require('mz');
const start = async() => {
// command
// <command> required
// [command] optional
// [command ...] variable options
    commander
        .version(pkg.version)
        .usage('[command]')
        .action((command, options) => {
            console.error(`unknown command: ${command}`)
        }) 
    ;

    require('../src/command/install')
    require('../src/command/start')
    require('../src/command/load')
    require('../src/command/watch')
    require('../src/command/save')
    require('../src/command/stop')
    require('../src/command/link')
    require('../src/command/status')


    commander.parse(process.argv);

    if (!process.argv.slice(2).length) {
        commander.outputHelp();
    }

}

start();