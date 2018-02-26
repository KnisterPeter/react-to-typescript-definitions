declare module 'component' {
  import {Component} from 'react';

  export interface ParentComponentProps {
  }

  export class ParentComponent extends Component<ParentComponentProps, any> {
    render(): JSX.Element;
  }

  export interface ChildComponentProps {
  }

  export class ChildComponent extends ParentComponent {
      render(): JSX.Element;
  }
}
