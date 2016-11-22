import * as dom from 'dts-dom';
import { propTypeQueryExpression, AstQuery } from './typings';

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

export function get(ast: AstQuery, propertyAst: any, propTypesName: string|undefined): TypeDeclaration {
  try {
    const simpleType = getSimpleType(ast, propertyAst, propTypesName);
    if (simpleType) {
      return simpleType;
    }
    const complexType = getComplexType(ast, propertyAst, propTypesName);
    if (complexType) {
      return complexType;
    }
  } catch (e) {
    console.error('Failed to infer PropType; Fallback to any');
    console.error(e.stack);
  }
  return {
    type: 'any',
    optional: true
  };
}

// tslint:disable:next-line cyclomatic-complexity
function getSimpleType(ast: AstQuery, propertyAst: any,
    propTypesName: string|undefined): TypeDeclaration|undefined {
  const [required, simpleTypeName] = getSimpleTypeName(ast, propertyAst, propTypesName);
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
      return getTypeDeclaration(dom.create.typeof(dom.create.namedTypeReference('Symbol')), !required);
  }
  return undefined;
}

function getComplexType(ast: AstQuery, propertyAst: any,
    propTypesName: string|undefined): TypeDeclaration|undefined {
  const [required, complexTypeName, typeAst] = getComplexTypeName(ast, propertyAst, propTypesName);
  switch (complexTypeName) {
    case 'instanceOf':
      return getTypeDeclaration(dom.create.typeof(
        dom.create.namedTypeReference(typeAst.arguments[0].name)), !required);
    case 'oneOfType':
      const typeDecls = typeAst.arguments[0].elements
        .map((subtree: any) => get(ast, subtree, propTypesName)) as TypeDeclaration[];
      return getTypeDeclaration(dom.create.union(typeDecls.map(type => type.type)), !required);
    case 'arrayOf':
      const typeDecl = get(ast, typeAst.arguments[0], propTypesName);
      return getTypeDeclaration(dom.create.array(typeDecl.type), !required);
    case 'oneOf':
      // tslint:disable:next-line comment-format
      // FIXME: This should better be a real enum
      const enumEntries = getEnumValues(ast, typeAst.arguments[0]);
      return getTypeDeclaration(dom.create.union(enumEntries as dom.Type[]), !required);
    case 'shape':
      const entries = typeAst.arguments[0].properties.map((entry: any) => {
        const typeDecl = get(ast, entry.value, propTypesName);
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
    propTypesName: string|undefined): [boolean, string|undefined] {
  const [required, typeAst] = isRequired(ast, propertyAst);
  const res = ast.querySubtree(typeAst, `
    MemberExpression[
      (${propTypeQueryExpression(propTypesName)})
      &&
        /:property Identifier
    ]
  `);
  return [required, res.length > 0 ? res[0].property.name : undefined];
}

function getComplexTypeName(ast: AstQuery, propertyAst: any,
    propTypesName: string|undefined): [boolean, string|undefined, any] {
  const [required, typeAst] = isRequired(ast, propertyAst);
  if (typeAst.type === 'CallExpression') {
    const [, simpleTypeName] = getSimpleTypeName(ast, typeAst.callee, propTypesName);
    return [required, simpleTypeName, typeAst];
  }
  return [required, undefined, typeAst];
}

function getEnumValues(ast: AstQuery, oneOfTypes: any): any[] {
  if (oneOfTypes.type === 'Identifier') {
    const res = ast.query(`
      //VariableDeclarator[
        /:id Identifier[@name == '${oneOfTypes.name}']
      ]
      /:init *
    `);
    oneOfTypes = res[0];
  }
  return (oneOfTypes.elements as any[]).map((element: any) => {
    // tslint:disable:next-line comment-format
    // FIXME: This are not named references!
    if (element.type === 'StringLiteral') {
      return dom.create.namedTypeReference(`'${element.value}'`);
    }
    if (element.value) {
      return dom.create.namedTypeReference(element.value);
    }
    return 'any';
  });
}
