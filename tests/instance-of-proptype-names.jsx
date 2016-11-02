import React, {PropTypes as p} from 'react';
import Member from './member';

export class Test extends React.Component {
  static propTypes = {
    test: p.instanceOf(Member)
  };
}
