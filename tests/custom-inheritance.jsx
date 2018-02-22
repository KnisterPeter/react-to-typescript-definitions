import { Component } from 'react';

export class ParentComponent extends Component {
  render() {
    return <div />
  }
}

export class ChildComponent extends ParentComponent {
  render() {
    return <div />
  }
}
