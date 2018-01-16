declare module 'component' {
  import {Component} from 'react';
  import Message from './path/to/Message';

  export type ComponentOptionalUnion = string | number;

  export type ComponentRequiredUnion = any[] | boolean;

  export interface ComponentProps {
    /**
     * This is a jsdoc comment for optionalAny.
     */
    optionalAny?: any;
    optionalArray?: any[];
    optionalBool?: boolean;
    optionalFunc?: (...args: any[]) => any;
    optionalNumber?: number;
    optionalObject?: Object;
    optionalString?: string;
    optionalNode?: React.ReactNode;
    optionalElement?: React.ReactElement<any>;
    optionalMessage?: Message;
    optionalUnion?: ComponentOptionalUnion;
    optionalArrayOf?: number[];
    requiredFunc: (...args: any[]) => any;
    requiredAny: any;
    requiredUnion: ComponentRequiredUnion;
    requiredArrayOf: string[];
  }

  export default class Component extends Component<ComponentProps, any> {
    render(): JSX.Element;
  }
}
