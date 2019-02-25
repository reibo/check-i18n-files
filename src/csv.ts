import {TranslateKey} from "./translate.model";
import * as fs from "fs";
import {mergeKeyString} from "./merge";

const maxGoThrough = 1000;

export function splitLine(line: string) {
    const result = [];
    let nextComma = line.indexOf(',');
    let prevComma = 0;
    let nextQuote = line.indexOf('"', nextComma);
    let prevIsQuote = false;
    let nextIndex = nextComma;
    let i = 0;
    while (i < maxGoThrough && (nextComma > 0)) {
        if (!prevIsQuote && (nextQuote < 0 || nextComma <= nextQuote)) {
            const r = line.substring(prevComma, nextIndex);
            result.push(r.trim().replace(/"/g, ''));
            prevComma = nextIndex + 1;
            nextComma = line.indexOf(',', prevComma + 1);
            nextIndex = nextComma;
        } else {
            prevIsQuote = !prevIsQuote;
            nextIndex = nextQuote + 1;
            nextComma = line.indexOf(',', nextQuote + 1);
            nextQuote = line.indexOf('"', nextQuote + 1);
        }
        i = i + 1;
    }
    result.push(line.substring(prevComma).replace(/"/g, ''));
    if (i === maxGoThrough) {
        console.warn('ERROR');
        // console.warn('\t', line)
        //console.warn('\t', result.join(';'));
    }
    return result;
}

export function toCsv(path: string, i18n: Array<string>, translateValues: Array<TranslateKey>, seperator: string = ',') {

    console.info('create csv file');
    const filePath = `${path}/i18n.csv`;
    const file = fs.createWriteStream(filePath);

    file.write(['key', ...i18n.map(v => v)].join(seperator));
    file.write('\n');
    translateValues.forEach(value => {
        file.write([value.key, ...i18n.map(i => {
            const val = value.values.find(v => v.i18n === i);
            return val ? `"${val.value}"` : '""';
        })].join(seperator));
        file.write('\n');
    });
    file.end();

    console.info('done creating csv file', filePath);
}

const assignValue = (value: string = '') => value.replace(/\"/g, '');

export function readCsv(path: string, seperator: string = ',') {
    const filePath = `${path}/i18n.csv`;
    console.info('read', path, 'csv file');
    const file = fs.readFileSync(filePath, 'utf8');

    const lines = file.split(/\r\n|\r|\n/);

    const i18n = lines.shift().split(seperator)//.sort((l1, l2) => l1 < l2 ? -1 : 1);
    i18n.shift();

    const fileText = i18n.map(() => ({}));
    lines.sort((l1, l2) => l1 < l2 ? -1 : 1).forEach(l => {
        if (l && l.length) {
            const line = splitLine(l);
            const key = line[0];
            i18n.forEach((f, idx) => mergeKeyString(fileText[idx], key, assignValue(line[idx + 1])));
        }
    });
    i18n.forEach((i, idx) => {
        fs.writeFileSync(`${path}/${i}.json`, JSON.stringify(fileText[idx], null, 2));
    });


    console.info(`done write csv file with ${i18n.length} keys ... `);
}