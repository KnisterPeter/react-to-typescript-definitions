declare module 'component' {
  import * as React from 'react';

  import Message from './path/to/Message';

  export type MyComponentOptionalEnum = "News" | "Photos" | 1 | 2;

  export type MyComponentOptionalUnion = string | number;

  export interface MyComponentOptionalObjectWithShape {
    color?: string;
    fontSize?: number;
  }

  export type MyComponentRequiredUnion = any[] | boolean;

  export interface MyComponentRequiredArrayOfObjectsWithShape {
    color?: string;
    fontSize?: number;
  }

  export interface MyComponentDeeplyNested {
    arrayInDeeplyNested?: {
      foo?: number;
    }[];
  }

  export interface MyComponentProps {
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
    optionalEnum?: MyComponentOptionalEnum;
    optionalUnion?: MyComponentOptionalUnion;
    optionalArrayOf?: number[];
    optionalObjectWithShape?: MyComponentOptionalObjectWithShape;
    requiredFunc: (...args: any[]) => any;
    requiredAny: any;
    requiredUnion: MyComponentRequiredUnion;
    requiredArrayOf: string[];
    requiredArrayOfObjectsWithShape: MyComponentRequiredArrayOfObjectsWithShape[];
    deeplyNested: MyComponentDeeplyNested[];
    requiredSymbol: Symbol;
  }

  export class MyComponent extends React.Component<MyComponentProps, any> {
    render(): JSX.Element;
  }
}
