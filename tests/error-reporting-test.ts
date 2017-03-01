import test from 'ava';

import * as react2dts from '../src/index';

const orignalConsoleError = console.error;

test.beforeEach(t => {
  console.error = function(): void {
    const args = Array.prototype.slice.call(arguments);
    if (!t.context.args) {
      t.context.args = [];
    }
    t.context.args.push(args);
  };
});

test.afterEach(() => {
  console.error = orignalConsoleError;
});

test('In case of error during shape type inference the error information should be retained', t => {
  react2dts.generateFromSource(null, `
    import React from 'react';

    export class Component extends React.Component {
      static propTypes = {
        someShape: React.PropTypes.shape(shape)
      };
    }
  `);
  const args = t.context.args.reduce((akku: any[], args: any[]) => [...akku, ...args], []);
  const idx = args.indexOf('Line 6:     someShape: React.PropTypes.shape(shape)');
  t.is(idx, 1);
});

test('In case of error during enum type inference the error information should be retained', t => {
  react2dts.generateFromSource(null, `
    import React from 'react';

    export class Component extends React.Component {
      static propTypes = {
        list: React.PropTypes.oneOf(list)
      };
    }
  `);
  const args = t.context.args.reduce((akku: any[], args: any[]) => [...akku, ...args], []);
  const idx = args.indexOf('Line 6:     list: React.PropTypes.oneOf(list)');
  t.is(idx, 1);
});

test('In case of error during enum value creation inference the error information should be retained', t => {
  react2dts.generateFromSource(null, `
    import React from 'react';

    export class Component extends React.Component {
      static propTypes = {
        list: React.PropTypes.oneOf(Object.keys(object))
      };
    }
  `);
  const args = t.context.args.reduce((akku: any[], args: any[]) => [...akku, ...args], []);
  const idx = args.indexOf('Line 6:     list: React.PropTypes.oneOf(Object.keys(object))');
  t.is(idx, 1);
});

test('In case of error during shape type inference the error information should be retained', t => {
  react2dts.generateFromSource(null, `
    import React from 'react';

    export class Component extends React.Component {
      static propTypes = {
        shape: React.PropTypes.shape(some.shape)
      };
    }
  `);
  const args = t.context.args.reduce((akku: any[], args: any[]) => [...akku, ...args], []);
  const idx = args.indexOf('Line 6:     shape: React.PropTypes.shape(some.shape)');
  t.is(idx, 1);
});
