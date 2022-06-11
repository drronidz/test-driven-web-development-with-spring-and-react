import React, {Component} from 'react';
import ProfileAvatar from "../ProfileImage/ProfileAvatar";
import { connect } from 'react-redux'

class HoxSubmit extends Component {
    state = {
        focused: false
    }

    onFocusTextArea = () => {
        this.setState(prevState =>{
            return{
                focused : !prevState.focused
            }
        })
    }

    onClickCancelHandler = () => {
        this.setState(prevState =>{
            return{
                focused : !prevState.focused
            }
        })
    }


    render() {
        const hoxifyAndCancelButtons =
            this.state.focused &&
            <div className="text-right mt-1">
                <button className="btn btn-success">Hoxify</button>
                <button className="btn btn-light" onClick={this.onClickCancelHandler}>Cancel</button>
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