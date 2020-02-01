// tslint:disable:no-implicit-dependencies
import test, { ExecutionContext } from 'ava';
import stripAnsi from 'strip-ansi';
import * as react2dts from '../src/index';

type Args = {args: any[]};
const originalConsoleError = console.error;

test.beforeEach((t: ExecutionContext<Args>) => {
  console.error = function(...args: any[]): void {
    if (!t.context.args) {
      t.context.args = [];
    }
    t.context.args.push(args);
  };
});

test.afterEach(() => {
  console.error = originalConsoleError;
});

test.serial('In case of error during shape type inference (direct reference) the error information should be retained',
    (t: ExecutionContext<Args>) => {
  react2dts.generateFromSource(null, `
    import React from 'react';

    export class Component extends React.Component {
      static propTypes = {
        someShape: React.PropTypes.shape(shape)
      };
    }
  `);
  const args = t.context.args.reduce((akku: any[], args: any[]) => [...akku, ...args], []);
  t.is(stripAnsi(args[2]), 'Line 6:         someShape: React.PropTypes.shape(shape)');
});

test.serial('In case of error during enum type inference the error information should be retained',
    (t: ExecutionContext<Args>) => {
  react2dts.generateFromSource(null, `
    import React from 'react';

    export class Component extends React.Component {
      static propTypes = {
        list: React.PropTypes.oneOf(list)
      };
    }
  `);
  const args = t.context.args.reduce((akku: any[], args: any[]) => [...akku, ...args], []);
  t.is(stripAnsi(args[2]), 'Line 6:         list: React.PropTypes.oneOf(list)');
});

test.serial('In case of error during enum value creation inference the error information should be retained',
    (t: ExecutionContext<Args>) => {
  react2dts.generateFromSource(null, `
    import React from 'react';

    export class Component extends React.Component {
      static propTypes = {
        list: React.PropTypes.oneOf(Object.keys(object))
      };
    }
  `);
  const args = t.context.args.reduce((akku: any[], args: any[]) => [...akku, ...args], []);
  t.is(stripAnsi(args[2]), 'Line 6:         list: React.PropTypes.oneOf(Object.keys(object))');
});

test.serial('In case of error during shape type inference (indirect reference) the error information should be retained',
    (t: ExecutionContext<Args>) => {
  react2dts.generateFromSource(null, `
    import React from 'react';

    export class Component extends React.Component {
      static propTypes = {
        shape: React.PropTypes.shape(some.shape)
      };
    }
  `);
  const args = t.context.args.reduce((akku: any[], args: any[]) => [...akku, ...args], []);
  t.is(stripAnsi(args[2]), 'Line 6:         shape: React.PropTypes.shape(some.shape)');
});
