/// <reference types="react" />
declare module 'component' {
  export interface ComponentProps {
    optionalAny?: any;
  }

  export type Component = React.SFC<ComponentProps>;

  export type Component2 = React.SFC;
}
