import * as fs from 'fs';
import {printLogo} from "./logo";

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


interface TranslateKey {
    key: string;
    values: [Value];
}

interface Value {
    i18n: string;
    value: string;
}

function printValues(i18n: Array<string>, translateValues: Array<TranslateKey>) {
    const lines: string[][] = [];
    const totalLineWidth: number[] = [3, ...i18n.map(i => i.length)];
    lines.push(['key', ...i18n.map(v => v)]);
    translateValues.forEach(value => {
        totalLineWidth[0] = totalLineWidth[0] < value.key.length ? value.key.length : totalLineWidth[0];
        lines.push([value.key, ...i18n.map((i, idx) => {
            const val = value.values.find(v => v.i18n === i);
            if (val)
                totalLineWidth[idx + 1] = totalLineWidth[idx + 1] < val.value.length ? val.value.length : totalLineWidth[0];
            return val ? val.value : undefined;
        })]);
    });
    lines.forEach((line, lineIdx) => {
        if (lineIdx === 1) {
            console.log(line.map((l, idx) => '_'.repeat(totalLineWidth[idx])).join(' | '));
        }
        const fault = line.filter(v => !v);
        console.log(fault.length ? '\x1b[31m' : '', line.map((word = '', idx) => {
            const spaceLength = totalLineWidth[idx] - word.length;
            if (spaceLength > 0) {
                return `${word}${' '.repeat(spaceLength)}`
            }
            return word;
        }).join(' | '))
    });
}

export function analyze(path: string) {
    if(!path){
        console.error('path not provided');
        return;
    }
    const translateValues: Array<TranslateKey> = [];
    const i18nFiles: Array<string> = [];

    const getKeysValues = (i18n: string, values: any, prevKey: string = '') => {
        const keys = Object.keys(values);
        keys.forEach(key => {
            const value = values[key];
            const newKey = `${prevKey}${prevKey.length ? '.' : ''}${key}`;
            if (typeof value === 'string') {
                const newValue: Value = {i18n, value};
                const keyValue = translateValues.find(t => t.key === newKey);
                if (keyValue) {
                    keyValue.values.push(newValue);
                } else {
                    translateValues.push({key: newKey, values: [newValue]});
                }
            } else
                getKeysValues(i18n, value, newKey)
        })
    };

    const readFile = (file: string) => {
        console.info('Analyze', file);
        const output = fs.readFileSync(`${path}/${file}`, 'utf8');
        const jsonObject = JSON.parse(output);
        const i18n = file.split('.')[0];
        i18nFiles.push(i18n);
        getKeysValues(i18n, jsonObject);
    };

    console.debug(`analyze directory ${path}`);

    fs.readdir(path, (err, files: string[]) => {
        if (err) {
            console.error('Error reading directory', path);
            console.error(err);
            return;
        }

        files.forEach(readFile);

        printValues(i18nFiles, translateValues);
        console.debug(`analyze done ...`)
        return;
    });
}

console.log('Analyze is started, by');
printLogo();
analyze(process.argv[2]);