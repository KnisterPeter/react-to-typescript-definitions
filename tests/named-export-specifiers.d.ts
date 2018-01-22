/// <reference types="react" />
declare module 'component' {
  export interface ComponentProps {
    optionalAny?: any;
  }

  export function Component(props: ComponentProps): JSX.Element;

  export function Component2(): JSX.Element;
}
