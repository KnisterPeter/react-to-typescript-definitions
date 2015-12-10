import test from 'tape';
import * as fs from 'fs';
import * as path from 'path';

import * as react2dts from '../index';

test('create definition from simple component', function(t) {
	t.equals(
		react2dts.generateFromFile('simple-component', path.join(__dirname, 'simple-component.jsx')), 
		fs.readFileSync(path.join(__dirname, 'simple-component.d.ts')).toString());
	t.end();
});
