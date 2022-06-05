import React from "react";
import * as apiCalls from '../../api/apiCalls'
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import NotFoundAlert from "../../components/NotFoundAlert/NotFoundAlert";
import Spinner from "../../components/Spinner/Spinner";
import {connect} from "react-redux";
import {updateUser} from "../../api/apiCalls";

class UserPage extends React.Component {

    state = {
        user: undefined,
        userNotFound: false,
        isLoadingUser: false,
        inEditMode: false,
        originalDisplayName: undefined,
        pendingUpdateCall: false,
        image: undefined,
        errors: {}
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

    // onClick Handlers
    onClickEditHandler = () => {
        this.setState({
            inEditMode : true
        })
    }

    onClickCancelHandler = () => {
        const user = { ...this.state.user}

        if (this.state.originalDisplayName !== undefined) {
            user.displayName = this.state.originalDisplayName
        }

        this.setState({
            user,
            errors: {},
            inEditMode : false,
            originalDisplayName: undefined,
            image: undefined
        })
    }

    onClickSaveHandler = () => {
        const userId = this.props.loggedInUser.id;
        const userUpdate = {
            displayName: this.state.user.displayName,
            image: this.state.image && this.state.image.split(',')[1]
        }
        this.setState({
            pendingUpdateCall: true
        })
        apiCalls.updateUser(userId, userUpdate)
            .then(response => {
                const user = {...this.state.user}
                user.image = response.data.image
                this.setState({
                    inEditMode: false,
                    originalDisplayName: undefined,
                    pendingUpdateCall: false,
                    user,
                    image: undefined
                },
                    () => {
                    const action = {
                        type: 'update-success',
                        payload: user
                    }
                    this.props.dispatch(action)
                })
            })
            .catch(error => {
                let errors = {}
                if (error.response.data.validationErrors) {
                    errors = error.response.data.validationErrors
                }
                this.setState({
                    pendingUpdateCall: false,
                    errors
                })
            })
    }

    // onChangeHandlers
    onChangeDisplayNameHandler = (event) => {
        const user = { ...this.state.user}
        let originalDisplayName = this.state.originalDisplayName

        if(originalDisplayName === undefined) {
            originalDisplayName = user.displayName
        }

        user.displayName = event.target.value
        const errors = { ...this.state.errors }
        errors.displayName = undefined

        this.setState({
            user,
            originalDisplayName,
            errors
        })
    }

    onFileSelectHandler = (event) => {
        if (event.target.files.length === 0) {
            return
        }
        const errors = { ...this.state.errors }
        errors.image = undefined

        const file = event.target.files[0]
        let reader = new FileReader()
        reader.onloadend = () => {
            this.setState({
                image: reader.result,
                errors
            })
        }
        reader.readAsDataURL(file)
    }

    render() {
        let pageContent
        const isEditable = this.props.loggedInUser.username === this.props.match.params.username

        if (this.state.userNotFound) pageContent = <NotFoundAlert alertMessage={"User not found"}/>
        if (this.state.isLoadingUser) pageContent = <Spinner/>
        if (this.state.user) pageContent =
            <ProfileCard
                user={this.state.user}
                isEditable={isEditable}
                inEditMode={this.state.inEditMode}
                onClickEdit={this.onClickEditHandler}
                onClickCancel={this.onClickCancelHandler}
                onClickSave={this.onClickSaveHandler}
                onChangeDisplayName={this.onChangeDisplayNameHandler}
                pendingUpdateCall={this.state.pendingUpdateCall}
                loadedImage={this.state.image}
                onFileSelect={this.onFileSelectHandler}
                errors={this.state.errors}
            />

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