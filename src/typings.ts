import * as astqts from 'astq';
const ASTQ: typeof astqts.ASTQ = astqts as any;
import * as dom from 'dts-dom';
import { InstanceOfResolver } from './index';
import * as types from './types';

export function createTypings(moduleName: string|null, ast: any,
    instanceOfResolver: InstanceOfResolver | undefined): string {
  const astq = new ASTQ();
  const reactComponentName = getReactComponentName(astq, ast);
  const propTypesName = getPropTypesName(astq, ast);
  const importedTypes = getInstanceOfPropTypes(astq, ast, propTypesName);
  const importStatements = getImportStatements(astq, ast, importedTypes, instanceOfResolver);
  const componentNames = getUniqueNames([
    ...getComponentNamesByPropTypeAssignment(astq, ast),
    ...getComponentNamesByStaticPropTypeAttribute(astq, ast),
    ...getComponentNamesByJsxInBody(astq, ast)
  ]);

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
    const exportType = getComponentExportType(astq, ast, componentName);
    const propTypes = getPropTypesFromAssignment(astq, ast, componentName) ||
      getPropTypesFromStaticAttribute(astq, ast, componentName);
    if (exportType) {
      const classComponent = isClassComponent(astq, ast, componentName, reactComponentName);

      const interf = dom.create.interface(`${componentName}Props`);
      interf.flags = dom.DeclarationFlags.Export;
      if (propTypes) {
        createPropTypeTypings(interf, astq, propTypes, propTypesName);
      }
      if (propTypes || classComponent) {
        m.members.push(interf);
      }

      if (classComponent) {
        const classDecl = dom.create.class(componentName);
        classDecl.baseType = dom.create.interface(`React.Component<${interf.name}, any>`);
        classDecl.flags = exportType;
        m.members.push(classDecl);
      } else {
        const funcDelc = dom.create.function(componentName, propTypes ? [dom.create.parameter('props', interf)] : [],
          dom.create.namedTypeReference('JSX.Element'));
        funcDelc.flags = exportType;
        m.members.push(funcDelc);
      }
    }
  });

  if (moduleName === null) {
    return m.members
      .map(member => dom.emit(member, dom.ContextFlags.None))
      .join('');
  } else {
    return dom.emit(m, dom.ContextFlags.Module);
  }
};

