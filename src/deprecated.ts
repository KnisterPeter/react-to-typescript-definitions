import * as astqts from 'astq';
const ASTQ: typeof astqts.ASTQ = astqts as any;
import { IOptions, InstanceOfResolver } from './index';
import { Generator } from './generator';
import { parsePropTypes } from './analyzer';

export enum ExportType {
  default,
  named
}

export interface IProp {
  type: string;
  optional: boolean;
  importType?: string;
  importPath?: string;
  documentation?: string;
}

export interface IPropTypes {
  [name: string]: IProp;
}

export function generateTypings(moduleName: string|null, ast: any, options: IOptions): string {
  const parsingResult = parseAst(ast, options.instanceOfResolver);
  return deprecatedGenerator(options.generator as Generator, moduleName, parsingResult);
}

function deprecatedGenerator(generator: Generator, moduleName: string|null,
    {exportType, classname, propTypes}: IParsingResult): string {
  const componentName = classname || 'Anonymous';
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
    generator.props(componentName, propTypes);
    generator.nl();
    generator.exportDeclaration(exportType, () => {
      generator.class(componentName, !!propTypes);
    });
  };

  if (moduleName === null) {
    generateTypings();
  } else {
    generator.declareModule(moduleName, generateTypings);
  }
  return generator.toString();
}

/**
 * @internal
 */
export interface IParsingResult {
  exportType: ExportType;
  classname: string|undefined;
  functionname: string|undefined;
  propTypes: IPropTypes;
}

function parseAst(ast: any, instanceOfResolver?: InstanceOfResolver): IParsingResult {
  let exportType: ExportType|undefined;
  let functionname: string|undefined;
  let propTypes: IPropTypes|undefined;

  let classname = getClassName(ast);
  if (classname) {
    propTypes = getEs7StyleClassPropTypes(ast, classname, instanceOfResolver);
    exportType = getClassExportType(ast, classname);
  }
  if (!propTypes) {
    const componentName = getComponentNameByPropTypeAssignment(ast);
    if (componentName) {
      const astq = new ASTQ();
      const exportTypeNodes = astq.query(ast, `
        //ExportNamedDeclaration // VariableDeclarator[
          /:id Identifier[@name=='${componentName}'] &&
          /:init ArrowFunctionExpression // JSXElement
        ],
        //ExportNamedDeclaration // FunctionDeclaration[/:id Identifier[@name == '${componentName}']] // JSXElement,
        //ExportDefaultDeclaration // AssignmentExpression[/:left Identifier[@name == '${componentName}']]
          // ArrowFunctionExpression // JSXElement,
        //ExportDefaultDeclaration // FunctionDeclaration[/:id Identifier[@name == '${componentName}']] // JSXElement
      `);
      if (exportTypeNodes.length > 0) {
        functionname = componentName;
        exportType = ExportType.named;
      }
      propTypes = getPropTypesFromAssignment(ast, componentName, instanceOfResolver);
    }
    if (!exportType) {
      const astq = new ASTQ();
      const commonJsExports = astq.query(ast, `
        // AssignmentExpression[
          /:left MemberExpression[
            /:object Identifier[@name == 'exports'] &&
            /:property Identifier[@name == 'default']
          ] &&
          /:right Identifier[@name == '${componentName}']
        ]
      `);
      if (commonJsExports.length > 0) {
        classname = componentName;
        exportType = ExportType.default;
      }
    }
  }

  if (exportType === undefined) {
    throw new Error('No exported component found');
  }
  return {
    exportType,
    classname,
    functionname,
    propTypes: propTypes || {}
  };
}

function getClassName(ast: any): string|undefined {
  const astq = new ASTQ();
  const classDeclarationNodes = astq.query(ast, `
    //ClassDeclaration[
        /:id Identifier[@name]
    ]
  `);
  if (classDeclarationNodes.length > 0) {
    return classDeclarationNodes[0].id.name;
  }
  return undefined;
}

function getEs7StyleClassPropTypes(ast: any, classname: string,
    instanceOfResolver?: InstanceOfResolver): IPropTypes|undefined {
  const astq = new ASTQ();
  const propTypesNodes = astq.query(ast, `
    //ClassDeclaration[/:id Identifier[@name == '${classname}']]
      //ClassProperty[/:key Identifier[@name == 'propTypes']]
  `);
  if (propTypesNodes.length > 0) {
    return parsePropTypes(propTypesNodes[0].value, instanceOfResolver);
  }
  return undefined;
}

function getClassExportType(ast: any, classname: string): ExportType|undefined {
  const astq = new ASTQ();
  const exportTypeNodes = astq.query(ast, `
    //ExportNamedDeclaration [
      /ClassDeclaration [ /:id Identifier[@name=='${classname}'] ]
    ],
    //ExportDefaultDeclaration [
      /ClassDeclaration [ /:id Identifier[@name=='${classname}'] ]
    ]
  `);
  if (exportTypeNodes.length > 0) {
    return exportTypeNodes[0].type === 'ExportDefaultDeclaration' ? ExportType.default : ExportType.named;
  }
  return undefined;
}

function getComponentNameByPropTypeAssignment(ast: any): string|undefined {
  const astq = new ASTQ();
  const componentNames = astq.query(ast, `
    //AssignmentExpression
      /:left MemberExpression[
        /:object Identifier &&
        /:property Identifier[@name == 'propTypes']
      ]
  `);
  if (componentNames.length > 0) {
    return componentNames[0].object.name;
  }
  return undefined;
}

function getPropTypesFromAssignment(ast: any, componentName: string,
    instanceOfResolver?: InstanceOfResolver): IPropTypes|undefined {
  const astq = new ASTQ();
  const propTypesNodes = astq.query(ast, `
    //AssignmentExpression[
      /:left MemberExpression[
        /:object Identifier[@name == '${componentName}'] &&
        /:property Identifier[@name == 'propTypes']
      ]
    ] /:right *
  `);
  if (propTypesNodes.length > 0) {
    return parsePropTypes(propTypesNodes[0], instanceOfResolver);
  }
  return undefined;
}
