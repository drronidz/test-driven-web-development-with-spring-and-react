import React from "react";
import UserList from "../../components/UserList/UserList";
import HoxSubmit from "../../components/HoxSubmit/HoxSubmit";
import { connect } from 'react-redux'
import HoxFeed from "../../components/HoxFeed/HoxFeed";

class HomePage extends React.Component {

    render() {
        return (
            <div data-testid="homepage">
                <div className="row">
                    <div className="col-8">
                        {this.props.loggedInUser.isLoggedIn &&  <HoxSubmit/>}
                        <HoxFeed/>
                    </div>
                    <div className="col-4">
                        <UserList/>
                    </div>
                </div>
            </div>
            )}
}

const mapStateToProps = state => {
    return {
        loggedInUser: state
    }
}

export default connect(mapStateToProps)(HomePage)