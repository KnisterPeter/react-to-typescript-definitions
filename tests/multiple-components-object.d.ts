declare module 'component' {
  import * as React from 'react';

  export interface ComponentProps {
    optionalAny?: any;
  }

  const Component: React.FC<ComponentProps>;

  export interface Component2Props {
    optionalString?: string;
  }

  const Component2: React.FC<Component2Props>;

  export const Composed: {
    Component: typeof Component;
    Component2: typeof Component2;
  };
}
