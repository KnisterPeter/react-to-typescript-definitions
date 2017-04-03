declare module 'component' {
  import {Component} from 'react';

  export interface TestProps {
  }

  export default class Test extends Component<TestProps, any> {
  }

  export function test(): JSX.Element;
}
