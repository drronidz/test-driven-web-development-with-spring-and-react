import React from 'react';
import defaultProfileAvatar from '../../assets/default-avatar.png'

const ProfileAvatar = (props) => {

    const avatarSource = props.image
        ? `/images/profile/${props.image}`
        : defaultProfileAvatar

    const handleAvatarError = event => {
        event.target.src = defaultProfileAvatar
    }

    return (
        <img
            alt=""
            src={avatarSource}
            {...props}
            onError={handleAvatarError}
         />
    );
};

export default ProfileAvatar;