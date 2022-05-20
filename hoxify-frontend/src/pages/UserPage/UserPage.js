import React from "react";
import * as apiCalls from '../../api/apiCalls'

class UserPage extends React.Component {

    state = {
        user: undefined,
        userNotFound: false
    }

    componentDidMount() {
        const username = this.props.match.params.username
        if (!username) {
           return
        }
        apiCalls.getUser(username)
            .then((response) => {
                this.setState({
                    user: response.data
                })
            })
            .catch(error => {
                this.setState({
                    userNotFound: true
                })
            })
    }

    render() {
        const userDetails = this.state.user &&
            <span>
                {`${this.state.user.displayName}@${this.state.user.username}`}
            </span>

        const userNotFoundAlert = this.state.userNotFound &&
            <div className="alert alert-danger text-center">
                <div className="alert-heading">
                    <i className="fas fa-exclamation-triangle fa-3x"/>
                </div>
                <h5>User not found</h5>
            </div>

        return (
            <div data-testid="userpage">
                {userDetails}
                {userNotFoundAlert}
            </div>)
    }
}

UserPage.defaultProps = {
    match: {
        params: {}
    }
}

export default UserPage