import * as babylon from 'babylon';
import * as fs from 'fs';
import * as getStdin from 'get-stdin';

import { generateTypings } from './deprecated';
import { Generator } from './generator';
import { createTypings } from './typings';

export interface InstanceOfResolver {
  (name: string): string|undefined;
}

// the IOptions is for backward compatibility
export type IOptions  = Options;
export interface Options {

  /**
   * Resolves type names to import paths.
   *
   * @return Path to given name if resolveable, undefined otherwise
   */
  instanceOfResolver?: InstanceOfResolver;

  /**
   * The Generator generating .d.ts code with.
   *
   * This option is deprecated with 0.13 and is not supported anymore.
   * any new feature will not work with the deprecated Generator interface.
   * @deprecated
   */
  generator?: Generator;

  /**
   * Could be given if the generator is started with an AST.
   *
   * This is helpful to create better messages in case of errors/warnings.
   *
   * @type {string}
   * @memberOf Options
   */
  source?: string;

  /**
   * Could be given to show filename in error/warning messages.
   *
   * @type {string}
   * @memberOf Options
   */
  filename?: string;
}

export function cli(options: any): void {
  getStdin().then(stdinCode => {
    if (options.topLevelModule) {
      process.stdout.write(generateFromSource(null, stdinCode, {}, options.reactImport || 'react'));
    } else if (options.moduleName) {
      process.stdout.write(generateFromSource(options.moduleName, stdinCode, {}, options.reactImport || 'react'));
    }
  });
}

export function generateFromFile(moduleName: string|null, path: string, options: IOptions = {},
    reactImport = 'react'): string {
  if (!options.filename) {
    options.filename = path;
  }
  return generateFromSource(moduleName, fs.readFileSync(path).toString(), options, reactImport);
}

export function generateFromSource(moduleName: string|null, code: string, options: IOptions = {},
    reactImport = 'react'): string {
  const ast = babylon.parse(code, {
    sourceType: 'module',
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowSuperOutsideMethod: true,
    plugins: [
      'jsx',
      'flow',
      'asyncFunctions',
      'classConstructorCall',
      'doExpressions',
      'trailingFunctionCommas',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'exponentiationOperator',
      'asyncGenerators',
      'functionBind',
      'functionSent'
    ]
  });
  if (!options.source) {
    options.source = code;
  }
  return generateFromAst(moduleName, ast, options, reactImport);
}

export function generateFromAst(moduleName: string|null, ast: any, options: IOptions = {},
    reactImport = 'react'): string {
  if (options.generator) {
    return generateTypings(moduleName, ast, options);
  }
  return createTypings(moduleName, ast, options, reactImport);
}
