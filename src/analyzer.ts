import ASTQ from 'astq';

import { IPropTypes, IProp } from './deprecated';
import { InstanceOfResolver } from './index';

type IASTNode = ASTNode;
interface ASTNode {
  type: string;
  loc: object;
  [name: string]: any;
  value?: any;
  key?: any;
  expression?: any;
  id?: any;
  body?: any;
}

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
    .filter(comment => comment.type === 'CommentBlock')[0] || {})
    .value;
}

/**
 * @internal
 */
// tslint:disable:next-line cyclomatic-complexity
export function getTypeFromPropType(node: IASTNode, instanceOfResolver = defaultInstanceOfResolver): IProp {
  const result: IProp = {
    type: 'any',
    optional: true
  };
  if (isNode(node)) {
    const {isRequired, type} = isRequiredPropType(node, instanceOfResolver);
    result.optional = !isRequired;
    switch (type.name) {
      case 'any':
        result.type = 'any';
        break;
      case 'array':
        result.type = (type.arrayType || 'any') + '[]';
        break;
      case 'bool':
        result.type = 'boolean';
        break;
      case 'func':
        result.type = '(...args: any[]) => any';
        break;
      case 'number':
        result.type = 'number';
        break;
      case 'object':
        result.type = 'Object';
        break;
      case 'string':
        result.type = 'string';
        break;
      case 'node':
        result.type = 'React.ReactNode';
        break;
      case 'element':
        result.type = 'React.ReactElement<any>';
        break;
      case 'union':
        result.type = type.types.map((unionType: string) => unionType).join('|');
        break;
      case 'instanceOf':
        if (type.importPath) {
          result.type = type.type;
          result.importPath = type.importPath;
        } else {
          result.type = 'any';
        }
        break;
    }
  }
  return result;
}

function isNode(obj: IASTNode): boolean {
  return obj && typeof obj.type !== 'undefined' && typeof obj.loc !== 'undefined';
}

function getReactPropTypeFromExpression(node: any, instanceOfResolver: InstanceOfResolver): any {
  if (node.type === 'MemberExpression' && node.object.type === 'MemberExpression'
      && node.object.object.name === 'React' && node.object.property.name === 'PropTypes') {
    return node.property;
  } else if (node.type === 'CallExpression') {
    const callType = getReactPropTypeFromExpression(node.callee, instanceOfResolver);
    switch (callType.name) {
      case 'instanceOf':
        return {
          name: 'instanceOf',
          type: node.arguments[0].name,
          importPath: instanceOfResolver(node.arguments[0].name)
        };
      case 'arrayOf':
        const arrayType = getTypeFromPropType(node.arguments[0], instanceOfResolver);
        return {
          name: 'array',
          arrayType: arrayType.type
        };
      case 'oneOfType':
        const unionTypes = node.arguments[0].elements.map((element: IASTNode) =>
          getTypeFromPropType(element, instanceOfResolver));
        return {
          name: 'union',
          types: unionTypes.map((type: any) => type.type)
        };
    }
  }
  return 'undefined';
}

function isRequiredPropType(node: any, instanceOfResolver: InstanceOfResolver): any {
  const isRequired = node.type === 'MemberExpression' && node.property.name === 'isRequired';
  return {
    isRequired,
    type: getReactPropTypeFromExpression(isRequired ? node.object : node, instanceOfResolver)
  };
}
