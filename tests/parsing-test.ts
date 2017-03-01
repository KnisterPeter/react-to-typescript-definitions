import test, { ContextualTestContext } from 'ava';

import * as chalk from 'chalk';
import * as diff from 'diff';
import * as fs from 'fs';
import * as path from 'path';

import * as react2dts from '../src/index';

let basedir = path.join(__dirname, '..', '..', 'tests');
if (process.env.WALLABY) {
  basedir = path.join(__dirname);
}

function normalize(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .replace(/ => /g, '=>');
}

function textDiff(t: ContextualTestContext, actual: string, expected: string): void {
  if (diff.diffChars(normalize(expected), normalize(actual)).length > 1) {
    const differences = diff.diffChars(expected, actual);
    const result = differences
      .map(part => {
        const value = part.value.trim() ? part.value : (part.added ? '+' : '-') + part.value;
        return part.added ? chalk.green(value) : part.removed ? chalk.red(value) : chalk.grey(value);
      })
      .join('');
    t.fail(`\n${result}`);
  }
}

function compare(t: ContextualTestContext, moduleName: string|null, file1: string, file2: string,
    opts: react2dts.IOptions = {}): void {
  textDiff(
    t,
    react2dts.generateFromFile(moduleName, path.join(basedir, file1), opts),
    fs.readFileSync(path.join(basedir, file2)).toString()
  );
}

test('Parsing should create definition from es6 class component', t => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message'
  };
  compare(t, 'component', 'es6-class.jsx', 'es6-class.d.ts', opts);
});
test('Parsing should create definition from es7 class component', t => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message'
  };
  compare(t, 'component', 'es7-class.jsx', 'es7-class.d.ts', opts);
});
test('Parsing should create top-level module definition from es7 class component', t => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message'
  };
  compare(t, null, 'es7-class.jsx', 'es7-class-top-level-module.d.ts', opts);
});
test('Parsing should create definition from babeled es7 class component', t => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message'
  };
  compare(t, 'component', 'es7-class-babeled.js', 'es7-class.d.ts', opts);
});
test('Parsing should create definition from es7 class component with separate default export', t => {
  compare(t, 'component', 'es7-class-separate-export.jsx', 'es7-class-separate-export.d.ts');
});
test('Parsing should create definition from stateless function component', t => {
  compare(t, 'component', 'stateless.jsx', 'stateless.d.ts');
});
test('Parsing should create definition from class extending Component', t => {
  compare(t, 'component', 'import-react-component.jsx', 'import-react-component.d.ts');
});
test('Parsing should create definition from class import PropTypes and instanceOf dependency', t => {
  compare(t, 'component', 'instance-of-proptype-names.jsx', 'instance-of-proptype-names.d.ts');
});
test('Parsing should create definition from file without propTypes', t => {
  compare(t, 'component', 'component-without-proptyes.jsx', 'component-without-proptyes.d.ts');
});
test('Parsing should create definition from file with references in propTypes', t => {
  compare(t, 'component', 'references-in-proptypes.jsx', 'references-in-proptypes.d.ts');
});
