# react-to-typescript-definitions

[![GitHub license][license-image]][license-link]
[![npm][npm-image]][npm-link]
[![Travis][ci-image]][ci-link]
[![codecov](https://codecov.io/gh/KnisterPeter/react-to-typescript-definitions/branch/master/graph/badge.svg)](https://codecov.io/gh/KnisterPeter/react-to-typescript-definitions)[![Commitizen friendly][commitizen-image]][commitizen-link]
[![Standard Version][standard-version-image]][standard-version-link]
[![renovate badge](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)

Create typescript definitions files (d.ts) from react components.

## Features

- ES6 and ES7 class syntax
- Most PropTypes
  - any, array, bool, func, number, object, string, node, element, oneOfType, arrayOf, symbol, shape
- Partial support for oneOf PropType
- required PropTypes
- instanceOf PropTypes (when using API and giving a resolve function)
- jsdoc

## Usage

### Installation

Install as npm package:

```sh
npm install react-to-typescript-definitions --save-dev
```

or

```sh
npm install -g react-to-typescript-definitions
```

### CLI

```sh
Usage
  $ react2dts [--module-name <name> | --top-level-module]

react2dts reads from stdin to process a file.

Options
  --module-name, --name  name of the module to create
  --top-level-module     if the created module should live in top-level

Examples
  $ cat <some/react/component.jsx> |react2dts --module-name module-name

  $ cat <some/react/component.jsx> |react2dts --top-level-module
```

### API

Functions:

```js
/**
 * Returns the typescript definition for the given file.
 *
 * @param name The name of the generated module
 * @param path The path to the file to parse
 * @param options The options to use
 * @return The type definition as string
 */
function generateFromFile(name, path, options)
```

```js
/**
 * Returns the typescript definition for the given source.
 *
 * @param name The name of the generated module
 * @param code The code to parse
 * @param options The options to use
 * @return The type definition as string
 */
function generateFromSource(name, code, options)
```

```js
/**
 * Returns the typescript definition for the given babylon AST object.
 *
 * @param name The name of the generated module
 * @param ast The babylon ASt to parse
 * @param options The options to use
 * @return The type definition as string
 */
function generateFromAst(name, ast, options)
```

Options:

- instanceOfResolver  
  A function which gets a type name (as string) and should return the path
  to the file defining the type or undefined if the type is not resolvable.
  This function is required to generate instanceOf PropTypes.

[license-image]: https://img.shields.io/github/license/KnisterPeter/react-to-typescript-definitions.svg
[license-link]: https://github.com/KnisterPeter/react-to-typescript-definitions
[npm-image]: https://img.shields.io/npm/v/react-to-typescript-definitions.svg
[npm-link]: https://www.npmjs.com/package/react-to-typescript-definitions
[ci-image]: https://img.shields.io/travis/KnisterPeter/react-to-typescript-definitions.svg
[ci-link]: https://travis-ci.org/KnisterPeter/react-to-typescript-definitions
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-link]: http://commitizen.github.io/cz-cli/
[standard-version-image]: https://img.shields.io/badge/release-standard%20version-brightgreen.svg
[standard-version-link]: https://github.com/conventional-changelog/standard-version
