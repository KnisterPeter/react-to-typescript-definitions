import test from 'tape';
import * as path from 'path';

import * as react2dts from '../index';

test('create definition from simple component', function(t) {
	var dts = react2dts.generate('simple-component', path.join(__dirname, 'simple-component.jsx'));
	t.equals(dts, `
			declare module 'simple-component' {
				import * as React from 'react';
				
				interface Props {
					number: number;
					string: string;
					array: any[];
					bool: boolean;
					func: (...args?: any[]) => any;
					object: Object;
				}
				
				export default class SimpleComponent extends React.Component<Props, any> {
				}
			}
		`.trim().replace(/\n\t+/g, '\n\t'));
	t.end();
});
