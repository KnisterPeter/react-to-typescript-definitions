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

  /**
   * EOL character. This would be changed to whatever is liked to
   * terminate lines. Defaults to '\r\n'
   * 
   * @type {string}
   * @memberOf Options
   */
  eol?: string;

  /**
   * babylon plugins. Allow users to set additional plugins.
   *
   * @type {string[]}
   * @memberOf Options
   */
  babylonPlugins?: string[];
}

export function cli(options: any): void {
  const processInput = (code: string) => {
    const result = generateFromSource(
      options.topLevelModule ? null : options.moduleName,
      code,
      {},
      options.reactImport
    );
    process.stdout.write(result);
  };
  if (options.file) {
    fs.readFile(options.file, (err, data) => {
      if (err) {
        throw err;
      }
      processInput(data.toString());
    });
  } else {
    getStdin().then(processInput);
  }
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
  const additionalBabylonPlugins = Array.isArray(options.babylonPlugins) ? options.babylonPlugins : [];
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
      'functionSent',
      ...additionalBabylonPlugins
    ]
  });
  if (!options.source) {
    options.source = code;
  }
  return generateFromAst(moduleName, ast, options, reactImport);
}

export function generateFromAst(moduleName: string|null, ast: any, options: IOptions = {},
    reactImport = 'react'): string {
  // tslint:disable-next-line:deprecation
  if (options.generator) {
    return generateTypings(moduleName, ast, options);
  }
  return createTypings(moduleName, ast, options, reactImport);
}
