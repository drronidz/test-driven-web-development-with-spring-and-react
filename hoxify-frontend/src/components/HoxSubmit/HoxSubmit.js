import React, {Component} from 'react';
import ProfileAvatar from "../ProfileImage/ProfileAvatar";
import ButtonWithProgress from "../ButtonWithSpinner/ButtonWithSpinner";
import { connect } from 'react-redux'
import * as apiCalls from '../../api/apiCalls'

class HoxSubmit extends Component {
    state = {
        focused: false,
        content: undefined,
        pendingAPICall: false
    }

    onChangeContentHandler = (event) => {
        const value = event.target.value
        this.setState(prevState =>{
            return{
                ...prevState,
                content : value
            }
        })
    }

    onClickHoxifyHandler = () => {
        const body = { content: this.state.content }
        this.setState( prevState => {
            return {
                ...prevState,
                pendingAPICall: true
            }
        })
        apiCalls.postHox(body)
            .then(response => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        focused : !prevState.focused,
                        content: '',
                        pendingAPICall: false
                    }
                })
            })
            .catch((error) => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        pendingAPICall: false
                    }
                })
            })
    }

    onFocusTextArea = () => {
        this.setState(prevState => {
            return {
                ...prevState,
                focused : !prevState.focused
            }
        })
    }

    onClickCancelHandler = () => {
        this.setState(prevState =>{
            return {
                ...prevState,
                focused : !prevState.focused,
                content: ''
            }
        })
    }


    render() {
        const hoxifyAndCancelButtons =
            this.state.focused &&
            <div className="text-right mt-1">
                <ButtonWithProgress
                    className="btn btn-success"
                    disabled={this.state.pendingAPICall}
                    onClick={this.onClickHoxifyHandler}
                    pendingAPICall={this.state.pendingAPICall}
                    text="Hoxify"
                />
                <button
                    className="btn btn-light"
                    disabled={this.state.pendingAPICall}
                    onClick={this.onClickCancelHandler}>
                    Cancel
                </button>
            </div>

        return (
            <div className="card d-flex flex-row p-1">
                <ProfileAvatar
                    className="rounded-circle m-1"
                    width="32"
                    height="32"
                    image={this.props.loggedInUser.image}
                />
                <div className="flex-fill">
                    <textarea
                        className="form-control w-100"
                        rows={this.state.focused ? 3 : 1}
                        onFocus={this.onFocusTextArea}
                        value={this.state.content}
                        onChange={this.onChangeContentHandler}
                    />
                    {hoxifyAndCancelButtons}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state
    }
}

export default connect(mapStateToProps)(HoxSubmit);