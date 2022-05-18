import React from "react";
import defaultProfileAvatar from '../../assets/default-avatar.png'
import { Link } from 'react-router-dom'

const UserListItem = props => {
    let imageSource = defaultProfileAvatar;

    if (props.user.image) {
        imageSource = `/images/profile/${props.user.image}`
    }

    return (
        <Link className="list-group-item list-group-item-action" to={`/${props.user.username}`}>
            <img className="rounded-circle"
                 alt="profile"
                 width="32"
                 height="32"
                 src={imageSource}/>
            <span className="pl-2">
                {`${props.user.displayName}@${props.user.username}`}
            </span>
        </Link>
)}

export default UserListItem