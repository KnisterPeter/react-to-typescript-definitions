declare module 'component' {
  import 'react';

  export interface ComponentProps {
    text: string;
    className?: string;
  }

  export default function Component(props: ComponentProps): JSX.Element;
}
