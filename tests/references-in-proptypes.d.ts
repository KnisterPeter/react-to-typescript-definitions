declare module 'component' {
  import {Component} from 'react';

  export type SomeComponentSomeOneOf = 'foo' | 'bar';

  export interface SomeComponentSomeShape {
    string?: string;
  }

  export interface SomeComponentProps {
    someOneOf?: SomeComponentSomeOneOf;
    someShape?: SomeComponentSomeShape;
  }

  export default class SomeComponent extends Component<SomeComponentProps, any> {
  }
}
