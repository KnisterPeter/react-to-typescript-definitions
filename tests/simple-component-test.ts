import { assert } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import * as react2dts from '../index';

describe('Parsing', () => {
  it('should create definition from simple component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (name: string): string => './path/to/Message'
    };
    assert.equal(
      react2dts.generateFromFile('simple-component', path.join(__dirname, 'simple-component.jsx'), opts),
      fs.readFileSync(path.join(__dirname, 'simple-component.d.ts')).toString()
    );
  });
});
