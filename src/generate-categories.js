import { iconData } from './generate-icon-data.js'

const countDuplicateValues = (objectsArray, key) => {
  if (!Array.isArray(objectsArray) || objectsArray.length === 0) {
    return {}
  }

  const valueCount = {}

  // Iterate through each object in the array
  for (const obj of objectsArray) {
    if (typeof obj === 'object' && obj.hasOwnProperty(key)) {
      const value = obj[key]
      valueCount[value] = (valueCount[value] || 0) + 1
    }
  }

  return valueCount
}

const categoryCount = countDuplicateValues(iconData, 'category')

export const iconCategories = Object.keys(categoryCount).map((data, index) => ({
  id: index,
  category: data.replace('-', '/').replace('-', '/').replace('-', '/'),
  count: categoryCount[data],
}))
