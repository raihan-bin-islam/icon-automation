export const SeparateComponentTemplate = ({ componentName, jsx }, { tpl }) => {
  return tpl`
  const ${componentName} = (props:IconProps) => (
    ${jsx ? jsx : null}
  );`;
};

export const jsxOnlyTemplate = ({ jsx }, { tpl }) => {
  return tpl` ${jsx} `;
};

export const namedConditionalExportTemplate = (variables, { tpl }, jsxOnly, customInterFace) => {
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
export const namedConditionalExportTemplateLinear = (variables, { tpl }, jsxOnly, customInterFace) => {
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
