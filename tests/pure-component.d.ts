declare module 'component' {
  import {PureComponent} from 'react';

  export interface Props {
    optionalString?: string;
  }

  export default class extends PureComponent<Props, any> {
    render(): JSX.Element;
  }
}
