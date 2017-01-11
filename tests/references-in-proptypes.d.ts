declare module 'component' {
    import * as React from 'react';
    export type SomeComponentSomeOneOf = 'foo' | 'bar';
    export interface SomeComponentSomeShape {
        string?: string;
    }
    export interface SomeComponentProps {
        someOneOf?: SomeComponentSomeOneOf;
        someShape?: SomeComponentSomeShape;
    }
    export default class SomeComponent extends React.Component<SomeComponentProps, any>{
    }
}
