declare module 'component' {
  import * as React from 'react';
  import Member from './member';

  export interface TestProps {
    test?: Member;
  }

  export class Test extends React.Component<TestProps, any> {
    render(): JSX.Element;
  }
}
