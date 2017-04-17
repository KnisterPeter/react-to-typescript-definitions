import React from 'react';

class SomeInternalComponent extends React.Component {
   static propTypes = {
     someString: React.PropTypes.string
   };
}

export default class SomeComponent extends React.Component {
   static propTypes = SomeInternalComponent.propTypes;
}
