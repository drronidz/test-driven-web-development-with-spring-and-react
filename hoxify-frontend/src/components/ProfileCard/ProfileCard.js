import React from 'react';
import defaultProfileAvatar from '../../assets/default-avatar.png'
import ProfileAvatar from "../ProfileImage/ProfileAvatar";

const ProfileCard = (props) => {
    const { displayName, username, image } = props.user

    return (
        <div className="card">
            <div className="card-header text-center">
                <ProfileAvatar
                    className="rounded-circle shadow"
                    alt="profile"
                    width="200"
                    height="200"
                    image={image}
                />
            </div>
            <div className="card-body text-center">
                <h4>{`${displayName}@${username}`}</h4>
            </div>
        </div>

    );
};

export default ProfileCard;