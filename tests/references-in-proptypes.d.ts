declare module 'component' {
    import * as React from 'react';
    export interface SomeComponentProps {
        someEnum?: 'foo' | 'bar';
    }
    export default class SomeComponent extends React.Component<SomeComponentProps, any>{
    }
}
