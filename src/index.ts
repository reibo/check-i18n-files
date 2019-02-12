#!/usr/bin/env node
import * as program from 'commander';
import {analyze} from "./analyse";
import {printValues} from "./print";
import {toCsv} from "./csv";
import {printLogo} from "./logo";

[
    ['debug', '\x1b[37m'],
    ['warn', '\x1b[35m'],
    ['error', '\x1b[31m'],
    ['log', '\x1b[32m'],
    ['info', '\x1b[24m']
].forEach( pair  => {
    const method = pair[0], color = '\x1b[36m' + pair[1];
    console[method] = console[method].bind(console, color);
});

program.version('1.0.2')
    .option('-d --dir [type]', 'Add directory')
    .option('-c --csv', 'Export to csv')
    .parse(process.argv);

if (!program.dir) {
    console.error('directory not provided');
    throw new Error('no directory provided');
}

console.log('Analyze is started, by');
printLogo();
const values = analyze(program.dir);
printValues(values.i18n, values.translateValues);
if (program.csv)
    toCsv(program.dir, values.i18n, values.translateValues);