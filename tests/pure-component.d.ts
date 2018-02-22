declare module 'component' {
  import * as React from 'react';

  export interface Props {
    optionalString?: string;
  }

  export default class extends React.PureComponent<Props, any> {
    render(): JSX.Element;
  }
}
