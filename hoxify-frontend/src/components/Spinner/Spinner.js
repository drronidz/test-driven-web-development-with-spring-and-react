import React from "react";

const Spinner = () => {
    return (
        <div className="d-flex">
            <div style={{justifyContent: "center"}} className="spinner-border text-black-50 m-auto mt-3">
                <span className="sr-only">Loading...</span>
            </div>
        </div>

    )
}

export default Spinner