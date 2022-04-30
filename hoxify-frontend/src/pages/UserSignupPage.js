import React from "react";

export class UserSignUpPage extends React.Component{
    render() {
        return (
            <div>
                <h1>Sign Up</h1>
                <div>
                    <input placeholder="Your display name"/>
                </div>
                <div>
                    <input placeholder="Your username"/>
                </div>
                <div>
                    <input placeholder="Your username"/>
                </div>
                <div>
                    <input type="password" placeholder="Your password"/>
                </div>
                <div>
                    <input type="password" placeholder="Your password confirmation"/>
                </div>
                <div>
                    <button>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default UserSignUpPage