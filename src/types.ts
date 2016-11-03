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
