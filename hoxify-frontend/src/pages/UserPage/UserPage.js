import React from "react";
import * as apiCalls from '../../api/apiCalls'
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import NotFoundAlert from "../../components/NotFoundAlert/NotFoundAlert";

class UserPage extends React.Component {

    state = {
        user: undefined,
        userNotFound: false
    }

    componentDidMount() {
       this.loadUser()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.username !== this.props.match.params.username) {
            this.loadUser()
        }
    }

    loadUser = () => {
        const username = this.props.match.params.username
        if (!username) {
            return
        }
        this.setState({
            userNotFound: false
        })
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
        const userDetails = this.state.user && <ProfileCard user={this.state.user}/>
        const userNotFoundAlert = this.state.userNotFound && <NotFoundAlert alertMessage={"User not found"}/>

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