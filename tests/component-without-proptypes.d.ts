declare module 'component' {
  import * as React from 'react';

  export interface TestProps {
  }

  export default class Test extends React.Component<TestProps, any> {
    render(): JSX.Element;
  }

  export const test: React.SFC;
}
