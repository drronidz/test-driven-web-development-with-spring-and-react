import React, {Component} from 'react';
import ProfileAvatar from "../ProfileImage/ProfileAvatar";
import { format } from 'timeago.js'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'


class HoxView extends Component {
    render() {
        const { hox, onClickDelete } = this.props
        const { user,date } = hox
        const { id, username, displayName, image } = user
        const relativeDate = format(date)
        const attachmentTypeVisible =
            hox.attachment &&
            hox.attachment.fileType.startsWith('image')

        const isOwnedByLoggedInUser = id === this.props.loggedInUser.id

        return (
            <div className="card p-2 my-2">
                <div className="d-flex">
                    <ProfileAvatar
                        className="rounded-circle"
                        width="32"
                        heigh="32"
                        image={image}
                    />
                    <div className="flex-fill m-auto pl-2">
                        <Link to={`/${username}`} className="list-group-item-action">
                            <h6 className="d-inline">{displayName}@{username}</h6>
                        </Link>
                        <span className="text-black-50"> - </span>
                        <span className="text-black-50">{relativeDate}</span>
                        {isOwnedByLoggedInUser && (
                            <button className="btn btn-outline-danger btn-sm"
                                    onClick={onClickDelete}>
                                <i className="far fa-trash-alt" />
                            </button>
                        )}
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

const mapStateToProps = state => {
    return {
        loggedInUser: state
    }
}

export default connect(mapStateToProps)(HoxView);