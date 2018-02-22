declare module 'component' {
  import * as React from 'react';

  export interface SomeComponentProps {
    someString?: string;
  }

  export default class SomeComponent extends React.Component<SomeComponentProps, any> {
    render(): JSX.Element;
  }
}
