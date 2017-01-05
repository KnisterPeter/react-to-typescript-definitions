import React from 'react';

const fooOrBar = ['foo', 'bar'];
const shape = { string: React.PropTypes.string };

export default class SomeComponent extends React.Component {
   static propTypes = {
     someEnum: React.PropTypes.oneOf(fooOrBar),
     someShape: React.PropTypes.shape(shape)
   };
}
