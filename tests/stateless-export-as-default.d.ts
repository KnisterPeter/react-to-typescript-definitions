declare module 'component' {
  import * as React from 'react';
  
  export interface ComponentProps {
    text: string;
    className?: string;
  }

  export default type Component = React.SFC<ComponentProps>;
}
