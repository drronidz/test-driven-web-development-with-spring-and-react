import React, {Component} from 'react';
import * as apiCalls from '../../api/apiCalls'

class HoxFeed extends Component {
    componentDidMount() {
        apiCalls.loadHoxes(this.props.user)
    }

    render() {
        return (
            <div className="card card-header text-center">
                There are no hoxes
            </div>
        );
    }
}

export default HoxFeed;