import ASTQ from 'astq';
import * as dom from 'dts-dom';
import { pascalCase } from 'pascal-case';
import { InstanceOfResolver, IOptions } from './index';
import * as types from './types';

export interface AstQuery {
  ast: any;
  query(query: string): any[];
  querySubtree(subtree: any, query: string): any[];
}

export interface ImportedPropType {
  importedName: string;
  localName: string;
}

export interface ImportedPropTypes {
  propTypesName: string | undefined;
  propTypes: ImportedPropType[];
}

export function createTypings(
  moduleName: string | null,
  programAst: any,
  options: IOptions,
  reactImport: string
): string {
  // #609: configure eol character
  dom.config.outputEol = options.eol || '\r\n';

  const astq = new ASTQ();
  const ast = {
    ast: programAst,
    query(query: string): any[] {
      return astq.query(programAst, query);
    },
    querySubtree(subtree: any, query: string): any[] {
      return astq.query(subtree, query);
    },
  };
  const reactComponentName = getReactComponentName(ast);
  const importedPropTypes: ImportedPropTypes = {
    propTypesName: getPropTypesName(ast),
    propTypes: getImportedPropTypes(ast),
  };
  const importedTypes = getInstanceOfPropTypes(ast, importedPropTypes);
  const importStatements = getImportStatements(
    ast,
    importedTypes,
    options.instanceOfResolver
  );
  const componentNames = getUniqueNames([
    ...getComponentNamesByPropTypeAssignment(ast),
    ...getComponentNamesByStaticPropTypeAttribute(ast),
    ...getComponentNamesByJsxInBody(ast),
  ]);
  const tripleSlashDirectives: dom.TripleSlashDirective[] = [];
  const m = dom.create.module(moduleName || 'moduleName');

  m.members.push(dom.create.importAll('React', reactImport));

  if (importStatements.length > 0) {
    importStatements.forEach((importStatement) => {
      if (importStatement.name === undefined) {
        m.members.push(
          dom.create.importDefault(importStatement.local, importStatement.path)
        );
      } else {
        throw new Error('Named imports are currently unsupported');
      }
    });
  }
  const alreadyDefined: string[] = [];

  componentNames.forEach((componentName) => {
    const exportType = getComponentExportType(ast, componentName);
    const propTypes = getPropTypes(ast, componentName);
    if (exportType) {
      alreadyDefined.push(componentName);
      createExportedTypes(
        m,
        ast,
        componentName,
        reactComponentName,
        propTypes,
        importedPropTypes,
        exportType,
        options
      );
    }
  });

  // top level object variables
  const componentObject = getComponentNamesByObject(ast, componentNames);

  componentObject.forEach(({ name, properties = {} }) => {
    const obj = dom.create.objectType([]);
    let hasType;

    Object.keys(properties).forEach((k) => {
      const { key, value } = properties[k];
      componentNames.forEach((componentName) => {
        // if a property matches an existing component
        // add it to the object definition
        if (value.type === 'Identifier' && value.name === componentName) {
          const exportType = getComponentExportType(ast, componentName);
          const propTypes = getPropTypes(ast, value.name);
          // if it was exported individually, it will already have been typed earlier
          if (!alreadyDefined.includes(componentName)) {
            createExportedTypes(
              m,
              ast,
              value.name,
              reactComponentName,
              propTypes,
              importedPropTypes,
              exportType,
              options
            );
          }

          if (propTypes) {
            hasType = true;
            const type1 = dom.create.namedTypeReference(value.name);
            const typeBase = dom.create.typeof(type1);
            const b = dom.create.property(key.name, typeBase);
            obj.members.push(b);
          }
        }
      });
    });
    if (hasType) {
      const exportType = getComponentExportType(ast, name);

      const objConst = dom.create.const(name, obj);
      m.members.push(objConst);

      if (exportType === dom.DeclarationFlags.ExportDefault) {
        m.members.push(dom.create.exportDefault(name));
      } else {
        objConst.flags = exportType;
      }
    }
  });

  if (moduleName === null) {
    return m.members.map((member) => dom.emit(member)).join('');
  } else {
    return dom.emit(m, { tripleSlashDirectives });
  }
}

