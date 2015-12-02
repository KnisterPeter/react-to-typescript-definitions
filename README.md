# react-to-typescript-definitions

[![GitHub license](https://img.shields.io/github/license/KnisterPeter/react-to-typescript-definitions.svg)](https://github.com/KnisterPeter/react-to-typescript-definitions)
[![Build Status](https://api.travis-ci.org/KnisterPeter/react-to-typescript-definitions.svg)](https://travis-ci.org/KnisterPeter/react-to-typescript-definitions)
[![Dependency Status](https://david-dm.org/KnisterPeter/react-to-typescript-definitions.svg)](https://david-dm.org/KnisterPeter/react-to-typescript-definitions)
[![devDependency Status](https://david-dm.org/KnisterPeter/react-to-typescript-definitions/dev-status.svg)](https://david-dm.org/KnisterPeter/react-to-typescript-definitions#info=devDependencies)
[![npm version](https://img.shields.io/npm/v/react-to-typescript-definitions.svg)](https://www.npmjs.com/package/react-to-typescript-definitions)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Create typescript definitions files (d.ts) from react components.

# Usage

## Installation
Install as npm package:

```sh
npm install react-to-typescript-definitions --save-dev
```

## API

```js
import * as react2dts from 'react-to-typescript-definitions';

// react2dts.generate('<module-name>', '<path/to/react-component>');
react2dts.generate('component', path.join(__dirname, 'component.jsx'));

```
