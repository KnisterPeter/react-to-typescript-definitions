#!/usr/bin/env node
var react2dts = require('./index');
var minimist = require('minimist');

var options = minimist(process.argv.slice(2), {
  string: ['name', 'module-name'],
  boolean: ['top-level-module'],
  alias: {
    'module-name': 'name'
  }
});

react2dts.cli(options);