function createExportedTypes(
  m: dom.ModuleDeclaration,
  ast: AstQuery,
  componentName: string,
  reactComponentName: string | undefined,
  propTypes: any,
  importedPropTypes: ImportedPropTypes,
  exportType: dom.DeclarationFlags | undefined,
  options: IOptions
): void {
  const classComponent = isClassComponent(
    ast,
    componentName,
    reactComponentName
  );

  const interf = dom.create.interface(`${componentName}Props`);
  interf.flags = dom.DeclarationFlags.Export;
  if (propTypes) {
    createPropTypeTypings(interf, ast, propTypes, importedPropTypes, options);
    extractComplexTypes(m, interf, componentName);
  }

  if (propTypes || classComponent) {
    m.members.push(interf);
  }

  if (classComponent) {
    if (!exportType) {
      createClassComponent(m, componentName, reactComponentName, interf);
    } else {
      createExportedClassComponent(
        m,
        componentName,
        reactComponentName,
        exportType,
        interf
      );
    }
  } else if (!exportType) {
    createFunctionalComponent(m, componentName, propTypes, interf);
  } else {
    createExportedFunctionalComponent(
      m,
      componentName,
      propTypes,
      exportType,
      interf
    );
  }
}

function createClassComponent(
  m: dom.ModuleDeclaration,
  componentName: string,
  reactComponentName: string | undefined,
  interf: dom.InterfaceDeclaration
): dom.ClassDeclaration {
  const classDecl = dom.create.class(componentName);
  classDecl.baseType = dom.create.interface(
    `React.${reactComponentName || 'Component'}<${interf.name}, any>`
  );
  classDecl.members.push(
    dom.create.method(
      'render',
      [],
      dom.create.namedTypeReference('JSX.Element')
    )
  );
  m.members.push(classDecl);
  return classDecl;
}

function createExportedClassComponent(
  m: dom.ModuleDeclaration,
  componentName: string,
  reactComponentName: string | undefined,
  exportType: dom.DeclarationFlags,
  interf: dom.InterfaceDeclaration
): void {
  const classDecl = createClassComponent(
    m,
    componentName,
    reactComponentName,
    interf
  );
  classDecl.flags = exportType;
}

function createFunctionalComponent(
  m: dom.ModuleDeclaration,
  componentName: string,
  propTypes: any,
  interf: dom.InterfaceDeclaration
): dom.ConstDeclaration {
  const typeDecl = dom.create.namedTypeReference(
    `React.FC${propTypes ? `<${interf.name}>` : ''}`
  );
  const constDecl = dom.create.const(componentName, typeDecl);
  m.members.push(constDecl);

  return constDecl;
}

function createExportedFunctionalComponent(
  m: dom.ModuleDeclaration,
  componentName: string,
  propTypes: any,
  exportType: dom.DeclarationFlags,
  interf: dom.InterfaceDeclaration
): void {
  const constDecl = createFunctionalComponent(
    m,
    componentName,
    propTypes,
    interf
  );
  if (exportType === dom.DeclarationFlags.ExportDefault) {
    m.members.push(dom.create.exportDefault(componentName));
  } else {
    constDecl.flags = exportType;
  }
}

function createPropTypeTypings(
  interf: dom.InterfaceDeclaration,
  ast: AstQuery,
  propTypes: any,
  importedPropTypes: ImportedPropTypes,
  options: IOptions
): void {
  const res = ast.querySubtree(
    propTypes,
    `
    / ObjectProperty
  `
  );
  res.forEach((propertyAst) => {
    const typeDecl = types.get(
      ast,
      propertyAst.value,
      importedPropTypes,
      options
    );
    const property = dom.create.property(
      propertyAst.key.name || propertyAst.key.value,
      typeDecl.type,
      typeDecl.optional ? dom.DeclarationFlags.Optional : 0
    );
    if (
      propertyAst.leadingComments &&
      propertyAst.leadingComments[0].type === 'CommentBlock'
    ) {
      const trimLines = (): ((line: string) => boolean) => {
        return (line: string) => Boolean(line);
      };
      property.jsDocComment = (propertyAst.leadingComments[0].value as string)
        .split('\n')
        .map((line) => line.trim())
        .map((line) => line.replace(/^\*\*?/, ''))
        .map((line) => line.trim())
        .filter(trimLines())
        .reverse()
        .filter(trimLines())
        .reverse()
        .join('\n');
    }
    interf.members.push(property);
  });
}

