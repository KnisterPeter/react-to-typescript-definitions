declare module 'component' {
  import {Component} from 'react';

  export type SomeComponentSomeOneOf = "foo" | "bar";
  export type SomeComponentAnotherOneOf = "foo" | "bar";

  export interface SomeComponentSomeShape {
    string?: string;
  }

  export interface SomeComponentProps {
    someOneOf?: SomeComponentSomeOneOf;
    anotherOneOf?: SomeComponentAnotherOneOf;
    someShape?: SomeComponentSomeShape;
  }

  export default class SomeComponent extends Component<SomeComponentProps, any> {
    render(): JSX.Element;
  }
}
