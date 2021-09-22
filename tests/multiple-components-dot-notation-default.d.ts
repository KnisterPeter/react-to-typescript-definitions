declare module 'component' {
  import * as React from 'react';

  export interface ComponentProps {
      optionalAny?: any;
  }

  const Component: React.FC<ComponentProps> & {
    OtherComponent: typeof Component2;
    AnotherComponent: typeof Component3;
  };

  export default Component;

  export interface Component2Props {
      optionalString?: string;
  }

  const Component2: React.FC<Component2Props>;

  const Component3: React.FC;

}
