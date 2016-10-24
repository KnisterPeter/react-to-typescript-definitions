declare module 'component' {
    export interface ComponentProps {
        optionalAny?: any;
    }
    export function Component(props: ComponentProps): JSX.Element;
}
