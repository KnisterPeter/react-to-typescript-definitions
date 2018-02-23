declare module 'path' {
  import * as React from 'react';

  export interface Props {
    onClick?: (...args: any[]) => any;
  }

  export default class extends React.Component<Props, any> {
    render(): JSX.Element;
  }
}
