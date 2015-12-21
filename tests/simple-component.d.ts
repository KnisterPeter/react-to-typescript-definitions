declare module 'simple-component' {
	import * as React from 'react';

	interface SimpleComponentProps {
		key?: any;
		optionalAny?: any;
		optionalArray?: any[];
		optionalBool?: boolean;
		optionalFunc?: (...args: any[]) => any;
		optionalNumber?: number;
		optionalObject?: Object;
		optionalString?: string;
		optionalNode?: React.ReactNode;
		optionalElement?: React.ReactElement<any>;
		requiredFunc: (...args: any[]) => any;
		requiredAny: any;
	}

	export default class SimpleComponent extends React.Component<SimpleComponentProps, any> {
	}
}
