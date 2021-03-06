# Check i18n files
[![npm](https://img.shields.io/npm/v/%40reibo%2Fcheck-i18n-files.svg?style=flat-square)](https://www.npmjs.com/package/%40reibo%2Fcheck-i18n-files)
![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)
[![npm](https://img.shields.io/npm/dt/%40reibo%2Fcheck-i18n-files.svg?style=flat-square)](https://www.npmjs.com/package/%40reibo%2Fcheck-i18n-files)


[![CircleCI](https://img.shields.io/circleci/project/github/reibo/check-i18n-files.svg)](https://circleci.com/gh/reibo/check-i18n-files)
[![CircleCI](https://img.shields.io/codecov/c/github/reibo/check-i18n-files.svg)](https://codecov.io/gh/reibo/check-i18n-files)


[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Do you have a directory full of i18n files, and sometimes you are missing some translations.
But you don't see it?

Than this tool can help you to search which ones are missing.

It go through all files, and at the end it gives an overview which one is ok and which translations are missing.

# Install
Get it from npm 
```
npm i -D @reibo/check-i18n-files
```
## Analyze your json files
This will generate a report in the command line
```
check-i18n-files -d Directory 
```
## Write to a csv file

This will write the values to a csv file
```
check-i18n-files -d Directory -c
```
The name of the generated file is i18n

## Read and save to json files
This will read a csv file and save them to the according values
The name of the file to read is i18n.
```
check-i18n-files -d Directory -r
```

## arguments
Arguments that can be passed
 
| Argument           | What it does                                       |
| ------------------ |----------------------------------------------------|
|-d or --dir         | The directory containing the translation json files|
|-c or --csv         | Create a csv out of the translated files           |
|-w or --write       | Read the csv and write to json files               |
|-s or --seperator   | Seperator for the csv files, by default ','        |