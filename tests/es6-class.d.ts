declare module 'component' {
  import {Component} from 'react';

  import Message from './path/to/Message';

  export type ComponentOptionalEnum = "News" | "Photos" | 1 | 2;

  export type ComponentOptionalUnion = string | number;

  export interface ComponentOptionalObjectWithShape {
    color?: string;
    fontSize?: number;
  }

  export type ComponentRequiredUnion = ((...args: any[])=>any) | boolean;

  export interface ComponentRequiredArrayOfObjectsWithShape {
    color?: string;
    fontSize?: number;
  }

  export interface ComponentDeeplyNested {
    arrayInDeeplyNested?: {
      foo?: number;
    }[];
  }

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
    optionalEnum?: ComponentOptionalEnum;
    optionalUnion?: ComponentOptionalUnion;
    optionalArrayOf?: number[];
    optionalObjectWithShape?: ComponentOptionalObjectWithShape;
    requiredFunc: (...args: any[]) => any;
    requiredAny: any;
    requiredUnion: ComponentRequiredUnion;
    requiredArrayOf: string[];
    requiredArrayOfObjectsWithShape: ComponentRequiredArrayOfObjectsWithShape[];
    deeplyNested: ComponentDeeplyNested[];
    requiredSymbol: Symbol;
  }

  export class Component extends Component<ComponentProps, any> {
    render(): JSX.Element;
  }
}
