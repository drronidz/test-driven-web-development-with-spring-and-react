import React, {Component} from 'react';
import ProfileAvatar from "../ProfileImage/ProfileAvatar";
import { connect } from 'react-redux'

class HoxSubmit extends Component {
    render() {
        return (
            <div className="card d-flex flex-row p-1">
                <ProfileAvatar
                    className="rounded-circle m-1"
                    width="32"
                    height="32"
                    image={this.props.loggedInUser.image}
                />
                <div className="flex-fill">
                    <textarea className="form-control w-100" rows={1}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state
    }
}

export default connect(mapStateToProps)(HoxSubmit);