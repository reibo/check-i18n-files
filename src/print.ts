import {TranslateKey} from "./translate.model";

export function printValues(i18n: Array<string>, translateValues: Array<TranslateKey>) {
    console.debug('Info about the translations');
    let errors = 0;
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
            errors = errors +fault.length;
        console.log(fault.length ? '\x1b[31m' : '', line.map((word = '', idx) => {
            const spaceLength = totalLineWidth[idx] - word.length;
            if (spaceLength > 0) {
                return `${word}${' '.repeat(spaceLength)}`
            }
            return word;
        }).join(' | '))
    });
    console.log('...');
    if (errors) {
        console.error('    !!!! Not all', translateValues.length,'keys , are translated: errors', errors);
    } else {
        console.info('All keys (', translateValues.length, ') are translated!')
    }
}