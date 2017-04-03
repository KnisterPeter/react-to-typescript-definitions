declare module 'path' {
  import {Component} from 'react';

  export interface Props {
        onClick?: (...args: any[]) => any;
  }

  export default class extends Component<Props, any> {
    render(): JSX.Element;
  }
}
