declare module 'component' {
    import * as React from 'react';

    export interface Component2Props {
        optionalString?: string;
    }

    export const Component2: React.FC<Component2Props>;

    export interface ComponentProps {
        optionalAny?: any;
    }

    const Component: React.FC<ComponentProps>;

    const _default: {
        Component: typeof Component;
        Asdf: typeof Component2;
    };

    export default _default;

}
