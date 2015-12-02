import * as path from 'path';
import * as fs from 'fs';
import * as babylon from 'babylon';

export function generate(name: string, path: string): string {
	const ast = babylon.parse(fs.readFileSync(path).toString(), {
		sourceType: 'module',
		plugins: [
			'jsx',
			'flow',
			'asyncFunctions',
			'classConstructorCall',
			'doExpressions',
			'trailingFunctionCommas',
			'objectRestSpread',
			'decorators',
			'classProperties',
			'exportExtensions',
			'exponentiationOperator',
			'asyncGenerators',
			'functionSent'
		]
	});
	let exportDefaultClass: any = false;
	let propTypes: any = false;
	walk(ast.program, {
		'ExportDefaultDeclaration': (node: any) => {
			walk(node, {
				'ClassDeclaration': (node: any) => {
					exportDefaultClass = node.id.name;
					walk(node.body, {
						'ClassProperty': (node: any) => {
							if (node.key.name == 'propTypes') {
								propTypes = {};
								walk(node.value, {
									'ObjectProperty': (node: any) => {
										propTypes[node.key.name] = getTypeFromPropType(node.value);
									}
								});
							}
						}
					});
				}
			})
		}
	});
	return `
		declare module '${name}' {
			import * as React from 'react';
			
			${propTypes &&
			`interface Props {
				${Object.keys(propTypes).map((propTypeName: any) => `${propTypeName}: ${propTypes[propTypeName]};`).join('\n\t')}
			}
			`}
			${exportDefaultClass &&
			`export default class ${exportDefaultClass} extends React.Component<${propTypes ? 'Props' : 'any'}, any> {
			}`}
		}
	`.trim().replace(/\n\t+/g, '\n\t');
}

function walk(node: any, handlers: any) {
	if (isNode(node)) {
		if (typeof handlers[node.type] == 'function') {
			handlers[node.type](node);
		}
		Object.keys(node).forEach((childKey: any) => {
			const child = node[childKey];
			let children = child;
			if (!Array.isArray(child)) {
				children = [child];
			}
			children.forEach((child: any) => {
				walk(child, handlers);
			});
		});
	}
}

function isNode(obj: any): boolean {
	return obj && typeof obj.type != 'undefined' && typeof obj.loc != 'undefined';
}

function getTypeFromPropType(node: any): string {
	if (isNode(node)) {
		const isMemberExpression = (node: any): boolean => {
			return node.type == 'MemberExpression';
		}
		const convertMemberExpression = (node: any): string => {
			if (isMemberExpression(node.object)) {
				return convertMemberExpression(node.object) + '.' + node.property.name;
			}
			return node.object.name + '.' + node.property.name;
		};
		if (isMemberExpression(node)) {
			const type = convertMemberExpression(node);
			switch (type) {
				case 'React.PropTypes.number':
					return 'number';
				case 'React.PropTypes.string':
					return 'string';
				case 'React.PropTypes.array':
					return 'any[]';
				case 'React.PropTypes.bool':
					return 'boolean';
				case 'React.PropTypes.func':
					return '(...args?: any[]) => any';
				case 'React.PropTypes.object':
					return 'Object';
			}
		}
	}
	return 'any';
}
