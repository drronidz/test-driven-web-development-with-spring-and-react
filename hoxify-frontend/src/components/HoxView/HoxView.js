import React, {Component} from 'react';
import ProfileAvatar from "../ProfileImage/ProfileAvatar";
import { format } from 'timeago.js'
import { Link } from "react-router-dom";

class HoxView extends Component {
    render() {
        const { hox } = this.props
        const { user,date } = hox
        const { username, displayName, image } = user
        const relativeDate = format(date)
        const attachmentTypeVisible =
            hox.attachment &&
            hox.attachment.fileType.startsWith('image')

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
                        <Link to={`/${username}`} className="list-group-item-action">
                            <h6 className="d-inline">{displayName}@{username}</h6>
                        </Link>
                        <span className="text-black-50"> - </span>
                        <span className="text-black-50">{relativeDate}</span>
                    </div>
                </div>
                <div className="pl-5"> {hox.content}</div>
                { attachmentTypeVisible && (
                    <div className="pl-5">
                        <img
                            className="img-fluid"
                            alt="attachment"
                            src={`/images/attachments/${hox.attachment.name}`}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default HoxView;