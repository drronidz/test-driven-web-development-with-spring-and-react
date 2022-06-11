import React from "react";
import Spinner from "../Spinner/Spinner";

const ButtonWithProgress = (props) => {
    return (
        <button
            className={props.className || "btn btn-primary"}
            onClick={props.onClick}
            disabled={props.disabled}>
            {props.pendingAPICall && <Spinner/>}{props.text}
        </button>
    )
}

export default ButtonWithProgress