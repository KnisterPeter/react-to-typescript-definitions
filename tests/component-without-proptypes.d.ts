declare module 'component' {
  import {Component} from 'react';

  export interface TestProps {
  }

  export default class Test extends Component<TestProps, any> {
    render(): JSX.Element;
  }

  export type test = React.SFC;
}
