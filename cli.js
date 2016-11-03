#!/usr/bin/env node
var react2dts = require('./dist/src/index');
var meow = require('meow');

const cli = meow(`
  Usage
    $ react2dts [--module-name <name> | --top-level-module]

  react2dts reads from stdin to process a file.

  Options
    --module-name, --name  name of the module to create
    --top-level-module     if the created module should live in top-level

  Examples
    $ cat <some/react/component.jsx> |react2dts --module-name module-name

    $ cat <some/react/component.jsx> |react2dts --top-level-module
`, {
  alias: {
    'module-name': 'name'
  }
});
if (Object.keys(cli.flags).length === 0) {
  cli.showHelp(1);
}

react2dts.cli(cli.flags);
