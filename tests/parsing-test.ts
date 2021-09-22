// tslint:disable:no-implicit-dependencies
import test, { ExecutionContext } from 'ava';
import chalk from 'chalk';
import * as diff from 'diff';
import * as fs from 'fs';
import * as path from 'path';
import * as react2dts from '../src/index';

let basedir = path.join(__dirname, '..', '..', 'tests');
if (process.env.WALLABY) {
  basedir = path.join(__dirname);
}

function normalize(input: string): string {
  return input.replace(/\s+/g, ' ').replace(/ => /g, '=>');
}

function textDiff(t: ExecutionContext, actual: string, expected: string): void {
  if (diff.diffChars(normalize(expected), normalize(actual)).length > 1) {
    const differences = diff.diffChars(expected, actual);
    const result = differences
      .map((part) => {
        const value = part.value.trim()
          ? part.value
          : (part.added ? '+' : '-') + part.value;
        return part.added
          ? chalk.green(value)
          : part.removed
          ? chalk.red(value)
          : chalk.grey(value);
      })
      .join('');
    t.fail(`\n${result}`);
  } else {
    t.pass();
  }
}

function compare(
  t: ExecutionContext,
  moduleName: string | null,
  file1: string,
  file2: string,
  opts: react2dts.IOptions = {},
  reactImport = 'react'
): void {
  textDiff(
    t,
    react2dts.generateFromFile(
      moduleName,
      path.join(basedir, file1),
      opts,
      reactImport
    ),
    fs.readFileSync(path.join(basedir, file2)).toString()
  );
}

test('Parsing should create definition from es6 class component', (t) => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message',
  };
  compare(t, 'component', 'es6-class.jsx', 'es6-class.d.ts', opts);
});
test('Parsing should create definition from es7 class component', (t) => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message',
  };
  compare(t, 'component', 'es7-class.jsx', 'es7-class.d.ts', opts);
});
test('Parsing should create top-level module definition from es7 class component', (t) => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message',
  };
  compare(t, null, 'es7-class.jsx', 'es7-class-top-level-module.d.ts', opts);
});
test('Parsing should create definition from babeled es7 class component', (t) => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message',
  };
  compare(t, 'component', 'es7-class-babeled.js', 'es7-class.d.ts', opts);
});
test('Parsing should create definition from es7 class component babeled to es6', (t) => {
  const opts: react2dts.IOptions = {
    instanceOfResolver: (): string => './path/to/Message',
  };
  compare(
    t,
    'component',
    'es7-class-babeled-to-es6.js',
    'es7-class-babeled-to-es6.d.ts',
    opts
  );
});
test('Parsing should create definition from es7 class component with separate default export', (t) => {
  compare(
    t,
    'component',
    'es7-class-separate-export.jsx',
    'es7-class-separate-export.d.ts'
  );
});
test('Parsing should create definition from stateless function component', (t) => {
  compare(t, 'component', 'stateless.jsx', 'stateless.d.ts');
});
test('Parsing should create definition from class extending Component', (t) => {
  compare(
    t,
    'component',
    'import-react-component.jsx',
    'import-react-component.d.ts'
  );
});
test('Parsing should create definition from component exported as an object of components', (t) => {
  compare(
    t,
    'component',
    'multiple-components-object.jsx',
    'multiple-components-object.d.ts'
  );
});
test("Parsing should create definition from default export that's an object of components", (t) => {
  compare(
    t,
    'component',
    'multiple-components-object-default.jsx',
    'multiple-components-object-default.d.ts'
  );
});
test("Parsing should create definition from unnamed default export that's an object of components", (t) => {
  compare(
    t,
    'component',
    'multiple-components-object-unnamed-default.jsx',
    'multiple-components-object-unnamed-default.d.ts'
  );
});
test('Parsing should add dot notation members for component', (t) => {
  compare(
    t,
    'component',
    'multiple-components-dot-notation.jsx',
    'multiple-components-dot-notation.d.ts'
  );
});
test('Parsing should add dot notation members for default export component', (t) => {
  compare(
    t,
    'component',
    'multiple-components-dot-notation-default.jsx',
    'multiple-components-dot-notation-default.d.ts'
  );
});
test('Parsing should create definition from class import PropTypes and instanceOf dependency', (t) => {
  compare(
    t,
    'component',
    'instance-of-proptype-names.jsx',
    'instance-of-proptype-names.d.ts'
  );
});
test('Parsing should create definition from file without propTypes', (t) => {
  compare(
    t,
    'component',
    'component-without-proptypes.jsx',
    'component-without-proptypes.d.ts'
  );
});
test('Parsing should create definition from file with references in propTypes', (t) => {
  compare(
    t,
    'component',
    'references-in-proptypes.jsx',
    'references-in-proptypes.d.ts'
  );
});
test('Parsing should create definition from file with reference as propTypes', (t) => {
  compare(
    t,
    'component',
    'reference-as-proptypes.jsx',
    'reference-as-proptypes.d.ts'
  );
});
test('Parsing should create definition from file with unnamed default export', (t) => {
  compare(
    t,
    'path',
    'unnamed-default-export.jsx',
    'unnamed-default-export.d.ts'
  );
});
test('Parsing should create definition from file with named export specifiers', (t) => {
  compare(
    t,
    'component',
    'named-export-specifiers.jsx',
    'named-export-specifiers.d.ts'
  );
});
test('Parsing should create preact definition', (t) => {
  compare(
    t,
    'path',
    'preact-definition.jsx',
    'preact-definition.d.ts',
    {},
    'preact'
  );
});
test('Parsing should suppport props-types repo', (t) => {
  compare(t, 'path', 'prop-types.jsx', 'prop-types.d.ts', {});
});
test('Parsing should suppport props-types repo (with a default import)', (t) => {
  compare(t, 'path', 'prop-types-default-import.jsx', 'prop-types.d.ts', {});
});
test('Parsing should support an SFC with default export', (t) => {
  compare(
    t,
    'component',
    'stateless-default-export.jsx',
    'stateless-default-export.d.ts'
  );
});
test('Parsing should support an SFC with default export babeled to es6', (t) => {
  compare(
    t,
    'component',
    'stateless-export-as-default.js',
    'stateless-export-as-default.d.ts'
  );
});
test('Parsing should support components that extend PureComponent', (t) => {
  compare(t, 'component', 'pure-component.jsx', 'pure-component.d.ts');
});
test('Parsing should support prop-types as reference to constant', (t) => {
  compare(t, 'component', 'const-as-proptypes.jsx', 'const-as-proptypes.d.ts');
});
test('Parsing should suppport custom eol style', (t) => {
  textDiff(
    t,
    react2dts.generateFromFile(
      'component',
      path.join(basedir, 'pure-component.jsx'),
      { eol: '\n' },
      'react'
    ),
    fs
      .readFileSync(path.join(basedir, 'pure-component.d.ts'))
      .toString()
      .replace('\r\n', '\n')
  );
});
test('Parsing should suppport users to set additional babylon plugins', (t) => {
  compare(t, 'Component', 'babylon-plugin.jsx', 'babylon-plugin.d.ts', {
    babylonPlugins: ['dynamicImport'],
  });
});
