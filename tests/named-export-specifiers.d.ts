declare module 'component' {
  import * as React from 'react';

  export interface ComponentProps {
    optionalAny?: any;
  }

  export const Component: React.FC<ComponentProps>;

  export const Component2: React.FC;
}
