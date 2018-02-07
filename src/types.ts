import astToCode from 'babel-generator';
import chalk from 'chalk';
import * as dom from 'dts-dom';
import { IOptions } from './index';
import { propTypeQueryExpression, AstQuery, ImportedPropTypes } from './typings';

export interface TypeDeclaration {
  type: any;
  optional: boolean;
}

function getTypeDeclaration(type: any, optional: boolean): TypeDeclaration {
  return {
    type,
    optional
  };
}

export function get(ast: AstQuery, propertyAst: any, importedPropTypes: ImportedPropTypes,
    options: IOptions): TypeDeclaration {
  try {
    const simpleType = getSimpleType(ast, propertyAst, importedPropTypes);
    if (simpleType) {
      return simpleType;
    }
    const complexType = getComplexType(ast, propertyAst, importedPropTypes, options);
    if (complexType) {
      return complexType;
    }
  } catch (e) {
    if (e.loc) {
      printErrorWithContext(e, ast.ast, options);
    } else {
      console.error('Failed to infer PropType; Fallback to any');
      console.error(e.stack);
    }
  }
  return {
    type: 'any',
    optional: true
  };
}

// tslint:disable:next-line cyclomatic-complexity
function getSimpleType(ast: AstQuery, propertyAst: any,
    importedPropTypes: ImportedPropTypes): TypeDeclaration|undefined {
  const [required, simpleTypeName] = getSimpleTypeName(ast, propertyAst, importedPropTypes);
  switch (simpleTypeName) {
    case 'any':
      return getTypeDeclaration('any', !required);
    case 'array':
      return getTypeDeclaration(dom.create.array('any'), !required);
    case 'bool':
      return getTypeDeclaration('boolean', !required);
    case 'func':
      return getTypeDeclaration(
        dom.create.functionType([
          dom.create.parameter('args', dom.create.array('any'), dom.ParameterFlags.Rest)],
          'any'),
        !required);
    case 'number':
      return getTypeDeclaration('number', !required);
    case 'object':
      return getTypeDeclaration(dom.create.namedTypeReference('Object'), !required);
    case 'string':
      return getTypeDeclaration('string', !required);
    case 'node':
      return getTypeDeclaration(dom.create.namedTypeReference('React.ReactNode'), !required);
    case 'element':
      return getTypeDeclaration(dom.create.namedTypeReference('React.ReactElement<any>'), !required);
    case 'symbol':
      return getTypeDeclaration(dom.create.namedTypeReference('Symbol'), !required);
  }
  return undefined;
}

function getComplexType(ast: AstQuery, propertyAst: any,
    importedPropTypes: ImportedPropTypes, options: IOptions): TypeDeclaration|undefined {
  const [required, complexTypeName, typeAst] = getComplexTypeName(ast, propertyAst, importedPropTypes);
  switch (complexTypeName) {
    case 'instanceOf':
      return getTypeDeclaration(dom.create.namedTypeReference(typeAst.arguments[0].name), !required);
    case 'oneOfType':
      const typeDecls = typeAst.arguments[0].elements
        .map((subtree: any) => get(ast, subtree, importedPropTypes, options)) as TypeDeclaration[];
      return getTypeDeclaration(dom.create.union(typeDecls.map(type => type.type)), !required);
    case 'arrayOf':
      const typeDecl = get(ast, typeAst.arguments[0], importedPropTypes, options);
      return getTypeDeclaration(dom.create.array(typeDecl.type), !required);
    case 'oneOf':
      // tslint:disable:next-line comment-format
      // FIXME: This should better be a real enum
      const enumEntries = getEnumValues(ast, typeAst.arguments[0]);
      return getTypeDeclaration(dom.create.union(enumEntries as dom.Type[]), !required);
    case 'shape':
      const entries = getShapeProperties(ast, typeAst.arguments[0]).map((entry: any) => {
        const typeDecl = get(ast, entry.value, importedPropTypes, options);
        return dom.create.property(entry.key.name, typeDecl.type,
          typeDecl.optional ? dom.DeclarationFlags.Optional : dom.DeclarationFlags.None);
      });
      return getTypeDeclaration(dom.create.objectType(entries), !required);
  }
  return undefined;
}

