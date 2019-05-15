declare module 'component' {
  import * as React from 'react';

  export interface ComponentProps {
    text: string;
    className?: string;
  }

  const Component: React.FC<ComponentProps>;
  export default Component;
}
