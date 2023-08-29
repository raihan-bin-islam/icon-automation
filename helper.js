import fs from "fs";
import path from "path";
import { transform } from "@svgr/core";

const singleDigits = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const convertToWords = (number) => {
  const digit = Number(number);

  if (digit >= 1 && digit <= 9) {
    return singleDigits[digit - 1];
  } else {
    return "Invalid input";
  }
};

const convertKebabCaseNumberToWords = (string) => {
  const words = string.split("-");
  const convertedWords = words.map((word) => {
    if (!isNaN(word)) {
      return convertToWords(word);
    } else {
      return word;
    }
  });
  return convertedWords.join("-");
};

export const kebabToPascalWithNumbers = (input) => {
  const words = input.split("-");
  const pascalWords = words.map((word) => {
    if (!isNaN(word)) {
      const convertedWord = convertToWords(word);
      return convertedWord.charAt(0).toUpperCase() + convertedWord.slice(1);
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  });

  return pascalWords.join("");
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

export const convertFilenameToJsxComponents = (filename) => {
  const nameArray = filename.split("-");
  const capitalizedArray = nameArray.map(
    (data) => data.charAt(0).toUpperCase() + data.slice(1)
  );
  return capitalizedArray.join("");
};

// ================================================= Templates Start =====================================================
export const namedConditionalExportTemplate = (
  variables,
  { tpl },
  jsxOnly,
  customInterFace
) => {
  const SolidIcon = `${variables.componentName}Solid`;
  const LinearIcon = `${variables.componentName}Linear`;
  return tpl`
import * as React from "react";
import { IconProps } from "@web/icons/type";

export const ${variables.componentName} = (props) => (
 props.variant==="solid"? <${SolidIcon} {...props} /> : <${LinearIcon} {...props} />
);

const ${SolidIcon} = (props) => {${variables.jsx});
const ${LinearIcon} = (props) => (${jsxOnly});

`;
};
export const namedConditionalExportTemplateLinear = (
  variables,
  { tpl },
  jsxOnly,
  customInterFace
) => {
  const SolidIcon = `${variables.componentName}Solid`;
  const LinearIcon = `${variables.componentName}Linear`;

  return tpl`
import * as React from "react";
import { IconProps } from "@web/icons/type";

export const ${variables.componentName} = (props) => (
 props.variant==="solid"? <${SolidIcon} {...props} /> : <${LinearIcon} {...props} />
);
const ${SolidIcon} = (props) => (
  ${jsxOnly}
);
const ${LinearIcon} = (props) => (
  ${variables.jsx}
);

`;
};

export const SeparateComponentTemplate = ({ componentName, jsx }, { tpl }) => {
  return tpl`
  const ${componentName} = (props:IconProps) => (
    ${jsx}
  );`;
};

export const jsxOnlyTemplate = ({ jsx }, { tpl }) => {
  return tpl` ${jsx} `;
};

// ====================================== Templates End =====================================
export const getIconCategoryFromDir = (dir) => {
  return path.basename(dir);
};
export const getIconDataFromPath = (filePath) => {
  const { dir, name, ext } = path.parse(filePath);
  const componentName = kebabToPascalWithNumbers(name);

  const iconCategory = getIconCategoryFromDir(dir);

  return {
    id: convertKebabCaseNumberToWords(name),
    name: componentName,
    category: iconCategory,
  };
};
