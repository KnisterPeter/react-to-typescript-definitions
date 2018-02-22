declare module 'path' {
  import * as React from 'preact';

  export interface SomeComponentProps {
    onClick?: (...args: any[]) => any;
  }

  export class SomeComponent extends React.Component<SomeComponentProps, any> {
    render(): JSX.Element;
  }
}
