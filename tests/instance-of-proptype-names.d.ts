declare module 'component' {
    import * as React from 'react';
    import Member from './member';
    export interface TestProps {
        test?: typeof Member;
    }
    export class Test extends React.Component<TestProps, any>{
    }
}
