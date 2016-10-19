import { assert } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import * as react2dts from '../index';
import { Generator } from '../index';

describe('Parsing', () => {
  it('should create definition from es6 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (name: string): string => './path/to/Message'
    };
    assert.equal(
      react2dts.generateFromFile('component', path.join(__dirname, 'es6-class.jsx'), opts),
      fs.readFileSync(path.join(__dirname, 'es6-class.d.ts')).toString()
    );
  });
  it('should create definition from es7 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (name: string): string => './path/to/Message'
    };
    assert.equal(
      react2dts.generateFromFile('component', path.join(__dirname, 'es7-class.jsx'), opts),
      fs.readFileSync(path.join(__dirname, 'es7-class.d.ts')).toString()
    );
  });
  it('should create top-level module definition from es7 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (name: string): string => './path/to/Message'
    };
    assert.equal(
      react2dts.generateFromFile(null, path.join(__dirname, 'es7-class.jsx'), opts),
      fs.readFileSync(path.join(__dirname, 'es7-class-top-level-module.d.ts')).toString()
    );
  });
  it('should create definition from babeled es7 class component', () => {
    const opts: react2dts.IOptions = {
      instanceOfResolver: (name: string): string => './path/to/Message'
    };
    assert.equal(
      react2dts.generateFromFile('component', path.join(__dirname, 'es7-class-babeled.js'), opts),
      fs.readFileSync(path.join(__dirname, 'es7-class.d.ts')).toString()
    );
  });
  it('should create definition using generator', () => {
    let generator: Generator = new Generator();
    const opts: react2dts.IOptions = {
      instanceOfResolver: (name: string): string => './path/to/Message',
      generator: generator
    };
    generator.declareModule('component', () => {
      react2dts.generateFromFile(null, path.join(__dirname, 'es6-class.jsx'), opts)
    });
    assert.equal(
      generator.toString(),
      fs.readFileSync(path.join(__dirname, 'es6-class.d.ts')).toString()
    );
  });
});
