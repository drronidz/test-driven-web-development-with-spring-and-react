import React from 'react';
import ProfileAvatar from "../ProfileImage/ProfileAvatar";
import Input from "../Input/Input";
import Spinner from "../Spinner/Spinner";

const ProfileCard = (props) => {
    const { displayName, username, image } = props.user

    const userInformation = !props.inEditMode &&  <h4>{`${displayName}@${username}`}</h4>

    const showEditButton = props.isEditable && !props.inEditMode

    const editButton = showEditButton &&
        <button className="btn btn-outline-success" onClick={props.onClickEdit}>
            <i className="fas fa-user-edit"/>Edit
        </button>

    const saveButton = props.inEditMode &&
        <button
            className="btn btn-primary"
            onClick={props.onClickSave}
            disabled={props.pendingUpdateCall}>
            {props.pendingUpdateCall && <Spinner/>}
            <i className="fas fa-save"/>Save
        </button>

    const cancelButton = props.inEditMode &&
        <button className="btn btn-primary"
                onClick={props.onClickCancel}
                disabled={props.pendingUpdateCall}>
            <i className="fas fa-window-close"/>Cancel
        </button>


    const input = props.inEditMode &&
        <div style={{ marginTop: '10px' , marginBottom: '10px'}}>
            <Input
                onChange={props.onChangeDisplayName}
                value={displayName}
                label={`Change Display Name for ${username}`}
            />
            <input
                style={{ marginTop: '10px' , marginBottom: '10px'}}
                className="form-control"
                type="file"
                onChange={props.onFileSelect}
            />
        </div>

    return (
        <div className="card">
            <div className="card-header text-center">
                <ProfileAvatar
                    className="rounded-circle shadow"
                    alt="profile"
                    width="200"
                    height="200"
                    image={image}
                    src={props.loadedImage}
                />
            </div>
            <div className="card-body text-center">
                {userInformation}
                {input}
                <div style={{ display: "flex" , justifyContent: "space-evenly"}}>
                    {editButton}
                    {saveButton}
                    {cancelButton}
                </div>
            </div>
        </div>

    );
};

export default ProfileCard;