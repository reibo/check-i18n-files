import * as fs from "fs";
import {TranslateKey, Value} from "./translate.model";

export function analyze(path: string) {
    if (!path) {
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

    const files = fs.readdirSync(path);

    files.forEach(readFile);

    console.debug(`analyze done ...`);
    return {i18n: i18nFiles, translateValues};

}