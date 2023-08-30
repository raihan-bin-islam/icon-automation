import fs from 'fs';
import path from 'path';

const singleDigits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const convertToWords = (number) => {
    const digit = Number(number);

    if (digit >= 1 && digit <= 9) {
        return singleDigits[digit - 1];
    } else {
        return 'Invalid input';
    }
};

const convertKebabCaseNumberToWords = (string) => {
    const words = string.split('-');
    const convertedWords = words.map((word) => {
        if (!isNaN(word)) {
            return convertToWords(word);
        } else {
            return word;
        }
    });
    return convertedWords.join('-');
};

export const kebabToPascalWithNumbers = (input) => {
    const words = input.split('-');
    const pascalWords = words.map((word) => {
        if (!isNaN(word)) {
            const convertedWord = convertToWords(word);
            return convertedWord.charAt(0).toUpperCase() + convertedWord.slice(1);
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
    });

    return pascalWords.join('');
};

export const convertFilenameToJsxComponents = (filename) => {
    const nameArray = filename.split('-');
    const capitalizedArray = nameArray.map((data) => data.charAt(0).toUpperCase() + data.slice(1));
    return capitalizedArray.join('');
};

export const getFiles = (dir, files = []) => {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        // Check if the current file/directory is a directory using fs.statSync
        if (fs.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            getFiles(name, files);
        } else {
            // If it is a file, push the full path to the files array
            files.push(name);
        }
    }
    return files;
};

export const getIconCategoryFromDir = (dir) => {
    return path.basename(dir);
};
export const getIconDataFromPath = (filePath) => {
    const { dir, name, ext } = path.parse(filePath);
    const componentName = kebabToPascalWithNumbers(name);

    const iconCategory = getIconCategoryFromDir(dir);

    return {
        id: convertKebabCaseNumberToWords(name),
        basePath: convertKebabCaseNumberToWords(name),
        name: componentName,
        componentName: componentName,
        keyword: [],
        category: iconCategory,
    };
};

function numberToWords(number) {
    const words = [
        'Zero',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
        'Twenty',
    ];

    if (number <= 20) {
        return words[number];
    }

    return 'Unknown';
}

export const updateOccurrencesWithNumbersInWords = (array, key, isKebabCase = false) => {
    const counts = {};

    for (const item of array) {
        const propertyValue = item[key];

        if (counts[propertyValue]) {
            counts[propertyValue]++;
        } else {
            counts[propertyValue] = 1;
        }

        if (counts[propertyValue] > 1) {
            const numberInWords = numberToWords(counts[propertyValue]);
            item[key] = isKebabCase
                ? `${propertyValue}-${numberInWords.toLowerCase()}`
                : `${propertyValue}${numberInWords}`;
        }
    }

    return array;
};

// export const sortByKey = (array, key) => {
//   return array.sort((a, b) => {
//     const valueA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
//     const valueB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

//     if (valueA < valueB) {
//       return -1;
//     }
//     if (valueA > valueB) {
//       return 1;
//     }
//     return 0;
//   });
// };
