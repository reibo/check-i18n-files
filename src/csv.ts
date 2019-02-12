import {TranslateKey} from "./translate.model";
import * as fs from "fs";

export function toCsv(path: string, i18n: Array<string>, translateValues: Array<TranslateKey>, seperator: string = ';') {

    console.info('create csv file');
    const filePath = `${path}/i18n.csv`
    const file = fs.createWriteStream(filePath, {
        // flags: 'a' // 'a' means appending (old data will be preserved)
    });

    file.write(['key', ...i18n.map(v => v)].join(seperator));
    file.write('\n');
    translateValues.forEach(value => {
        file.write([value.key, ...i18n.map(i => {
            const val = value.values.find(v => v.i18n === i);
            return val ? `"${val.value}"` : '';
        })].join(seperator));
        file.write('\n');
    });
    file.end();

    console.info('done creating csv file');
}