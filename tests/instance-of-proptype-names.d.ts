declare module 'component' {
  import {Component} from 'react';
  import Member from './member';

  export interface TestProps {
    test?: Member;
  }

  export class Test extends Component<TestProps, any> {
    render(): JSX.Element;
  }
}
