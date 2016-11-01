import * as astqts from 'astq';
const ASTQ: typeof astqts.ASTQ = astqts as any;
import * as dom from 'dts-dom';
import { InstanceOfResolver } from './index';

export function createTypings(moduleName: string|null, ast: any,
    instanceOfResolver: InstanceOfResolver | undefined): string {
  const astq = new ASTQ();
  const componentName = getReactComponentName(astq, ast);
  const propTypesName = getPropTypesName(astq, ast);
  const importedTypes = getInstanceOfPropTypes(astq, ast, propTypesName);
  const importStatements = getImportStatements(astq, ast, importedTypes, instanceOfResolver);

  const m = dom.create.module(moduleName || 'moduleName');
  if (hasReactClass(astq, ast, componentName)) {
    m.members.push(dom.create.importAll('React', 'react'));
  }
  if (importStatements.length > 0) {
    importStatements.forEach(importStatement => {
      if (importStatement.name == undefined) {
        m.members.push(dom.create.importDefault(importStatement.local, importStatement.path));
      } else {
        throw new Error('Named imports are currently unsupported');
      }
    });
  }

  // const res = astq.query(ast, `
  // `);
  // console.log('res', res);

  if (moduleName === null) {
    return m.members
      .map(member => dom.emit(member, dom.ContextFlags.None))
      .join('');
  } else {
    return dom.emit(m, dom.ContextFlags.Module);
  }
};

function getReactComponentName(astq: astqts.ASTQ, ast: any): string|undefined {
  const res = astq.query(ast, `
    // ImportDeclaration[
      /:source StringLiteral[@value == 'react']
    ]
    /:specifiers *[
      / Identifier[@name == 'Component']
    ]
    /:local Identifier
  `);
  if (res.length > 0) {
    return res[0].name;
  }
  return undefined;
}

function getPropTypesName(astq: astqts.ASTQ, ast: any): string|undefined {
  const res = astq.query(ast, `
    // ImportDeclaration[
      /:source StringLiteral[@value == 'react']
    ]
    /:specifiers *[
      / Identifier[@name == 'PropTypes']
    ]
    /:local Identifier
  `);
  if (res.length > 0) {
    return res[0].name;
  }
  return undefined;
}

function hasReactClass(astq: astqts.ASTQ, ast: any, componentName: string|undefined): boolean {
  const res = astq.query(ast, `
    // ClassDeclaration[
      '${componentName}' == 'undefined'
      ?
        /:superClass MemberExpression[
          /:object Identifier[@name == 'React'] &&
          /:property Identifier[@name == 'Component']
        ]
      :
        /:superClass Identifier[@name == '${componentName}']
    ]
  `);
  return res.length > 0;
}

function getInstanceOfPropTypes(astq: astqts.ASTQ, ast: any, propTypesName: string|undefined): string[] {
  const res = astq.query(ast, `
    // CallExpression[
      /:callee MemberExpression[
        (
          '${propTypesName}' == 'undefined'
          ?
            /:object MemberExpression[
              /:property Identifier[@name == 'PropTypes']
            ]
          :
            /:object Identifier[@name == '${propTypesName}']
        )
        &&
          /:property Identifier[@name == 'instanceOf']
      ]
    ]
    /:arguments *
  `);
  return res.map(identifer => identifer.name);
}

function getImportStatements(astq: astqts.ASTQ, ast: any, typeNames: string[],
    instanceOfResolver: InstanceOfResolver | undefined): any[] {
  return typeNames.map(name => {
    const res = astq.query(ast, `
      // ImportDeclaration[
        /:specifiers * /:local Identifier[@name == '${name}']
      ]
    `);
    if (res.length === 0) {
      return undefined;
    }
    return {
      name: res[0].specifiers[0].imported ?
        res[0].specifiers[0].imported.name :
        undefined,
      local: name,
      path: res[0].source.value
    };
  })
  .map(importStatement => {
    if (importStatement && instanceOfResolver) {
      const resolvedPath = importStatement.name ? instanceOfResolver(importStatement.name) : undefined;
      if (resolvedPath) {
        importStatement.path = resolvedPath;
      }
    }
    return importStatement;
  })
  .filter(importStatement => Boolean(importStatement));
}
