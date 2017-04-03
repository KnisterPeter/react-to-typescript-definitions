import {Component, PropTypes} from 'react';

export class SomeComponent extends Component {

    static propTypes = {
        onClick: PropTypes.func
    };

    render() {
        return (
            <div></div>
        );
    }
}
