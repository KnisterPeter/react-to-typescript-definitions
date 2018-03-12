import * as React from 'react';

export default function Component({optionalString}) {
  return <div />;
}

Component.propTypes = {
  optionalString: React.PropTypes.string,
};

export const Component2 = () => <div />;
