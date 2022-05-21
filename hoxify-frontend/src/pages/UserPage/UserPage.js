import React from "react";
import * as apiCalls from '../../api/apiCalls'
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import NotFoundAlert from "../../components/NotFoundAlert/NotFoundAlert";
import Spinner from "../../components/Spinner/Spinner";
import {connect} from "react-redux";

class UserPage extends React.Component {

    state = {
        user: undefined,
        userNotFound: false,
        isLoadingUser: true
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
            userNotFound: false,
            isLoadingUser: true
        })
        apiCalls.getUser(username)
            .then((response) => {
                this.setState({
                    user: response.data,
                    isLoadingUser: false
                })
            })
            .catch(error => {
                this.setState({
                    userNotFound: true,
                    isLoadingUser: false
                })
            })
    }

    render() {
        let pageContent
        const isEditable = this.props.loggedInUser.username === this.props.match.params.username

        if (this.state.userNotFound) pageContent = <NotFoundAlert alertMessage={"User not found"}/>
        if (this.state.isLoadingUser) pageContent = <Spinner/>
        if (this.state.user) pageContent = <ProfileCard user={this.state.user} isEditable={isEditable}/>

        return (
            <div data-testid="userpage">
                {pageContent}
            </div>
        )
    }
}

UserPage.defaultProps = {
    match: {
        params: {}
    }
}

const mapStateToProps = (state) => {
    return {
        loggedInUser : state
    }
}

export default connect(mapStateToProps)(UserPage)