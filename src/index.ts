import * as fs from 'fs';
import * as babylon from 'babylon';
import * as getStdinTs from 'get-stdin';
const getStdin: typeof getStdinTs.getStdin = getStdinTs as any;

import { generateTypings } from './deprecated';
import { Generator } from './generator';
import { createTypings } from './typings';

export interface InstanceOfResolver {
  (name: string): string|undefined;
};

export interface IOptions {

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
}

export function cli(options: any): void {
  getStdin().then(stdinCode => {
    if (options.topLevelModule) {
      process.stdout.write(generateFromSource(null, stdinCode));
    } else if (options.moduleName) {
      process.stdout.write(generateFromSource(options.moduleName, stdinCode));
    }
  });
}

export function generateFromFile(moduleName: string|null, path: string, options?: IOptions): string {
  return generateFromSource(moduleName, fs.readFileSync(path).toString(), options);
}

export function generateFromSource(moduleName: string|null, code: string, options: IOptions = {}): string {
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
  return generateFromAst(moduleName, ast, options);
}

export function generateFromAst(moduleName: string|null, ast: any, options: IOptions = {}): string {
  if (options.generator) {
    return generateTypings(moduleName, ast, options);
  }
  return createTypings(moduleName, ast, options.instanceOfResolver);
}
