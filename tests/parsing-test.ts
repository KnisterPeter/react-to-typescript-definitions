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

describe('Parsing', () => {
  it('should create definition from es6 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (): string => './path/to/Message'
    };
    textDiff(
      react2dts.generateFromFile('component', path.join(basedir, 'es6-class.jsx'), opts),
      fs.readFileSync(path.join(basedir, 'es6-class.d.ts')).toString()
    );
  });
  it('should create definition from es7 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (): string => './path/to/Message'
    };
    textDiff(
      react2dts.generateFromFile('component', path.join(basedir, 'es7-class.jsx'), opts),
      fs.readFileSync(path.join(basedir, 'es7-class.d.ts')).toString()
    );
  });
  it('should create top-level module definition from es7 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (): string => './path/to/Message'
    };
    textDiff(
      react2dts.generateFromFile(null, path.join(basedir, 'es7-class.jsx'), opts),
      fs.readFileSync(path.join(basedir, 'es7-class-top-level-module.d.ts')).toString()
    );
  });
  it('should create definition from stateless function component', () => {
    textDiff(
      react2dts.generateFromFile('component', path.join(basedir, 'stateless.jsx')),
      fs.readFileSync(path.join(basedir, 'stateless.d.ts')).toString()
    );
  });
});
