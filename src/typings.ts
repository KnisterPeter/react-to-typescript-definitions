import * as astqts from 'astq';
const ASTQ: typeof astqts.ASTQ = astqts as any;
import * as dom from 'dts-dom';
import { InstanceOfResolver } from './index';

export function createTypings(moduleName: string|null, ast: any,
    instanceOfResolver: InstanceOfResolver | undefined): string {
  const astq = new ASTQ();
  const reactComponentName = getReactComponentName(astq, ast);
  const propTypesName = getPropTypesName(astq, ast);
  const importedTypes = getInstanceOfPropTypes(astq, ast, propTypesName);
  const importStatements = getImportStatements(astq, ast, importedTypes, instanceOfResolver);
  const componentNames = getComponentNamesByPropTypeAssignment(astq, ast);

  const m = dom.create.module(moduleName || 'moduleName');
  if (hasReactClass(astq, ast, reactComponentName)) {
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
  componentNames.forEach(componentName => {
    const interf = dom.create.interface(`${componentName}Props`);
    interf.flags = dom.DeclarationFlags.Export;
    m.members.push(interf);

    const propTypes = getPropTypesFromAssignment(astq, ast, componentName);
    createPropTypeTypings(interf, astq, propTypes, propTypesName, importStatements);
  });

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

function createPropTypeTypings(interf: dom.InterfaceDeclaration, astq: astqts.ASTQ, propTypes: any,
    propTypesName: string|undefined, importStatements: ImportStatement[]): void {
  const res = astq.query(propTypes, `
    // ObjectProperty
  `);
  res.forEach(propertyAst => {
    const typeDecl = getType(astq, propertyAst, propTypesName, importStatements);
    const property = dom.create.property(propertyAst.key.name, typeDecl.type,
      typeDecl.optional ? dom.DeclarationFlags.Optional : 0);
    if (propertyAst.leadingComments && propertyAst.leadingComments[0].type === 'CommentBlock') {
      const trimLines = (): (line: string) => boolean => {
        let characterFound = false;
        return (line: string) => (characterFound = Boolean(line)) && Boolean(line);
      };
      property.jsDocComment = (propertyAst.leadingComments[0].value as string)
            .split('\n')
            .map(line => line.trim())
            .map(line => line.replace(/^\*\*?/, ''))
            .map(line => line.trim())
            .filter(trimLines())
            .reverse()
            .filter(trimLines())
            .reverse()
            .join('\n');
    }
    interf.members.push(property);
  });
}

function propTypeQueryExpression(propTypesName: string|undefined): string {
  return `
    '${propTypesName}' == 'undefined'
    ?
      /:object MemberExpression[
        /:property Identifier[@name == 'PropTypes']
      ]
    :
      /:object Identifier[@name == '${propTypesName}']
  `;
}

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
        (${propTypeQueryExpression(propTypesName)})
        &&
          /:property Identifier[@name == 'instanceOf']
      ]
    ]
    /:arguments *
  `);
  return res.map(identifer => identifer.name);
}

interface ImportStatement {
      name: string|undefined;
      local: string;
      path: string;
}
function getImportStatements(astq: astqts.ASTQ, ast: any, typeNames: string[],
    instanceOfResolver: InstanceOfResolver | undefined): ImportStatement[] {
  return typeNames.map(name => {
    const res = astq.query(ast, `
      // ImportDeclaration[
        /:specifiers * /:local Identifier[@name == '${name}']
      ]
    `);
    if (res.length === 0) {
      return undefined as any;
    }
    return {
      name: res[0].specifiers[0].imported ?
        res[0].specifiers[0].imported.name :
        undefined,
      local: name,
      path: res[0].source.value
    };
  })
  .map((importStatement: ImportStatement) => {
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

function getComponentNamesByPropTypeAssignment(astq: astqts.ASTQ, ast: any): string[] {
  const res = astq.query(ast, `
    //AssignmentExpression
      /:left MemberExpression[
        /:object Identifier &&
        /:property Identifier[@name == 'propTypes']
      ]
  `);
  if (res.length > 0) {
    return res.map(match => match.object.name);
  }
  return [];
}

function getPropTypesFromAssignment(astq: astqts.ASTQ, ast: any, componentName: string): any|undefined {
  const res = astq.query(ast, `
    //AssignmentExpression[
      /:left MemberExpression[
        /:object Identifier[@name == '${componentName}'] &&
        /:property Identifier[@name == 'propTypes']
      ]
    ] /:right *
  `);
  if (res.length > 0) {
    return res[0];
  }
  return undefined;
}

interface TypeDeclaration {
  type: any;
  optional: boolean;
}
function getType(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined,
    _importStatements: ImportStatement[]): TypeDeclaration {
  let type = getAny(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }
  type = getArray(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }
  type = getBool(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }
  type = getFunc(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }
  type = getNumber(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }
  type = getObject(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }
  type = getString(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }
  type = getNode(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }
  type = getElement(astq, propertyAst, propTypesName);
  if (type) {
    return type;
  }

  return {
    type: 'any',
    optional: true
  };
}

function isRequired(astq: astqts.ASTQ, propertyAst: any): [boolean, any] {
  const required = astq.query(propertyAst, `
    /:value MemberExpression /:property Identifier[@name == 'isRequired']
  `);
  if (required.length > 0) {
    return [true, propertyAst.value.object];
  }
  return [false, propertyAst.value];
}

function getSimpleType(astq: astqts.ASTQ, propertyAst: any,
    propTypesName: string|undefined, name: string, typeCreator: () => any): TypeDeclaration|undefined {
  const [required, typeAst] = isRequired(astq, propertyAst);
  const res = astq.query(typeAst, `
    MemberExpression[
      (${propTypeQueryExpression(propTypesName)})
      &&
        /:property Identifier[@name == '${name}']
    ]
  `);
  if (res.length > 0) {
    return {
      type: typeCreator(),
      optional: !required
    };
  }
  return undefined;
}

function getAny(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'any', () => 'any');
}

function getArray(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'array', () => dom.create.array('any'));
}

function getBool(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'bool', () => 'boolean');
}

function getFunc(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'func',
    () => dom.create.functionType([
      dom.create.parameter('args', dom.create.array('any'), dom.ParameterFlags.Rest)], 'any'));
}

function getNumber(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'number', () => 'number');
}

function getObject(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'object',
    () => dom.create.namedTypeReference('Object'));
}

function getString(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'string', () => 'string');
}

function getNode(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'node',
    () => dom.create.namedTypeReference('React.ReactNode'));
}

function getElement(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration|undefined {
  return getSimpleType(astq, propertyAst, propTypesName, 'element',
    () => dom.create.namedTypeReference('React.ReactElement<any>'));
}
