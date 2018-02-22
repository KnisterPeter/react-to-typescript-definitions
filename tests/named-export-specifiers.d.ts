declare module 'component' {
  import * as React from 'react';
  
  export interface ComponentProps {
    optionalAny?: any;
  }

  export type Component = React.SFC<ComponentProps>;

  export type Component2 = React.SFC;
}
