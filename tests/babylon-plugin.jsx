import * as React from 'react';

export default class Component extends React.PureComponent {

	render() {
		return <p onClick={() => {
      import('./fake-dialog-box.js')
        .then(dialogBox => {
            dialogBox.open();
        })
        .catch(error => {
            /* Error handling */
        })
    }} />;
	}
}
