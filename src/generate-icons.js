import { transform } from '@svgr/core';
import {
    boldSvgrTransformOptions,
    fileReadDefaultOptions,
    linearSvgrTransformOptions,
    svgrOptions,
} from '../constants/defaults.js';
import { READ_FROM_BOLD, READ_FROM_LINEAR } from '../constants/paths.js';
import { getFiles, getIconDataFromPath } from '../utils/helper.js';
import { iconData } from './generate-icon-data.js';
import fs from 'fs';
import { log } from 'console';

const linearComponentSuffix = 'Outlined';
const boldComponentSuffix = 'Solid';

const linearFiles = getFiles(READ_FROM_LINEAR);
const boldFiles = getFiles(READ_FROM_BOLD);

const generateVariantSpecificComponent = async (files, basePath, categoryName, componentName, variant) => {
    const isLinear = variant === 'linear';
    const file = files.find((path) => {
        const { basePath, category } = getIconDataFromPath(path);
        return basePath === basePath && category === categoryName;
    });

    if (!file) {
        const component = `const ${componentName}${
            isLinear ? linearComponentSuffix : boldComponentSuffix
        } = () => null`;
        return component;
    }

    const svgCode = fs.readFileSync(file, fileReadDefaultOptions);

    const component = await transform(svgCode, isLinear ? linearSvgrTransformOptions : boldSvgrTransformOptions, {
        componentName: `${componentName}${isLinear ? linearComponentSuffix : boldComponentSuffix}`,
    });
    return component;
};

const generateComponent = async (ComponentName, LinearComponent, BoldComponent) => {
    const componentTemplate = `
        import type { IconProps } from "../types.d.ts";
        export const ${ComponentName} = (props:IconProps) =>{
            return props.variant === "outlined" ? <${ComponentName}${linearComponentSuffix} {...props} /> : <${ComponentName}${boldComponentSuffix} {...props} />;
        };

        ${LinearComponent}
        ${BoldComponent}
  `;
    const jsxComponentCode = await transform(componentTemplate, {
        plugins: ['@svgr/plugin-prettier'],
    });
    return jsxComponentCode;
};

export const icons = await iconData?.map(async ({ basePath, componentName, category: categoryName }, index) => {
    const linearComponent = await generateVariantSpecificComponent(
        linearFiles,
        basePath,
        categoryName,
        componentName,
        'linear'
    );
    const boldComponent = await generateVariantSpecificComponent(
        boldFiles,
        basePath,
        categoryName,
        componentName,
        'bold'
    );
    const component = await generateComponent(componentName, linearComponent, boldComponent);

    return {
        componentName,
        component: await component,
    };
});
