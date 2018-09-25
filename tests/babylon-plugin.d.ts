declare module 'Component' {
  import * as React from 'react';

  export interface ComponentProps {
  }

  export default class Component extends React.Component<ComponentProps, any> {
    render(): JSX.Element;

  }

}
