# react-to-typescript-definitions

[![GitHub license](https://img.shields.io/github/license/KnisterPeter/react-to-typescript-definitions.svg)]()
[![Travis](https://img.shields.io/travis/KnisterPeter/react-to-typescript-definitions.svg)]()
[![David](https://img.shields.io/david/KnisterPeter/react-to-typescript-definitions.svg)]()
[![David](https://img.shields.io/david/dev/KnisterPeter/react-to-typescript-definitions.svg)]()
[![npm](https://img.shields.io/npm/v/react-to-typescript-definitions.svg)]()
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
