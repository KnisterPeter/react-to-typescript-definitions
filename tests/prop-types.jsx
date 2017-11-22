import {Component} from 'react';
import * as PropTypes from 'prop-types';

export default class extends Component {

    static propTypes = {
      optionalString: PropTypes.string
    };

    render() {
        return (
            <div></div>
        );
    }
}
