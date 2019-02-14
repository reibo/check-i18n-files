import {TranslateKey} from "./translate.model";
import * as fs from "fs";
import {mergeKeyString} from "./merge";



export function toCsv(path: string, i18n: Array<string>, translateValues: Array<TranslateKey>, seperator: string = ',') {

    console.info('create csv file');
    const filePath = `${path}/i18n.csv`;
    const file = fs.createWriteStream(filePath);

    file.write(['key', ...i18n.map(v => v)].join(seperator));
    file.write('\n');
    translateValues.forEach(value => {
        file.write([value.key, ...i18n.map(i => {
            const val = value.values.find(v => v.i18n === i);
            return val ? `'${val.value}'` : '';
        })].join(seperator));
        file.write('\n');
    });
    file.end();

    console.info('done creating csv file', filePath);
}

const assignValue = (value: string = '') => value.replace(/\'/g, '');

export function readCsv(path: string, seperator: string = ',') {
    const filePath = `${path}/i18n.csv`;
    console.info('read', path, 'csv file');
    const file = fs.readFileSync(filePath, 'utf8');
    const lines = file.split('\n');

    const i18n = lines.shift().split(seperator);
    i18n.shift();

    const fileText = i18n.map(() => ({}));
    lines.forEach(l => {
        if (l && l.length) {
            const line = l.split(seperator);
            const key = line[0];
            i18n.forEach((f, idx) => mergeKeyString(fileText[idx], key, assignValue(line[idx + 1])));
        }
    });
    i18n.forEach((i, idx) => {
        fs.writeFileSync(`${path}/${i}.json`, JSON.stringify(fileText[idx], null, 2));
    });


    console.info(`done write csv file with ${i18n.length} keys ... `);
}