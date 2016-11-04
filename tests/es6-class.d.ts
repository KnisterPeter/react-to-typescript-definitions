declare module 'component' {
    import * as React from 'react';
    import Message from './path/to/Message';
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
        optionalEnum?: 'News' | 'Photos' | 1 | 2;
        optionalUnion?: string | number;
        optionalArrayOf?: number[];
        optionalObjectWithShape?: {
            color?: string;
            fontSize?: number;
        };
        requiredFunc: (...args: any[])=>any;
        requiredAny: any;
        requiredUnion: any[] | boolean;
        requiredArrayOf: string[];
        requiredSymbol: typeof Symbol;
    }
    export class Component extends React.Component<ComponentProps, any>{
    }
}
