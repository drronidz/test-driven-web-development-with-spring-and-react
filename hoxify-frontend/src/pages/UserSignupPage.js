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

    onClickSignUp = () => {
        const user = {
            displayName: this.state.displayName,
            username: this.state.username,
            password: this.state.password,
            passwordConfirmation: this.state.passwordConfirmation
        }
        this.props.actions.postSignUp(user)
    }


    render() {
        return (
            <div>
                <h1>Sign Up</h1>
                <div>
                    <input
                        placeholder="Your display name"
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                    />
                </div>
                <div>
                    <input
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}/>
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Your password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Your password confirmation"
                        value={this.state.passwordConfirmation}
                        onChange={this.onChangePasswordConfirmation}
                    />
                </div>
                <div>
                    <button onClick={this.onClickSignUp}>Sign Up</button>
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