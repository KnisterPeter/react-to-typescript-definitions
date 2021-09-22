declare module 'component' {
  import * as React from 'react';

  export interface ComponentProps {
      optionalAny?: any;
  }

  const Component: React.FC<ComponentProps> & {
    OtherComponent: typeof ComponentX;
  };

  export default Component;

  export interface ComponentXProps {
      optionalString?: string;
  }

  const ComponentX: React.FC<ComponentXProps>;

}
