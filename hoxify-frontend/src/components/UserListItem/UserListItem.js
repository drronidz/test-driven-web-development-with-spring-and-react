import React from "react";
import defaultProfileAvatar from '../../assets/default-avatar.png'
import { Link } from 'react-router-dom'
import ProfileAvatar from "../ProfileImage/ProfileAvatar";

const UserListItem = props => {
    return (
        <Link className="list-group-item list-group-item-action" to={`/${props.user.username}`}>
            <ProfileAvatar
                className="rounded-circle"
                alt="profile"
                width="32"
                height="32"
                image={props.user.image}
            />
            <span className="pl-2">
                {`${props.user.displayName}@${props.user.username}`}
            </span>
        </Link>
)}

export default UserListItem