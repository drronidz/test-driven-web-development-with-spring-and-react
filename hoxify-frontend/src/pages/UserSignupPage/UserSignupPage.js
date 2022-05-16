import React from "react";
import Input from "../../components/input/Input";
import Spinner from "../../components/spinner/Spinner";
import ButtonWithProgress from "../../components/button-with-spinner/ButtonWithSpinner";
import {connect} from "react-redux";

export class UserSignUpPage extends React.Component{

    state = {
        displayName: '',
        username: '',
        password: '',
        passwordConfirmation:'',
        pendingAPICall: false,
        errors: {},
        passwordRepeatConfirmed: true
    }

    onChangeDisplayName = (event) => {
        const value = event.target.value
        const errors = {
            ...this.state.errors
        }
        delete errors.displayName
        this.setState({
            displayName: value,
            errors
        })
    }

    onChangeUsername = (event) => {
        const value = event.target.value
        const errors = {
            ...this.state.errors
        }
        delete errors.username
        this.setState({
            username : value,
            errors
        })
    }

    onChangePassword = (event) => {
        const value = event.target.value
        const passwordRepeatConfirmed = this.state.passwordConfirmation === value

        const errors = {
            ...this.state.errors,
            passwordConfirmation: passwordRepeatConfirmed ? '' : 'Does not match to password'
        }
        delete errors.password
        this.setState({
            password : value,
            passwordRepeatConfirmed,
            errors
        })
    }

    onChangePasswordConfirmation = (event) => {
        const value = event.target.value
        const passwordRepeatConfirmed = this.state.password === value
        const errors = {
            ...this.state.errors,
            passwordConfirmation: passwordRepeatConfirmed ? '' : 'Does not match to password'
        }

        this.setState({
            passwordConfirmation : value,
            passwordRepeatConfirmed,
            errors
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
                // this.setState(
                //     { pendingAPICall: false },
                //     () => { this.props.history.push('/') })
                const body = {
                    username: this.state.username,
                    password: this.state.password
                }

                this.setState({
                    pendingAPICall: true
                })

                this.props.actions
                    .postLogin(body)
                    .then((response) => {
                        const action = {
                            type: 'login-success',
                            payload: {
                                ...response.data,
                                password: this.state.password
                            }
                        }
                        this.props.dispatch(action)
                        this.setState(
                            { pendingAPICall: false } ,
                            () => {
                                this.props.history.push('/')
                            })
                    })
                    .catch(error => {
                        if (error.response) {
                            this.setState({
                                apiError: error.response.data.message,
                                pendingAPICall: false
                            })
                        }
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
                  <ButtonWithProgress
                      onClick={this.onClickSignUp}
                      disabled={this.state.pendingAPICall || !this.state.passwordRepeatConfirmed}
                      pendingAPICall={this.state.pendingAPICall}
                      text="Sign up"
                  />
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
    },
    history: {
        push: () => {}
    }
}

export default connect()(UserSignUpPage)