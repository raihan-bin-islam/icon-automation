import { getFiles, getIconDataFromPath, updateOccurrencesWithNumbersInWords } from '../utils/helper.js';
import { READ_FROM_BOLD, READ_FROM_LINEAR } from '../constants/paths.js';

Array.prototype.mergeUnique = function (b) {
    var a = this;
    return [...new Set([...a, ...b].map(JSON.stringify))].map(JSON.parse);
};

Array.prototype.sortByKey = function (key) {
    var array = this;
    return array.sort((a, b) => {
        const valueA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
        const valueB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];

        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    });
};

const linearFiles = getFiles(READ_FROM_LINEAR);
const boldFiles = getFiles(READ_FROM_LINEAR);

const getIconDataFor = (files = []) => {
    return files.map((path) => getIconDataFromPath(path));
};

const linearIconData = getIconDataFor(linearFiles);
const boldIconData = getIconDataFor(boldFiles);

// There could be same icons under a different category with the same icon name
const iconDataWithPossibleDuplicates = linearIconData.mergeUnique(boldIconData).sortByKey('id');

const kyeToUpdateOne = 'componentName';
const iconDataWithUpdatedComponentKey = updateOccurrencesWithNumbersInWords(
    iconDataWithPossibleDuplicates,
    kyeToUpdateOne
);
const kyeToUpdateTwo = 'id';
export const iconData = updateOccurrencesWithNumbersInWords(iconDataWithUpdatedComponentKey, kyeToUpdateTwo, true);
