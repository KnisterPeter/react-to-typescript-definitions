declare namespace Minimist {	
	export function minimist(args: string[], options: any): any;
}
declare module 'minimist' {
	export = Minimist.minimist;
}
