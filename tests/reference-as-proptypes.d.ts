declare module 'component' {
  import {Component} from 'react';

  export interface SomeComponentProps {
    someString?: string;
  }

  export default class SomeComponent extends Component<SomeComponentProps, any> {
    render(): JSX.Element;
  }
}
