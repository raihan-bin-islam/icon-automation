import { SeparateComponentTemplate } from '../utils/templates.js';

export const svgrOptions = {
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  svgProps: {
    color: '{props.color}',
    variant: '{props.variant}',
    width: '{props.size}',
    height: '{props.size}',
  },
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: { overrides: { removeViewBox: false } },
      },
      { name: 'removeAttrs', params: { attrs: '(fill|stroke|stroke-width)' } },
      'sortAttrs',
      'removeDimensions',
    ],
  },
  //   icon: true,
  exportType: 'named',
  typescript: true,
};

export const linearSvgrTransformOptions = {
  ...svgrOptions,
  svgProps: { ...svgrOptions.svgProps, stroke: 'currentColor', fill: 'none' },
  template: SeparateComponentTemplate,
};
export const boldSvgrTransformOptions = {
  ...svgrOptions,
  svgProps: { ...svgrOptions.svgProps, fill: 'currentColor', stroke: 'none' },
  template: SeparateComponentTemplate,
};

export const fileReadDefaultOptions = {
  encoding: 'utf8',
  flag: 'r',
};
