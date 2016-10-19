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
    optionalUnion?: string | number;
    optionalArrayOf?: number[];
    requiredFunc: (...args: any[])=>any;
    requiredAny: any;
    requiredUnion: any[] | boolean;
    requiredArrayOf: string[];
}
export default class Component extends React.Component<ComponentProps, any>{
}
