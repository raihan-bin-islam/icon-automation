function updateOccurrencesWithNumbersInWords(array, key) {
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
      item[key] = `${propertyValue}${numberInWords}`;
    }
  }

  return array;
}

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

// Example usage
const arrayOfObjects = [
  { id: 1, category: 'A' },
  { id: 2, category: 'B' },
  { id: 3, category: 'A' },
  { id: 4, category: 'C' },
  { id: 5, category: 'B' },
  { id: 6, category: 'B' },
  { id: 7, category: 'B' },
  { id: 8, category: 'B' },
  { id: 9, category: 'B' },
];

const keyToUpdate = 'category';

const updatedArray = updateOccurrencesWithNumbersInWords(arrayOfObjects, keyToUpdate);

console.log('Updated Array:', updatedArray);
