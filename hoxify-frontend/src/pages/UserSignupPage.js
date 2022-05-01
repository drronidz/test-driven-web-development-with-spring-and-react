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
            <div className="container">
                <h1 className="text-center">Sign Up</h1>
                <div className="col-12 mb-3">
                    <label className="float-start">Display Name</label>
                    <input
                        className="form-control"
                        placeholder="Your display name"
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                    />
                </div>
                <div className="col-12 mb-3">
                    <label className="float-start">Username</label>
                    <input
                        className="form-control"
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}/>
                </div>
                <div className="col-12 mb-3">
                    <label className="float-start">Password</label>
                    <input
                        className="form-control"
                        type="password"
                        placeholder="Your password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                    />
                </div>
                <div className="col-12 mb-3">
                    <label className="float-start">Password Confirmation</label>
                    <input
                        className="form-control"
                        type="password"
                        placeholder="Your password confirmation"
                        value={this.state.passwordConfirmation}
                        onChange={this.onChangePasswordConfirmation}
                    />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary" onClick={this.onClickSignUp}>Sign Up</button>
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