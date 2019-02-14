const mergeDeepWith2 = (firstObject, secondObject) => {
    const merged = firstObject;
    // Get the keys
    const secondKeys = Object.keys(secondObject);
    secondKeys.forEach(key => {
        const exist = firstObject[key];
        const value = secondObject[key];
        if (exist) {
            merged[key] = mergeDeepWith2(merged[key], value);
        } else {
            merged[key] = value;
        }
        console.groupEnd();
    });

    return merged;
};

export const mergeDeep = (...objects: Array<any>) => {
    const merged = objects.shift();

    // TODO for each object
    return objects.reduce((result, next) => mergeDeepWith2(result, next), merged);

};


export const mergeKeyString = (original: any, key: string, value: any) => {
    const subKeys = key.split('.');
    const newObject = subKeys.reduceRight((obj, next, i) => ({[next]: i < subKeys.length - 1 ? obj : value}), {});
    const merged = mergeDeep(original, newObject);
    return merged;
};