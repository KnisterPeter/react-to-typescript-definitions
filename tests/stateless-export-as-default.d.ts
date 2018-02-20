/// <reference types="react" />
declare module 'component' {
  export interface ComponentProps {
    text: string;
    className?: string;
  }

  export default type Component = React.SFC<ComponentProps>;
}
