import {printLogo} from "./logo";
import {analyze} from "./analyse";
import {printValues} from "./print";
import {toCsv} from "./csv";

[
    ['debug', '\x1b[37m'],
    ['warn', '\x1b[35m'],
    ['error', '\x1b[31m'],
    ['log', '\x1b[32m'],
    ['info', '\x1b[24m']
].forEach(function (pair) {
    const method = pair[0], color = '\x1b[36m' + pair[1];
    console[method] = console[method].bind(console, color);
});


console.log('Analyze is started, by');
printLogo();
const values = analyze(process.argv[2]);
printValues(values.i18n, values.translateValues);
toCsv(values.i18n, values.translateValues);