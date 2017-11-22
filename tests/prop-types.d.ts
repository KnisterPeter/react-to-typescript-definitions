declare module 'path' {
  import {Component} from 'react';

  export interface Props {
    optionalString?: string;
  }

  export default class extends Component<Props, any> {
    render(): JSX.Element;
  }
}
