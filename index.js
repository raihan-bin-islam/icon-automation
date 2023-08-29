import { transform } from "@svgr/core";
import path from "path";
import fs from "fs";
import {
  convertFilenameToJsxComponents,
  getFiles,
  getIconDataFromPath,
  jsxOnlyTemplate,
  kebabToPascalWithNumbers,
  namedConditionalExportTemplate,
  namedConditionalExportTemplateLinear,
} from "./helper.js";
import { svgrOptions } from "./constants.js";

// OUTPUT DATA
let categories = [];
let iconData = [];
// Identifier to replace this with the actual jsx later
const replaceTag = "<></>";

const log = console.log;
const readFrom = "./petraui/";
const writeTo = "./icons/";
const fileReadDefaultOptions = {
  encoding: "utf8",
  flag: "r",
};
// Files
const exportedFiles = getFiles(writeTo);
const files = getFiles(readFrom);

files.forEach(async (file, index) => {
  const { id, name: iconName, category } = getIconDataFromPath(file);

  const componentExt = ".tsx";
  const componentFile = iconName + componentExt;

  const isFileExported =
    iconData.filter(({ name }) => {
      return name === iconName;
    }).length > 0;

  const svgCode = fs.readFileSync(file, fileReadDefaultOptions);
  // if a new category
  if (!categories.includes(category)) {
    categories = [...categories, category];
  }
  // If File has not been exported previously, meaning, if it's a new icon
  if (!isFileExported) {
    iconData = [...iconData, { id, name: iconName, category }];
    const isNotSolid = file.includes("linear");

    const jsxComponentCode = await transform(
      svgCode,
      {
        ...svgrOptions,
        template: (variables, context) =>
          isNotSolid
            ? namedConditionalExportTemplateLinear(
                variables,
                context,
                replaceTag,
                "IconProps"
              )
            : namedConditionalExportTemplate(
                variables,
                context,
                replaceTag,
                "IconProps"
              ),
      },
      {
        componentName: iconName,
      }
    );

    fs.writeFileSync(`${writeTo}${componentFile}`, jsxComponentCode);
    return;
  }

  fs.readFile(`${writeTo}${componentFile}`, "utf-8", async (err, data) => {
    const jsxOnlyCode = await transform(svgCode, {
      ...svgrOptions,
      template: jsxOnlyTemplate,
    });

    const updatedData = data
      .replace(replaceTag, jsxOnlyCode)
      ?.replace("</svg>;", "</svg>");

    fs.writeFileSync(`${writeTo}${componentFile}`, updatedData);
  });
});

const pathToIconData = `./icon-data/icon.js`;
// Icon Data Manipulation
fs.writeFileSync(pathToIconData, "");
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
fs.writeFileSync(pathToExportFile, "");
iconData.map(({ name }) =>
  fs.appendFileSync(pathToExportFile, `export * from "./${name}";\n`)
);

// Remove empty tags from jsx

exportedFiles.forEach((file) => {
  const data = fs.readFileSync(file, fileReadDefaultOptions);
  if (data.includes(replaceTag)) {
    log("yes");
    log(data);
    const updatedData = data?.replace("<></>", "null");
    fs.writeFileSync(file, updatedData);
  }
});
// fs.readdirSync(readFrom).forEach(async (file, index) => {
//   fs.readdirSync;
//   const extname = path.extname(file);
//   const filename = path.basename(file, extname);

//   const componentName = convertFilenameToJsxComponents(filename);
//   const componentExt = ".tsx";
//   const componentFile = componentName + componentExt;

//   log(file);

//   if (index === 2) {
//     const svgCode = fs.readFileSync(`${readFrom}${file}`, {
//       encoding: "utf8",
//       flag: "r",
//     });

//     const jsxOnlyCode = await transform(svgCode, {
//       ...svgrOptions,
//       template: jsxOnlyTemplate,
//     });

//     const jsxComponentCode = await transform(
//       svgCode,
//       {
//         ...svgrOptions,
//         template: (variables, context) =>
//           namedConditionalExportTemplate(variables, context, jsxOnlyCode),
//       },
//       {
//         componentName: componentName,
//       }
//     );

//     fs.writeFileSync(`${writeTo}${componentFile}`, jsxComponentCode);
//   }
// });

// import OpenAI from "openai";
// // const configuration = new Configuration({
// //   apiKey: "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",
// // });
// const openai = new OpenAI({
//   apiKey: "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",
// });

// async function runCompletion() {
//   const chatCompletion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: "Hello!" }],
//   });
//   console.log(chatCompletion.choices[0].message);
// }

// runCompletion();

// {
//     id: "home",
//     name: "Home",
//     icon: Home,
//     keywords: ["house", "residence", "dwelling", "domestic", "living"],
//     category: "Nature",
//   },
