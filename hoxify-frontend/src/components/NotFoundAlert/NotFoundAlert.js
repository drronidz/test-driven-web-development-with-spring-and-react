import React from 'react';

const NotFoundAlert = (props) => {
    const { alertMessage } = props
    return (
        <div className="alert alert-danger text-center">
            <div className="alert-heading">
                <i className="fas fa-exclamation-triangle fa-3x"/>
            </div>
            <h5>{alertMessage}</h5>
        </div>
    );
};

export default NotFoundAlert;