function extractComplexTypes(
  m: dom.ModuleDeclaration,
  interf: dom.InterfaceDeclaration,
  componentName: string
): void {
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

type ExtractableType =
  | dom.UnionType
  | dom.IntersectionType
  | dom.ObjectType
  | dom.ArrayTypeReference;

function isExtractableType(type: dom.Type): type is ExtractableType {
  if (typeof type === 'object') {
    return ['union', 'intersection', 'object', 'array'].indexOf(type.kind) > -1;
  }
  return false;
}

function createModuleMember(
  name: string,
  type: ExtractableType
): dom.ModuleMember | undefined {
  switch (type.kind) {
    case 'intersection':
    case 'union':
      return dom.create.alias(name, type);
    case 'object':
      const interf = dom.create.interface(name);
      interf.members = type.members;
      return interf;
    case 'array':
      return isExtractableType(type.type)
        ? createModuleMember(name, type.type)
        : undefined;
  }
}

function createTypeReference(
  name: string,
  type: ExtractableType
): dom.TypeReference {
  const namedTypeReference = dom.create.namedTypeReference(name);
  if (type.kind === 'array') {
    return dom.create.array(namedTypeReference);
  } else {
    return namedTypeReference;
  }
}

function getUniqueNames(input: string[]): string[] {
  return Object.keys(
    input.reduce((all: any, name: string) => {
      all[name] = true;
      return all;
    }, {})
  );
}

export function propTypeQueryExpression(
  propTypesName: string | undefined
): string {
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

function getReactComponentName(ast: AstQuery): string | undefined {
  const res = ast.query(`
    // ImportDeclaration[
      /:source StringLiteral[@value == 'react']
    ]
    /:specifiers *[
      / Identifier[@name == 'Component'] || / Identifier[@name == 'PureComponent']
    ]
    /:local Identifier
  `);
  if (res.length > 0) {
    return res[0].name;
  }
  return undefined;
}

function getPropTypesName(ast: AstQuery): string | undefined {
  let res = ast.query(`
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
  res = ast.query(`
    // ImportDeclaration[
      /:source StringLiteral[@value == 'prop-types']
    ]
    /:specifiers *[
      ImportNamespaceSpecifier || / Identifier[@name == 'PropTypes']
    ]
    /:local Identifier
  `);
  if (res.length > 0) {
    return res[0].name;
  }
  return undefined;
}

function getImportedPropTypes(ast: AstQuery): ImportedPropType[] {
  return ast
    .query(
      `
    // ImportDeclaration[
      /:source StringLiteral[@value == 'prop-types']
    ]
    /:specifiers ImportSpecifier
  `
    )
    .map(({ imported, local }) => ({
      importedName: imported.name,
      localName: local.name,
    }));
}

function getInstanceOfPropTypes(
  ast: AstQuery,
  importedPropTypes: ImportedPropTypes
): string[] {
  const { propTypesName, propTypes } = importedPropTypes;
  const instanceOfPropType = propTypes.find(
    ({ importedName }) => importedName === 'instanceOf'
  );
  const localInstanceOfName = instanceOfPropType
    ? instanceOfPropType.localName
    : undefined;

  const res = ast.query(`
    // CallExpression[
      /:callee MemberExpression[
        (${propTypeQueryExpression(propTypesName)})
        &&
          /:property Identifier[@name == 'instanceOf']
      ]
      ||
      /:callee Identifier[@name == '${localInstanceOfName}']
    ]
    /:arguments *
  `);

  return res.map((identifer) => identifer.name);
}

interface ImportStatement {
  name: string | undefined;
  local: string;
  path: string;
}
function getImportStatements(
  ast: AstQuery,
  typeNames: string[],
  instanceOfResolver: InstanceOfResolver | undefined
): ImportStatement[] {
  return typeNames
    .map((name) => {
      const res = ast.query(`
      // ImportDeclaration[
        /:specifiers * /:local Identifier[@name == '${name}']
      ]
    `);
      return {
        name:
          res.length > 0 && res[0].specifiers[0].imported
            ? res[0].specifiers[0].imported.name
            : undefined,
        local: name,
        path: res.length > 0 ? res[0].source.value : undefined,
      };
    })
    .map((importStatement) => {
      if (importStatement && instanceOfResolver) {
        const resolvedPath = importStatement.name
          ? instanceOfResolver(importStatement.name)
          : instanceOfResolver(importStatement.local);
        if (resolvedPath) {
          importStatement.path = resolvedPath;
        }
      }
      return importStatement;
    })
    .filter((importStatement) => Boolean(importStatement.path));
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
    return res.map((match) => match.object.name);
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
    return res.map((match) => (match.id ? match.id.name : ''));
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
    return res.map((match) => (match.id ? match.id.name : ''));
  }
  return [];
}

function getComponentNamesByObject(
  ast: AstQuery,
  componentNames: string[]
): { name: string; properties: object | undefined }[] {
  const res = ast.query(`
      /:program *
      / VariableDeclaration
        / VariableDeclarator[
          /:init ObjectExpression
          // ObjectProperty
        ],
      /:program *
      / ExportNamedDeclaration
        // VariableDeclarator[
          /:init ObjectExpression
            // ObjectProperty
        ]
  `);
  if (res.length > 0) {
    return (
      res
        // only interested in components that exist
        .filter((match) => !componentNames.includes(match))
        .map((match) => ({
          name: match.id ? match.id.name : '',
          properties: match.init?.properties,
        }))
    );
  }
  return [];
}

function getPropTypes(ast: AstQuery, componentName: string): any | undefined {
  const propTypes =
    getPropTypesFromAssignment(ast, componentName) ||
    getPropTypesFromStaticAttribute(ast, componentName);

  const referencedComponentName = getReferencedPropTypesComponentName(
    ast,
    propTypes
  );
  if (referencedComponentName) {
    return getPropTypes(ast, referencedComponentName);
  }

  if (propTypes) {
    const referencedVariable = ast.query(`
      //VariableDeclarator[
        /:id Identifier[@name == '${propTypes.name}']
      ]
      /:init *
    `);

    if (referencedVariable && referencedVariable.length) {
      return referencedVariable[0];
    }
  }

  return propTypes;
}

function getPropTypesFromAssignment(
  ast: AstQuery,
  componentName: string
): any | undefined {
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

function getPropTypesFromStaticAttribute(
  ast: AstQuery,
  componentName: string
): any | undefined {
  if (componentName === '') {
    const res = ast.query(`
      //ClassDeclaration
      /:body *
      //ClassProperty[
        /:key Identifier[@name == 'propTypes']
      ]
      /:value*
    `);
    if (res.length > 0 && !res[0].id) {
      return res[0];
    }
  }
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

function getReferencedPropTypesComponentName(
  ast: AstQuery,
  propTypes: any | undefined
): string | undefined {
  if (propTypes) {
    const propTypesReference = ast.querySubtree(
      propTypes,
      `
      MemberExpression [
        /:property Identifier[@name == 'propTypes']
      ] /:object Identifier
    `
    );
    if (propTypesReference.length > 0) {
      return propTypesReference[0].name;
    }
  }
  return undefined;
}

function getComponentExportType(
  ast: AstQuery,
  componentName: string
): dom.DeclarationFlags | undefined {
  if (isDefaultExport(ast, componentName)) {
    return dom.DeclarationFlags.ExportDefault;
  }

  if (isNamedExport(ast, componentName)) {
    return dom.DeclarationFlags.Export;
  }

  return undefined;
}

function isDefaultExport(ast: AstQuery, componentName: string): boolean {
  return (
    isUnnamedDefaultExport(ast, componentName) ||
    isNamedDefaultExport(ast, componentName) ||
    isNamedExportAsDefault(ast, componentName)
  );
}

function isUnnamedDefaultExport(ast: AstQuery, componentName: string): boolean {
  if (componentName !== '') {
    return false;
  }

  const res = ast.query(`
    // ExportDefaultDeclaration[
        // ClassDeclaration
      ||
        // FunctionDeclaration
    ]
  `);

  return res.length > 0 && !res[0].id;
}

function isNamedDefaultExport(ast: AstQuery, componentName: string): boolean {
  const res = ast.query(`
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

  return res.length > 0;
}

function isNamedExportAsDefault(ast: AstQuery, componentName: string): boolean {
  const res = ast.query(`
    // ExportNamedDeclaration[
      // ExportSpecifier [
        /:local Identifier[@name == '${componentName}'] &&
        /:exported Identifier[@name == 'default']
      ]
    ]
  `);

  return res.length > 0;
}

function isNamedExport(ast: AstQuery, componentName: string): boolean {
  const res = ast.query(`
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
    ||
      // ExportSpecifier
      /:exported Identifier[@name == '${componentName}']
    ]
  `);

  return res.length > 0;
}

function isClassComponent(
  ast: AstQuery,
  componentName: string,
  reactComponentName: string | undefined
): boolean {
  if (componentName === '') {
    const res = ast.query(`
        // ClassDeclaration
    `);
    if (res.length > 0 && !res[0].id) {
      return true;
    }
  }
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
