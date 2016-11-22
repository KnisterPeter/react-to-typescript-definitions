import React from 'react';

const fooOrBar = ['foo', 'bar'];

export default class SomeComponent extends React.Component {
   static propTypes = {
     someEnum: React.PropTypes.oneOf(fooOrBar)
   };
}
