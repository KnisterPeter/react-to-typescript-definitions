import * as fs from 'fs';
import * as babylon from 'babylon';
import * as dom from 'dts-dom';
import * as astqts from 'astq';
const ASTQ: typeof astqts.ASTQ = astqts as any;

import { Generator } from './generator';
import { generateTypings } from './generate-typigns';
import { parsePropTypes } from './analyzer';

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

export interface IASTNode {
  type: string;
  loc: Object;
  [name: string]: any;
  value?: any;
  key?: any;
  expression?: any;
  id?: any;
  body?: any;
}

export interface IProp {
  type: string;
  type2: dom.Type;
  optional: boolean;
  importType?: string;
  importPath?: string;
  documentation?: string;
}

export interface IPropTypes {
  [name: string]: IProp;
}

export function cli(options: any): void {
  const stdinCode: string[] = [];
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      stdinCode.push(chunk.toString());
    } else {
      // No stdin -> let node terminate
      process.stdin.pause();
    }
  });
  process.stdin.on('end', () => {
    if (options['top-level-module']) {
      process.stdout.write(generateFromSource(null, stdinCode.join('')));
    } else if (options['module-name']) {
      process.stdout.write(generateFromSource(options['module-name'], stdinCode.join('')));
    } else {
      console.error('Failed to specify --module-name or --top-level-module parameter');
      process.exit(1);
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
  const parsingResult = parseAst(ast, options.instanceOfResolver);
  if (options.generator) {
    return deprecatedGenerator(options.generator, moduleName, parsingResult);
  }
  return generateTypings(moduleName, parsingResult);
}

function deprecatedGenerator(generator: Generator, moduleName: string|null,
    {exportType, classname, propTypes}: IParsingResult): string {
  const generateTypings = () => {
    generator.import('* as React', 'react');
    if (propTypes) {
      Object.keys(propTypes).forEach(propName => {
        const prop = propTypes[propName];
        if (prop.importType && prop.importPath) {
          generator.import(prop.importType, prop.importPath);
        }
      });
    }
    generator.nl();
    generator.props(classname, propTypes);
    generator.nl();
    generator.exportDeclaration(exportType, () => {
      generator.class(classname, !!propTypes);
    });
  };

  if (moduleName === null) {
    generateTypings();
  } else {
    generator.declareModule(moduleName, generateTypings);
  }
  return generator.toString();
}

export enum ExportType {
  default,
  named
}

/**
 * @internal
 */
export interface IParsingResult {
  exportType: ExportType;
  classname: string;
  propTypes: IPropTypes;
}

function parseAst(ast: any, instanceOfResolver?: InstanceOfResolver): IParsingResult {
  let exportType: ExportType|undefined;
  let classname: string|undefined;
  let propTypes: IPropTypes = {};

  const astq = new ASTQ();
  const classDeclarationNodes = astq.query(ast, `
    //ClassDeclaration[
        /:id Identifier[@name]
    ]
  `);
  if (classDeclarationNodes.length > 0) {
    classname = classDeclarationNodes[0].id.name;
    // Get propTypes
    const propTypesNodes = astq.query(ast, `
      //ClassDeclaration[/:id Identifier[@name == '${classname}']]
        //ClassProperty[/:key Identifier[@name == 'propTypes']]
    `);
    if (propTypesNodes.length > 0) {
      propTypes = parsePropTypes(propTypesNodes[0].value, instanceOfResolver);
    } else {
      const propTypesNodes = astq.query(ast, `
        //AssignmentExpression[
          /:left MemberExpression[
            /:object Identifier[@name == '${classname}'] &&
            /:property Identifier[@name == 'propTypes']
          ]
        ] /:right *
      `);
      if (propTypesNodes.length > 0) {
        propTypes = parsePropTypes(propTypesNodes[0], instanceOfResolver);
      }
    }

    // Get export type
    const exportTypeNodes = astq.query(ast, `
      //ExportNamedDeclaration [
        /ClassDeclaration [ /:id Identifier[@name=='${classname}'] ]
      ],
      //ExportDefaultDeclaration [
        /ClassDeclaration [ /:id Identifier[@name=='${classname}'] ]
      ]
    `);
    if (exportTypeNodes.length > 0) {
      exportType = exportTypeNodes[0].type === 'ExportDefaultDeclaration' ? ExportType.default : ExportType.named;
    }
  }

  if (exportType === undefined) {
    throw new Error('No exported class found');
  }
  if (!classname) {
    throw new Error('Anonymous classes are not supported');
  }
  return {
    exportType,
    classname,
    propTypes
  };
}
