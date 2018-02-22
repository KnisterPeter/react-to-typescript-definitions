declare module 'path' {
  import * as React from 'react';

  export interface Props {
    optionalString?: string;
  }

  export default class extends React.Component<Props, any> {
    render(): JSX.Element;
  }
}
