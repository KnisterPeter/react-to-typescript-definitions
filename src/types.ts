import * as astqts from 'astq';
import * as dom from 'dts-dom';
import { propTypeQueryExpression } from './typings';

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

export function get(astq: astqts.ASTQ, propertyAst: any, propTypesName: string|undefined): TypeDeclaration {
  const [required, simpleTypeName] = getSimpleTypeName(astq, propertyAst, propTypesName);
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

  const [, complexTypeName, typeAst] = getComplexTypeName(astq, propertyAst, propTypesName);
  switch (complexTypeName) {
    case 'instanceOf':
      return getTypeDeclaration(dom.create.typeof(
        dom.create.namedTypeReference(typeAst.arguments[0].name)), !required);
    case 'oneOfType':
      const typeDecls = typeAst.arguments[0].elements
        .map((ast: any) => get(astq, ast, propTypesName)) as TypeDeclaration[];
      return getTypeDeclaration(dom.create.union(typeDecls.map(type => type.type)), !required);
    case 'arrayOf':
      const typeDecl = get(astq, typeAst.arguments[0], propTypesName);
      return getTypeDeclaration(dom.create.array(typeDecl.type), !required);
    case 'oneOf':
      // FIXME: This should better be a real enum
      const enumEntries = getEnumValues(typeAst.arguments[0].elements);
      return getTypeDeclaration(dom.create.union(enumEntries as dom.Type[]), !required);
    case 'shape':
      const entries = typeAst.arguments[0].properties.map((entry: any) => {
        const typeDecl = get(astq, entry.value, propTypesName);
        return dom.create.property(entry.key.name, typeDecl.type,
          typeDecl.optional ? dom.DeclarationFlags.Optional : dom.DeclarationFlags.None);
      });
      return getTypeDeclaration(dom.create.objectType(entries), !required);
  }

  return {
    type: 'any',
    optional: true
  };
}

function isRequired(astq: astqts.ASTQ, propertyAst: any): [boolean, any] {
  const required = astq.query(propertyAst, `
    MemberExpression /:property Identifier[@name == 'isRequired']
  `);
  if (required.length > 0) {
    return [true, propertyAst.object];
  }
  return [false, propertyAst];
}

function getSimpleTypeName(astq: astqts.ASTQ, propertyAst: any,
    propTypesName: string|undefined): [boolean, string|undefined] {
  const [required, typeAst] = isRequired(astq, propertyAst);
  const res = astq.query(typeAst, `
    MemberExpression[
      (${propTypeQueryExpression(propTypesName)})
      &&
        /:property Identifier
    ]
  `);
  return [required, res.length > 0 ? res[0].property.name : undefined];
}

function getComplexTypeName(astq: astqts.ASTQ, propertyAst: any,
    propTypesName: string|undefined): [boolean, string|undefined, any] {
  const [required, typeAst] = isRequired(astq, propertyAst);
  if (typeAst.type === 'CallExpression') {
    const [, simpleTypeName] = getSimpleTypeName(astq, typeAst.callee, propTypesName);
    return [required, simpleTypeName, typeAst];
  }
  return [required, undefined, typeAst];
}

function getEnumValues(oneOfTypes: any[]): any[] {
  return oneOfTypes.map((element: any) => {
    // FIXME: This are not named references!
    if (element.type === 'StringLiteral') {
      return dom.create.namedTypeReference(`'${element.value}'`);
    }
    return dom.create.namedTypeReference(element.value);
  });
}
