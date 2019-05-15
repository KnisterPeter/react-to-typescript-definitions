declare module 'component' {
  import * as React from 'react';

  export type ButtonButtonSize = "sm" | "md" | "lg";

  export interface ButtonProps {
    buttonSize?: ButtonButtonSize;
  }

  const Button: React.FC<ButtonProps>;

  export default Button;

}
