import fs from 'fs';
import {
    KEEP_EXPORT_FILE_REFERENCE_TO,
    SAVE_EXPORT_FILE_TO,
    SAVE_ICONS_TO,
    SAVE_ICON_CATEGORIES_TO,
    SAVE_ICON_DATA_TO,
} from '../constants/paths.js';
import { iconData } from './generate-icon-data.js';
import { iconCategories } from './generate-categories.js';
import { icons } from './generate-icons.js';
// Write Icon Data
fs.writeFileSync(SAVE_ICON_DATA_TO, '');
fs.appendFileSync(SAVE_ICON_DATA_TO, `import {\n`);
iconData?.map(({ componentName }) => {
    fs.appendFileSync(SAVE_ICON_DATA_TO, `${componentName},\n`);
});
fs.appendFileSync(SAVE_ICON_DATA_TO, `} from "@petraui/icons";`);
fs.appendFileSync(SAVE_ICON_DATA_TO, `\nexport const icons=[\n\t`);
iconData?.map(({ id, name, componentName, category }) =>
    fs.appendFileSync(
        SAVE_ICON_DATA_TO,
        `\n{\n\tid : "${id}",\n\tname : "${name}",\n\ticon : ${componentName},\n\tcategory: "${category}",\n\t},`
    )
);
fs.appendFileSync(SAVE_ICON_DATA_TO, `\n]`);

// File Exports
fs.writeFileSync(KEEP_EXPORT_FILE_REFERENCE_TO, '');
iconData.map(({ componentName }) =>
    fs.appendFileSync(KEEP_EXPORT_FILE_REFERENCE_TO, `export * from "./${componentName}";\n`)
);

fs.writeFileSync(SAVE_EXPORT_FILE_TO, '');
iconData.map(({ componentName }) => fs.appendFileSync(SAVE_EXPORT_FILE_TO, `export * from "./${componentName}";\n`));

// Write Icon Categories
fs.writeFileSync(SAVE_ICON_CATEGORIES_TO, '');
fs.appendFileSync(SAVE_ICON_CATEGORIES_TO, `\nexport const iconCategories=[\n\t`);
iconCategories.map((data) => fs.appendFileSync(SAVE_ICON_CATEGORIES_TO, `${JSON.stringify(data)},`));
fs.appendFileSync(SAVE_ICON_CATEGORIES_TO, `\n]`);

// Write Files
const extension = '.tsx';

icons.forEach(async (data) => {
    const iconData = await data;
    const { componentName, component } = await iconData;
    const componentFile = (await componentName) + extension;

    fs.writeFileSync(`${SAVE_ICONS_TO}${componentFile}`, component);
});
