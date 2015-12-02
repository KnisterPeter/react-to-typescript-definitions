declare module 'simple-component' {
	import * as React from 'react';

	interface Props {
		number?: number;
		string?: string;
		array?: any[];
		bool?: boolean;
		func?: (...args: any[]) => any;
		object?: Object;
	}

	export default class SimpleComponent extends React.Component<Props, any> {
	}
}
