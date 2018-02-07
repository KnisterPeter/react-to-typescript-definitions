import {PureComponent} from 'react';
import * as PropTypes from 'prop-types';

export default class extends PureComponent {

    static propTypes = {
      optionalString: PropTypes.string
    };

    render() {
        return (
            <div></div>
        );
    }
}
