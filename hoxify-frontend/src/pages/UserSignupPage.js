import React from "react";
import Input from "../components/input/Input";

export class UserSignUpPage extends React.Component{

    state = {
        displayName: '',
        username: '',
        password: '',
        passwordConfirmation:'',
        pendingAPICall: false,
        errors: {}
    }

    onChangeDisplayName = (event) => {
        const value = event.target.value
        this.setState({
            displayName : value
        })
    }

    onChangeUsername = (event) => {
        const value = event.target.value
        this.setState({
            username : value
        })
    }

    onChangePassword = (event) => {
        const value = event.target.value
        this.setState({
            password : value
        })
    }

    onChangePasswordConfirmation = (event) => {
        const value = event.target.value
        this.setState({
            passwordConfirmation : value
        })
    }

    onClickSignUp = () => {
        const user = {
            displayName: this.state.displayName,
            username: this.state.username,
            password: this.state.password,
            passwordConfirmation: this.state.passwordConfirmation
        }

        this.setState({
            pendingAPICall : true
        })

        this.props.actions.postSignUp(user)
            .then((response) => {
                this.setState({
                    pendingAPICall: false
                })
            })
            .catch((apiError) => {
                let errors = { ...this.state.errors }
                if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = { ...apiError.response.data.validationErrors }
                }
                this.setState({
                    pendingAPICall: false,
                    errors: errors
                })
            })
    }



    render() {
        const spinner =
            <div className="spinner-border text-light spinner-border-sm mr-sm-1">
                <span className="sr-only"/>
            </div>

        return (
            <div className="container">
                <h1 className="text-center">Sign Up</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Display Name"
                        placeholder="Your display name"
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                        hasError={this.state.errors.displayName && true}
                        error={this.state.errors.displayName}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Username"
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        hasError={this.state.errors.username && true}
                        error={this.state.errors.username}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Your password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        hasError={this.state.errors.password && true}
                        error={this.state.errors.password}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password Confirmation"
                        type="password"
                        placeholder="Your password confirmation"
                        value={this.state.passwordConfirmation}
                        onChange={this.onChangePasswordConfirmation}
                        hasError={this.state.errors.passwordConfirmation && true}
                        error={this.state.errors.passwordConfirmation}
                    />
                </div>
                <div className="text-center">
                    <button
                        className="btn btn-primary"
                        onClick={this.onClickSignUp}
                        disabled={this.state.pendingAPICall}>
                        {this.state.pendingAPICall && spinner}
                        Sign Up
                    </button>
                </div>
            </div>
        )
    }
}

UserSignUpPage.defaultProps = {
    actions: {
        postSignUp: () => new Promise((resolve, reject) => {
            resolve({})
        })
    }
}

export default UserSignUpPage