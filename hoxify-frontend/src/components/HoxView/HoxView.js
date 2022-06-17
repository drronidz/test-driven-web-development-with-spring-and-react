import React, {Component} from 'react';
import ProfileAvatar from "../ProfileImage/ProfileAvatar";
import { format } from 'timeago.js'

class HoxView extends Component {
    render() {
        const { hox } = this.props
        const { user,date } = hox
        const { username, displayName, image } = user
        const relativeDate = format(date)
        return (
            <div className="card p-2 my-2">
                <div className="d-flex">
                    <ProfileAvatar
                        className="rounded-circle"
                        width="32"
                        heigh="32"
                        image={image}
                    />
                    <div className="flex-fill p-1">
                        <h6 className="d-inline">{displayName}@{username}</h6>
                        <span className="text-black-50"> - </span>
                        <span className="text-black-50">{relativeDate}</span>
                    </div>
                </div>
                <div className="pl-5"> {hox.content}</div>
            </div>
        );
    }
}

export default HoxView;