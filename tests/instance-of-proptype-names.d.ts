declare module 'component' {
  import {Component} from 'react';
  import Member from './member';

  export interface TestProps {
    test?: typeof Member;
  }

  export class Test extends Component<TestProps, any> {
    render(): JSX.Element;
  }
}
