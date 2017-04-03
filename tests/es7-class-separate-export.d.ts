declare module 'component' {
  import {Component} from 'react';

  export interface ComponentProps {
    optionalAny?: any;
  }

  export default class Component extends Component<ComponentProps, any> {
  }
}
