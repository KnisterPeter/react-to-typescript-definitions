declare module 'component' {
    import * as React from 'react';
    export interface TestProps {
    }
    export default class Test extends React.Component<TestProps, any>{
    }
    export function test(): JSX.Element;
}
