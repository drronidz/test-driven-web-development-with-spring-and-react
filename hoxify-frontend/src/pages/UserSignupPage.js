import React from "react";

export class UserSignUpPage extends React.Component{

    state = {
        displayName: '',
        username: '',
        password: '',
        passwordConfirmation:''
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


    render() {
        return (
            <div>
                <h1>Sign Up</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Your display name"
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password confirmation"
                        value={this.state.passwordConfirmation}
                        onChange={this.onChangePasswordConfirmation}
                    />
                </div>
                <div>
                    <button>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default UserSignUpPage