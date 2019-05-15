declare module 'component' {
  import * as React from 'react';

  export interface ComponentProps {
    optionalString?: string;
  }

  const Component: React.FC<ComponentProps>;
  export default Component;

  export const Component2: React.FC;
}
