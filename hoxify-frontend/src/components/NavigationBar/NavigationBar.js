import React from "react";
import Logo from '../../assets/hoaxify-logo.png'
import {Link} from "react-router-dom";
import { connect } from 'react-redux'
import ProfileAvatar from "../ProfileImage/ProfileAvatar";

class NavigationBar extends React.Component {

    onClickLogout = () => {

        const action = {
            type: 'logout-success'
        }

        this.props.dispatch(action)
    }

    render() {
        let links = (
            <ul className="nav navbar-nav ml-auto">
                <li className="nav-item"><Link to="/signup" className="nav-link">Sign Up</Link></li>
                <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
            </ul>
        )

        if (this.props.user.isLoggedIn) {
            links = (
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item dropdown">
                        <div className="d-flex" style={{ cursor: 'pointer'}}>
                            <ProfileAvatar
                                className="rounded-circle m-auto"
                                width="32"
                                height="32"
                                image={this.props.user.image}
                            />
                            <span className="nav-link dropdown-toggle">
                                {this.props.user.displayName}
                            </span>
                        </div>
                        <div className="p-0 shadow dropdown-menu show">
                            <Link to={`/${this.props.user.username}`} className="dropdown-item">
                                <i className="fas fa-user text-info"/> My Profile
                            </Link>
                            <span className="dropdown-item"
                                onClick={this.onClickLogout}
                                style={{ cursor: 'pointer'}}>
                                <i className="fas fa-sign-out-alt text-danger"/> Logout
                            </span>
                        </div>
                    </li>
                </ul>
            )
        }

        return (
            <div className="bg-white shadow-sm mb-2">
                <nav className="navbar navbar-light navbar-expand">
                    <Link to="/" className="navbar-brand">
                        <img src={Logo} width="60" alt="Hoaxify"/>Hoaxify
                    </Link>
                    { links }
                </nav>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state
    }
}

export default connect(mapStateToProps)(NavigationBar)