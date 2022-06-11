import React from "react";
import UserList from "../../components/UserList/UserList";
import HoxSubmit from "../../components/HoxSubmit/HoxSubmit";

class HomePage extends React.Component {

    render() {
        return (
            <div data-testid="homepage">
                <div className="row">
                    <div className="col-8">
                        <HoxSubmit/>
                    </div>
                    <div className="col-4">
                        <UserList/>
                    </div>
                </div>
            </div>
            )

    }
}

export default HomePage