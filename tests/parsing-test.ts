import { assert } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import * as diff from 'diff';

import * as react2dts from '../src/index';

const basedir = path.join(__dirname, '..', '..', 'tests');

function textDiff(actual: string, expected: string): void {
  const differences = diff.diffChars(expected, actual);
  if (differences.length > 1) {
    const result = differences
      .map(part => {
        const value = part.value.trim() ? part.value : (part.added ? '+' : '-') + part.value;
        return part.added ? chalk.green(value) : part.removed ? chalk.red(value) : chalk.grey(value);
      })
      .join('');
    assert.fail(true, false, `\n${result}`);
  }
}

function compare(file1: string, file2: string, opts: react2dts.IOptions = {}): void {
  textDiff(
    react2dts.generateFromFile('component', path.join(basedir, file1), opts),
    fs.readFileSync(path.join(basedir, file2)).toString()
  );
}

describe('Parsing', () => {
  it('should create definition from es6 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (): string => './path/to/Message'
    };
    compare('es6-class.jsx', 'es6-class.d.ts', opts);
  });
  it('should create definition from es7 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (): string => './path/to/Message'
    };
    compare('es7-class.jsx', 'es7-class.d.ts', opts);
  });
  it('should create top-level module definition from es7 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (): string => './path/to/Message'
    };
    compare('es7-class.jsx', 'es7-class-top-level-module.d.ts', opts);
  });
  it('should create definition from babeled es7 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (): string => './path/to/Message'
    };
    compare('es7-class-babeled.js', 'es7-class.d.ts', opts);
  });
  it('should create definition from stateless function component', () => {
    compare('stateless.jsx', 'stateless.d.ts');
  });
  it('should create definition from class extending Component', () => {
    compare('import-react-component.jsx', 'import-react-component.d.ts');
  });
  it('should create definition from class import PropTypes and instanceOf dependency', () => {
    compare('instance-of-proptype-names.jsx', 'instance-of-proptype-names.d.ts');
  });
});
