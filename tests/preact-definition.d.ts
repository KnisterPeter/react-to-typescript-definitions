declare module 'path' {
  import {Component} from 'preact';

  export interface SomeComponentProps {
    onClick?: (...args: any[]) => any;
  }

  export class SomeComponent extends Component<SomeComponentProps, any> {
    render(): JSX.Element;
  }
}
