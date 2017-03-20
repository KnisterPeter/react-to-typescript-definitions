import * as ASTQ from 'astq';
import * as dom from 'dts-dom';
import pascalCase = require('pascal-case');
import { InstanceOfResolver, IOptions } from './index';
import * as types from './types';

export interface AstQuery {
  ast: any;
  query(query: string): any[];
  querySubtree(subtree: any, query: string): any[];
}

export function createTypings(moduleName: string|null, programAst: any, options: IOptions): string {
  const astq = new ASTQ();
  const ast = {
    ast: programAst,
    query(query: string): any[] {
      return astq.query(programAst, query);
    },
    querySubtree(subtree: any, query: string): any[] {
      return astq.query(subtree, query);
    }
  };
  const reactComponentName = getReactComponentName(ast);
  const propTypesName = getPropTypesName(ast);
  const importedTypes = getInstanceOfPropTypes(ast, propTypesName);
  const importStatements = getImportStatements(ast, importedTypes, options.instanceOfResolver);
  const componentNames = getUniqueNames([
    ...getComponentNamesByPropTypeAssignment(ast),
    ...getComponentNamesByStaticPropTypeAttribute(ast),
    ...getComponentNamesByJsxInBody(ast)
  ]);

  const m = dom.create.module(moduleName || 'moduleName');
  if (hasReactClass(ast, reactComponentName)) {
    m.members.push(dom.create.importAll('React', 'react'));
  }
  if (importStatements.length > 0) {
    importStatements.forEach(importStatement => {
      if (importStatement.name === undefined) {
        m.members.push(dom.create.importDefault(importStatement.local, importStatement.path));
      } else {
        throw new Error('Named imports are currently unsupported');
      }
    });
  }
  componentNames.forEach(componentName => {
    const exportType = getComponentExportType(ast, componentName);
    const propTypes = getPropTypesFromAssignment(ast, componentName) ||
      getPropTypesFromStaticAttribute(ast, componentName);
    if (exportType) {
      createExportedTypes(m, ast, componentName, reactComponentName, propTypes, propTypesName, exportType, options);
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

function createExportedTypes(m: dom.ModuleDeclaration, ast: AstQuery, componentName: string,
    reactComponentName: string|undefined, propTypes: any, propTypesName: string|undefined,
      exportType: dom.DeclarationFlags, options: IOptions): void {
  const classComponent = isClassComponent(ast, componentName, reactComponentName);

  const interf = dom.create.interface(`${componentName}Props`);
  interf.flags = dom.DeclarationFlags.Export;
  if (propTypes) {
    createPropTypeTypings(interf, ast, propTypes, propTypesName, options);
    extractComplexTypes(m, interf, componentName);
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

function createPropTypeTypings(interf: dom.InterfaceDeclaration, ast: AstQuery, propTypes: any,
    propTypesName: string|undefined, options: IOptions): void {
  const res = ast.querySubtree(propTypes, `
    / ObjectProperty
  `);
  res.forEach(propertyAst => {
    const typeDecl = types.get(ast, propertyAst.value, propTypesName, options);
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

function extractComplexTypes(m: dom.ModuleDeclaration, interf: dom.InterfaceDeclaration,
    componentName: string): void {
  interf.members.forEach((member) => {
    if (member.kind === 'property' && isExtractableType(member.type)) {
      const name = `${componentName}${pascalCase(member.name)}`;
      const extractedMember = createModuleMember(name, member.type);
      if (extractedMember) {
        extractedMember.flags = dom.DeclarationFlags.Export;
        m.members.push(extractedMember);
        member.type = createTypeReference(name, member.type);
      }
    }
  });
}

type ExtractableType = dom.UnionType | dom.IntersectionType | dom.ObjectType | dom.ArrayTypeReference;

function isExtractableType(type: dom.Type): type is ExtractableType {
  if (typeof type === 'object') {
    return ['union', 'intersection', 'object', 'array'].indexOf(type.kind) > -1;
  }
  return false;
}

function createModuleMember(name: string, type: ExtractableType): dom.ModuleMember | undefined {
  switch (type.kind) {
    case 'intersection':
    case 'union':
      return dom.create.alias(name, type);
    case 'object':
      const interf = dom.create.interface(name);
      interf.members = type.members;
      return interf;
    case 'array':
      return isExtractableType(type.type) ? createModuleMember(name, type.type) : undefined;
  }
}

function createTypeReference(name: string, type: ExtractableType): dom.TypeReference {
  const namedTypeReference = dom.create.namedTypeReference(name);
  if (type.kind === 'array') {
    return dom.create.array(namedTypeReference);
  } else {
    return namedTypeReference;
  }
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

function getReactComponentName(ast: AstQuery): string|undefined {
  const res = ast.query(`
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

function getPropTypesName(ast: AstQuery): string|undefined {
  const res = ast.query(`
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

function hasReactClass(ast: AstQuery, reactComponentName: string|undefined): boolean {
  const res = ast.query(`
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

function getInstanceOfPropTypes(ast: AstQuery, propTypesName: string|undefined): string[] {
  const res = ast.query(`
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
function getImportStatements(ast: AstQuery, typeNames: string[],
    instanceOfResolver: InstanceOfResolver | undefined): ImportStatement[] {
  return typeNames.map(name => {
    const res = ast.query(`
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

function getComponentNamesByPropTypeAssignment(ast: AstQuery): string[] {
  const res = ast.query(`
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

function getComponentNamesByStaticPropTypeAttribute(ast: AstQuery): string[] {
  const res = ast.query(`
    //ClassDeclaration[
      /:body * //ClassProperty /:key Identifier[@name == 'propTypes']
    ]
  `);
  if (res.length > 0) {
    return res.map(match => match.id.name);
  }
  return [];
}

function getComponentNamesByJsxInBody(ast: AstQuery): string[] {
  const res = ast.query(`
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

function getPropTypesFromAssignment(ast: AstQuery, componentName: string): any|undefined {
  const res = ast.query(`
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

function getPropTypesFromStaticAttribute(ast: AstQuery, componentName: string): any|undefined {
  const res = ast.query(`
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

function getComponentExportType(ast: AstQuery, componentName: string): dom.DeclarationFlags|undefined {
  let res = ast.query(`
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
        ||
          /Identifier[@name == '${componentName}']
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
  res = ast.query(`
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

function isClassComponent(ast: AstQuery, componentName: string,
    reactComponentName: string|undefined): boolean {
  const res = ast.query(`
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
