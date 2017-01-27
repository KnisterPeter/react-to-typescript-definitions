declare module 'component' {
    import * as React from 'react';
    export interface ComponentProps {
        optionalAny?: any;
    }
    export default class Component extends React.Component<ComponentProps, any>{
    }
}
