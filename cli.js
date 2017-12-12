#!/usr/bin/env node
var react2dts = require('./dist/src/index');
var meow = require('meow');

const cli = meow(`
  Usage
    $ react2dts [--module-name <name> | --top-level-module] [--react-import <name>] [--file <path>]

  react2dts reads from stdin to process a file.

  Options
    --module-name, --name  name of the module to create
    --top-level-module     if the created module should live in top-level
    --react-import         name of the react-like library to import (default to react)
    --file                 the file to process instead of reading from stdin

  Examples
    $ cat <some/react/component.jsx> |react2dts --module-name module-name

    $ cat <some/react/component.jsx> |react2dts --top-level-module

    $ react2dts --top-level-module --file <some/react/component.jsx>
    `, {
  flags: {
    'module-name': {
      type: 'string',
      alias: 'name'
    },
    'top-level-module': {
      type: 'string'
    },
    'react-import': {
      type: 'string',
      default: 'react'
    },
    'file': {
      type: 'string'
    }
  }
});
if (Object.keys(cli.flags).length === 0) {
  cli.showHelp(1);
}

react2dts.cli(cli.flags);
