import React from 'react';

const FOO = 'foo';
const BAR = 'bar';
const fooOrBar = ['foo', 'bar'];
const fooOrBarWithConsts = [FOO, BAR];
const shape = { string: React.PropTypes.string };

export default class SomeComponent extends React.Component {
   static propTypes = {
     someOneOf: React.PropTypes.oneOf(fooOrBar),
     anotherOneOf: React.PropTypes.oneOf(fooOrBarWithConsts),
     someShape: React.PropTypes.shape(shape)
   };
}
