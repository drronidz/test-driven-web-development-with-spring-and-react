import React, {Component} from 'react';
import ProfileAvatar from "../ProfileImage/ProfileAvatar";
import ButtonWithProgress from "../ButtonWithSpinner/ButtonWithSpinner";
import { connect } from 'react-redux'
import * as apiCalls from '../../api/apiCalls'
import Input from "../Input/Input";

class HoxSubmit extends Component {
    state = {
        focused: false,
        content: '',
        pendingAPICall: false,
        errors: {},
        file: undefined,
        image: undefined,
        attachment: undefined
    }

    onChangeContentHandler = (event) => {
        const value = event.target.value
        this.setState(prevState =>{
            return{
                ...prevState,
                content : value,
                errors: {}
            }
        })
    }

    onFileSelectHandler = event => {
        if (event.target.files.length === 0) {
            return
        }

        const file = event.target.files[0]
        let reader = new FileReader()
        reader.onloadend = () => {
            this.setState({
                image: reader.result,
                file
            },
                () => { this.uploadFileHandler() })
        }
        reader.readAsDataURL(file)
    }

    uploadFileHandler = () => {
        const body = new FormData()
        body.append('file', this.state.file)
        apiCalls.postHoxFile(body)
            .then(response => {
                this.setState({
                    attachment: response.data
                })
            })
    }

    resetStateHandler = () => {
        this.setState({
            focused: false,
            content: '',
            pendingAPICall: false,
            errors: {},
            file: undefined,
            image: undefined,
            attachment: undefined
        })
    }

    onClickHoxifyHandler = () => {
        const body = {
            content: this.state.content,
            attachment: this.state.attachment
        }
        this.setState( prevState => {
            return {
                ...prevState,
                pendingAPICall: true
            }
        })
        apiCalls.postHox(body)
            .then(response => {
                this.setState(response => {
                    this.resetStateHandler()
                })
            })
            .catch((error) => {
                let errors = {}
                if (error.response.data && error.response.data.validationErrors) {
                    errors = error.response.data.validationErrors
                }
                this.setState(prevState => {
                    return {
                        ...prevState,
                        pendingAPICall: false,
                        errors
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

    // onClickCancelHandler = () => {
    //     this.setState(prevState =>{
    //         return {
    //             ...prevState,
    //             focused : !prevState.focused,
    //             content: '',
    //             errors: {},
    //             image: undefined,
    //             file: undefined
    //         }
    //     })
    // }


    render() {
        const hoxifyAndCancelButtons =
            this.state.focused &&
            <div>
                <div className="pt-1">
                    <Input type="file" onChange={this.onFileSelectHandler}/>
                    {this.state.image && (
                        <img
                            className="mt-1 img-thumbnail"
                            src={this.state.image}
                            alt="upload"
                            width="128"
                            height="64"
                        />
                    )}
                </div>
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
                        onClick={this.resetStateHandler}>
                        Cancel
                    </button>
                </div>
            </div>

        let textAreaClassName = 'form-control w-100'
        if (this.state.errors.content) {
            textAreaClassName += ' is-invalid'
        }
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
                        className={textAreaClassName}
                        rows={this.state.focused ? 3 : 1}
                        onFocus={this.onFocusTextArea}
                        value={this.state.content}
                        onChange={this.onChangeContentHandler}
                    />
                    {this.state.errors.content &&
                    <span className="invalid-feedback">{this.state.errors.content}</span>}
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