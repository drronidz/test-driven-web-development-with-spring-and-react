import React from "react";
import Logo from '../../assets/hoaxify-logo.png'
import {Link} from "react-router-dom";

class NavigationBar extends React.Component {
    render() {
        return (
            <div className="bg-white shadow-sm mb-2">
                <nav className="navbar navbar-light navbar-expand">
                    <Link to="/" className="navbar-brand">
                        <img src={Logo} width="60" alt="Hoaxify"/>Hoaxify
                    </Link>
                    <ul className="nav navbar-nav ml-auto">
                        <li className="nav-item"><Link to="/signup" className="nav-link">Sign Up</Link></li>
                        <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default NavigationBar