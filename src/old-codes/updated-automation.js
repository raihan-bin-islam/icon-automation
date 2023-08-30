import { transform } from '@svgr/core';
import fs from 'fs';
import { SeparateComponentTemplate, getFiles, getIconDataFromPath } from './helper.js';
import { svgrOptions } from '../../constants/defaults.js';

// OUTPUT DATA
let categories = [];
let iconData = [];

const log = console.log;
const readFromLinear = './petraui/linear/';
const readFromBold = './petraui/bold/';
const readFrom = './petraui/';
const writeTo = './icons/';

// Files
const linearFiles = getFiles(readFromLinear);
const boldFiles = getFiles(readFromBold);

linearFiles.forEach(async (linearFilePath, index) => {
  const { id, name: iconName, category } = getIconDataFromPath(linearFilePath);
  const componentExt = '.tsx';
  const componentFile = iconName + componentExt;

  const boldFilePath = boldFiles.find((path) => {
    const { id: boldIconId } = getIconDataFromPath(path);
    return id === boldIconId;
  });

  const isFileExported =
    iconData.filter(({ name }) => {
      return name === iconName;
    }).length > 0;

  // if a new category
  if (!categories.includes(category)) {
    categories = [...categories, category];
  }
  // If File has not been exported previously, meaning, if it's a new icon
  if (!isFileExported) {
    iconData = [...iconData, { id, name: iconName, category }];
  }

  const linearIconSvgCode = fs.readFileSync(linearFilePath, fileReadDefaultOptions);

  const LinearIcon = await transform(
    linearIconSvgCode,
    {
      ...svgrOptions,
      svgProps: { ...svgrOptions.svgProps, stroke: 'currentColor' },
      template: SeparateComponentTemplate,
    },
    {
      componentName: `${iconName}Linear`,
    }
  );

  if (boldFilePath) {
    const boldIconSvgCode = fs.readFileSync(boldFilePath, fileReadDefaultOptions);

    const BoldIcon = await transform(
      boldIconSvgCode,
      {
        ...svgrOptions,
        svgProps: { ...svgrOptions.svgProps, fill: 'currentColor' },
        template: SeparateComponentTemplate,
      },
      {
        componentName: `${iconName}Solid`,
      }
    );

    const customTemplate = `
        import type { IconProps } from "../types.d.ts";
        export const ${iconName} = (props:IconProps) =>{
            return props.variant === "solid" ? <${iconName}Solid {...props} /> : <${iconName}Linear {...props} />;
        };

        ${LinearIcon}
        ${BoldIcon}
    `;
    const jsxComponentCode = await transform(customTemplate, {
      plugins: ['@svgr/plugin-prettier'],
    });

    fs.writeFileSync(`${writeTo}${componentFile}`, jsxComponentCode);
    return;
  }
  const customTemplate = `
        import type { IconProps } from "../types.d.ts";
        export const ${iconName} = (props:IconProps)=>{
            return props.variant === "solid"?null:<${iconName}Linear {...props} />;
        };

        ${LinearIcon};
    `;

  const jsxComponentCode = await transform(customTemplate, {
    plugins: ['@svgr/plugin-prettier'],
  });

  fs.writeFileSync(`${writeTo}${componentFile}`, jsxComponentCode);
});

const pathToIconData = `./icon-data/icon.js`;
// Icon Data Manipulation
fs.writeFileSync(pathToIconData, '');
fs.appendFileSync(pathToIconData, `import {\n`);
iconData?.map(({ id, name, category }) => {
  fs.appendFileSync(pathToIconData, `${name},\n`);
});
fs.appendFileSync(pathToIconData, `} from "@web/icons";`);
fs.appendFileSync(pathToIconData, `\nexport const icons=[\n\t`);

iconData?.map(({ id, name, category }) =>
  fs.appendFileSync(
    pathToIconData,
    `\n{\n\tid : "${id}",\n\tname : "${name}",\n\ticon : ${name},\n\tcategory: "${category}",\n\t},`
  )
);
fs.appendFileSync(pathToIconData, `\n]`);

// File Export Manipulation
const pathToExportFile = `./icon-data/exports.js`;
fs.writeFileSync(pathToExportFile, '');
iconData.map(({ name }) => fs.appendFileSync(pathToExportFile, `export * from "./${name}";\n`));

const pathToExportFileInsideIcons = `./icons/index.ts`;
fs.writeFileSync(pathToExportFileInsideIcons, '');
iconData.map(({ name }) => fs.appendFileSync(pathToExportFileInsideIcons, `export * from "./${name}";\n`));
