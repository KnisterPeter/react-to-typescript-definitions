import * as dom from 'dts-dom';
import * as astqts from 'astq';
const ASTQ: typeof astqts.ASTQ = astqts as any;

import { InstanceOfResolver, IPropTypes, IProp, IASTNode } from './index';

const defaultInstanceOfResolver: InstanceOfResolver = (_name: string): undefined => undefined;

export function parsePropTypes(node: any, instanceOfResolver?: InstanceOfResolver): IPropTypes {
  const astq = new ASTQ();
  return astq
    .query(node, `/ObjectProperty`)
    .reduce((propTypes: IPropTypes, propertyNode: IASTNode) => {
        const prop: IProp = getTypeFromPropType(propertyNode.value, instanceOfResolver);
        prop.documentation = getOptionalDocumentation(propertyNode);
        propTypes[propertyNode.key.name] = prop;
        return propTypes;
    }, {});
}

function getOptionalDocumentation(propertyNode: any): string {
  return (((propertyNode.leadingComments || []) as any[])
    .filter(comment => comment.type == 'CommentBlock')[0] || {})
    .value;
}

/**
 * @internal
 */
export function getTypeFromPropType(node: IASTNode, instanceOfResolver = defaultInstanceOfResolver): IProp {
  const result: IProp = {
    type: 'any',
    type2: 'any',
    optional: true
  };
  if (isNode(node)) {
    const {isRequired, type} = isRequiredPropType(node, instanceOfResolver);
    result.optional = !isRequired;
    switch (type.name) {
      case 'any':
        result.type = 'any';
        result.type2 = 'any';
        break;
      case 'array':
        result.type = (type.arrayType || 'any') + '[]';
        result.type2 = dom.create.array(type.arrayType2 || 'any');
        break;
      case 'bool':
        result.type = 'boolean';
        result.type2 = 'boolean';
        break;
      case 'func':
        result.type = '(...args: any[]) => any';
        result.type2 = dom.create.functionType([
          dom.create.parameter('args', dom.create.array('any'), dom.ParameterFlags.Rest)], 'any');
        break;
      case 'number':
        result.type = 'number';
        result.type2 = 'number';
        break;
      case 'object':
        result.type = 'Object';
        result.type2 = dom.create.namedTypeReference('Object');
        break;
      case 'string':
        result.type = 'string';
        result.type2 = 'string';
        break;
      case 'node':
        result.type = 'React.ReactNode';
        result.type2 = dom.create.namedTypeReference('React.ReactNode');
        break;
      case 'element':
        result.type = 'React.ReactElement<any>';
        result.type2 = dom.create.namedTypeReference('React.ReactElement<any>');
        break;
      case 'union':
        result.type = type.types.map((unionType: string) => unionType).join('|');
        result.type2 = dom.create.union(type.types2);
        break;
      case 'instanceOf':
        if (type.importPath) {
          result.type = 'typeof ' + type.type;
          result.type2 = dom.create.typeof(type.type2);
          (result as any).importType = type.type;
          (result as any).importPath = type.importPath;
        } else {
          result.type = 'any';
          result.type2 = 'any';
        }
        break;
    }
  }
  return result;
}

function isNode(obj: IASTNode): boolean {
  return obj && typeof obj.type != 'undefined' && typeof obj.loc != 'undefined';
}

function getReactPropTypeFromExpression(node: any, instanceOfResolver: InstanceOfResolver): any {
  if (node.type == 'MemberExpression' && node.object.type == 'MemberExpression'
      && node.object.object.name == 'React' && node.object.property.name == 'PropTypes') {
    return node.property;
  } else if (node.type == 'CallExpression') {
    const callType = getReactPropTypeFromExpression(node.callee, instanceOfResolver);
    switch (callType.name) {
      case 'instanceOf':
        return {
          name: 'instanceOf',
          type: node.arguments[0].name,
          type2: dom.create.namedTypeReference(node.arguments[0].name),
          importPath: instanceOfResolver(node.arguments[0].name)
        };
      case 'arrayOf':
        const arrayType = getTypeFromPropType(node.arguments[0], instanceOfResolver);
        return {
          name: 'array',
          arrayType: arrayType.type,
          arrayType2: arrayType.type2
        };
      case 'oneOfType':
        const unionTypes = node.arguments[0].elements.map((element: IASTNode) =>
          getTypeFromPropType(element, instanceOfResolver));
        return {
          name: 'union',
          types: unionTypes.map((type: any) => type.type),
          types2: unionTypes.map((type: any) => type.type2)
        };
    }
  }
  return 'undefined';
}

function isRequiredPropType(node: any, instanceOfResolver: InstanceOfResolver): any {
  const isRequired = node.type == 'MemberExpression' && node.property.name == 'isRequired';
  return {
    isRequired,
    type: getReactPropTypeFromExpression(isRequired ? node.object : node, instanceOfResolver)
  };
}