function isRequired(ast: AstQuery, propertyAst: any): [boolean, any] {
  const required = ast.querySubtree(propertyAst, `
    MemberExpression /:property Identifier[@name == 'isRequired']
  `);
  if (required.length > 0) {
    return [true, propertyAst.object];
  }
  return [false, propertyAst];
}

function getSimpleTypeName(ast: AstQuery, propertyAst: any,
    importedPropTypes: ImportedPropTypes): [boolean, string|undefined] {
  const {propTypesName, propTypes} = importedPropTypes;
  const [required, typeAst] = isRequired(ast, propertyAst);

  if (!propTypesName && typeAst.type === 'Identifier') {
    const propType = propTypes.find(({localName}) => localName === typeAst.name);
    return [required, propType ? propType.importedName : undefined];
  }

  const res = ast.querySubtree(typeAst, `
    MemberExpression[
      (${propTypeQueryExpression(propTypesName)})
      &&
        /:property Identifier
    ]
    /:property Identifier
  `);

  return [required, res.length > 0 ? res[0].name : undefined];
}

function getComplexTypeName(ast: AstQuery, propertyAst: any,
    importedPropTypes: ImportedPropTypes): [boolean, string|undefined, any] {
  const [required, typeAst] = isRequired(ast, propertyAst);
  if (typeAst.type === 'CallExpression') {
    const [, simpleTypeName] = getSimpleTypeName(ast, typeAst.callee, importedPropTypes);
    return [required, simpleTypeName, typeAst];
  }
  return [required, undefined, typeAst];
}

function getEnumValues(ast: AstQuery, oneOfTypes: any): any[] {
  oneOfTypes = resolveIdentifier(ast, oneOfTypes);

  if (!oneOfTypes.elements) {
    throwWithLocation('Failed to lookup enum values', oneOfTypes);
  }

  return (oneOfTypes.elements as any[]).map((element: any) => {
    element = resolveIdentifier(ast, element);
    if (element.type === 'StringLiteral') {
      return dom.type.stringLiteral(element.value);
    }
    if (element.type === 'NumericLiteral') {
      return dom.type.numberLiteral(element.value);
    }
    return 'any';
  });
}

function getShapeProperties(ast: AstQuery, input: any): any[] {
  input = resolveIdentifier(ast, input);

  if (!input.properties) {
    throwWithLocation('Failed to lookup shape properties', input);
  }

  return input.properties;
}

function resolveIdentifier(ast: AstQuery, input: any): any {
  if (input.type !== 'Identifier') {
    return input;
  }

  const res = ast.query(`
    //VariableDeclarator[
      /:id Identifier[@name == '${input.name}']
    ]
    /:init *
  `);
  if (!res[0]) {
    throwWithLocation('Failed to lookup identifier', input);
  }
  return res[0];
}

function throwWithLocation(message: string, ast: any): never {
  const error = new Error(message);
  (error as any).loc = ast.loc;
  (error as any).start = ast.start;
  (error as any).end = ast.end;
  throw error;
}

function printErrorWithContext(e: any, ast: any, options: IOptions): void {
  console.error(`${(options.filename || '')} ${e.message}`);
  const src = options.source || astToCode(ast.ast).code;
  // console.log(src.substring(e.start, e.end));
  const lines = src.split('\n');
  const errorLine = lines[e.loc.start.line - 1];

  console.error(`Line ${e.loc.start.line - 1}: ${lines[e.loc.start.line - 2]}`);
  // tslint:disable-next-line prefer-template
  console.error(`Line ${e.loc.start.line}: ` + errorLine.substring(0, e.loc.start.column)
    + chalk.red(errorLine.substring(e.loc.start.column, e.loc.end.column))
    + errorLine.substring(e.loc.end.column));
  console.error(`Line ${e.loc.start.line + 1}: ${lines[e.loc.start.line]}`);
  console.error();
}
