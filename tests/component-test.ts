import { assert } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import * as react2dts from '../index';

describe('Parsing', () => {
  it('should create definition from simple component', () => {
    assert.equal(
      react2dts.generateFromFile('simple-component', path.join(__dirname, 'simple-component.jsx')), 
      fs.readFileSync(path.join(__dirname, 'simple-component.d.ts')).toString()
    );
  });
});