function createPropTypeTypings(interf: dom.InterfaceDeclaration, astq: astqts.ASTQ, propTypes: any,
    propTypesName: string|undefined): void {
  const res = astq.query(propTypes, `
    / ObjectProperty
  `);
  res.forEach(propertyAst => {
    const typeDecl = types.get(astq, propertyAst.value, propTypesName);
    const property = dom.create.property(propertyAst.key.name || propertyAst.key.value, typeDecl.type,
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

function getUniqueNames(input: string[]): string[] {
  return Object.keys(input.reduce((all: any, name: string) => {
      all[name] = true;
      return all;
    }, {}));
}

export function propTypeQueryExpression(propTypesName: string|undefined): string {
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

function hasReactClass(astq: astqts.ASTQ, ast: any, reactComponentName: string|undefined): boolean {
  const res = astq.query(ast, `
      // ClassDeclaration[
        '${reactComponentName}' == 'undefined'
        ?
          /:superClass MemberExpression[
            /:object Identifier[@name == 'React'] &&
            /:property Identifier[@name == 'Component']
          ]
        :
          /:superClass Identifier[@name == '${reactComponentName}']
      ]
    ,
      // VariableDeclaration
      / VariableDeclarator[
        /:init CallExpression[
          '${reactComponentName}' == 'undefined'
          ?
            /:arguments MemberExpression[
              /:object Identifier[@name == 'React'] &&
              /:property Identifier[@name == 'Component']
            ]
          :
            /:arguments Identifier[@name == '${reactComponentName}']
        ]
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
    return {
      name: res.length > 0 && res[0].specifiers[0].imported ?
        res[0].specifiers[0].imported.name :
        undefined,
      local: name,
      path: res.length > 0 ? res[0].source.value : undefined
    };
  })
  .map(importStatement => {
    if (importStatement && instanceOfResolver) {
      const resolvedPath = importStatement.name ?
        instanceOfResolver(importStatement.name) :
        instanceOfResolver(importStatement.local);
      if (resolvedPath) {
        importStatement.path = resolvedPath;
      }
    }
    return importStatement;
  })
  .filter(importStatement => Boolean(importStatement.path));
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

function getComponentNamesByStaticPropTypeAttribute(astq: astqts.ASTQ, ast: any): string[] {
  const res = astq.query(ast, `
    //ClassDeclaration[
      /:body * //ClassProperty /:key Identifier[@name == 'propTypes']
    ]
  `);
  if (res.length > 0) {
    return res.map(match => match.id.name);
  }
  return [];
}

function getComponentNamesByJsxInBody(astq: astqts.ASTQ, ast: any): string[] {
  const res = astq.query(ast, `
    // ClassDeclaration[
      /:body * //JSXElement
    ],
    // FunctionDeclaration[
      /:body * //JSXElement
    ],
    // VariableDeclarator[
      /:init ArrowFunctionExpression
      // JSXElement
    ]
  `);
  if (res.length > 0) {
    return res.map(match => match.id.name);
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

function getPropTypesFromStaticAttribute(astq: astqts.ASTQ, ast: any, componentName: string): any|undefined {
  const res = astq.query(ast, `
    //ClassDeclaration[
      /:id Identifier[@name == '${componentName}']
    ]
    /:body *
    //ClassProperty[
      /:key Identifier[@name == 'propTypes']
    ]
    /:value*
  `);
  if (res.length > 0) {
    return res[0];
  }
  return undefined;
}

function getComponentExportType(astq: astqts.ASTQ, ast: any, componentName: string): dom.DeclarationFlags|undefined {
  let res = astq.query(ast, `
      // ExportDefaultDeclaration[
          // ClassDeclaration
          /:id Identifier[@name == '${componentName}']
        ||
          // FunctionDeclaration
          /:id Identifier[@name == '${componentName}']
        ||
          // VariableDeclaration
          / VariableDeclarator
          /:id Identifier[@name == '${componentName}']
      ]
    ,
      // AssignmentExpression[
          /:left MemberExpression[
              /:object Identifier[@name == 'exports']
            &&
              /:property Identifier[@name == 'default']
          ]
        &&
          /:right Identifier[@name == '${componentName}']
      ]
  `);
  if (res.length > 0) {
    return dom.DeclarationFlags.ExportDefault;
  }
  res = astq.query(ast, `
    // ExportNamedDeclaration[
        // ClassDeclaration
        /:id Identifier[@name == '${componentName}']
      ||
        // FunctionDeclaration
        /:id Identifier[@name == '${componentName}']
      ||
        // VariableDeclaration
        / VariableDeclarator
        /:id Identifier[@name == '${componentName}']
    ]
  `);
  if (res.length > 0) {
    return dom.DeclarationFlags.Export;
  }
  return undefined;
}

function isClassComponent(astq: astqts.ASTQ, ast: any, componentName: string,
    reactComponentName: string|undefined): boolean {
  const res = astq.query(ast, `
      // ClassDeclaration
      /:id Identifier[@name == '${componentName}']
    ,
      // VariableDeclaration
      / VariableDeclarator[
          /:id Identifier[@name == '${componentName}']
        &&
          /:init CallExpression[
            '${reactComponentName}' == 'undefined'
            ?
              /:arguments MemberExpression[
                /:object Identifier[@name == 'React'] &&
                /:property Identifier[@name == 'Component']
              ]
            :
              /:arguments Identifier[@name == '${reactComponentName}']
          ]
      ]
  `);
  if (res.length > 0) {
    return true;
  }
  return false;
}
