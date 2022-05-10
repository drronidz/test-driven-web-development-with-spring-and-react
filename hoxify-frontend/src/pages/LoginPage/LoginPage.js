import React from "react";
import Input from "../../components/input/Input";
import ButtonWithProgress from "../../components/button-with-spinner/ButtonWithSpinner";

export class LoginPage extends React.Component {
    state = {
        username: '',
        password: '',
        apiError: undefined,
        pendingAPICall: false
    }

    onChangeUsername = (event) => {
        const value = event.target.value

        this.setState({
            username: value,
            apiError: undefined
        })
    }

    onChangePassword = (event) => {
        const value = event.target.value

        this.setState({
            password : value,
            apiError: undefined
        })
    }

    onClickLogin = () => {
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
                this.setState({
                    pendingAPICall: false
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
    }

    render() {
        let disableSubmit= false

        if (this.state.username === '' || this.state.password === '') {
            disableSubmit = true
        }

        return (
            <div className="container">
                <h1 className="text-center">Login</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Username"
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}/>
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password"
                        placeholder="Your password"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangePassword}/>
                </div>
                {this.state.apiError && (
                    <div className="col-12 mb-3">
                        <div className="alert alert-danger" >{this.state.apiError}</div>
                    </div>)}
                <div className="text-center">
                    <ButtonWithProgress
                        onClick={this.onClickLogin}
                        disabled={disableSubmit || this.state.pendingAPICall}
                        text="Login"
                        pendingAPICall={this.state.pendingAPICall}/>
                </div>
            </div>
        )
    }
}

LoginPage.defaultProps = {
    actions: {
        postLogin: () => new Promise(((resolve, reject) => resolve({

        })))
    }
}

export default LoginPage