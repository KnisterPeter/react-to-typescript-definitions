declare module 'component' {
    import * as React from 'react';

    import Message from './path/to/Message';

    export type ComponentOptionalEnum = 'News' | 'Photos' | 1 | 2;

    export type ComponentOptionalUnion = string | number;

    export interface ComponentOptionalObjectWithShape {
        color?: string;
        fontSize?: number;
    }

    export type ComponentRequiredUnion = any[] | boolean;

    export interface ComponentProps {
        /**
         * This is a jsdoc comment for optionalAny.
         */
        optionalAny?: any;
        optionalArray?: any[];
        optionalBool?: boolean;
        optionalFunc?: (...args: any[])=>any;
        optionalNumber?: number;
        optionalObject?: Object;
        optionalString?: string;
        optionalNode?: React.ReactNode;
        optionalElement?: React.ReactElement<any>;
        optionalMessage?: typeof Message;
        optionalEnum?: ComponentOptionalEnum;
        optionalUnion?: ComponentOptionalUnion;
        optionalArrayOf?: number[];
        optionalObjectWithShape?: ComponentOptionalObjectWithShape;
        requiredFunc: (...args: any[])=>any;
        requiredAny: any;
        requiredUnion: ComponentRequiredUnion;
        requiredArrayOf: string[];
        requiredArrayOfObjectsWithShape: {
            color?: string;
            fontSize?: number;
        }[];
        requiredSymbol: typeof Symbol;
    }

    export class Component extends React.Component<ComponentProps, any> {
    }

}

