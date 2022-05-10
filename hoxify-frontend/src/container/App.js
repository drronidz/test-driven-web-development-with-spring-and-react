// Core React
import React from "react";
// Components
// Styles
import UserSignUpPage from "../pages/UserSignupPage/UserSignupPage";
import * as apiCalls from "../api/apiCalls";
import LoginPage from "../pages/LoginPage/LoginPage";
import {Route, Switch} from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import UserPage from "../pages/UserPage/UserPage";


const actions = {
    postSignUp: apiCalls.signUp,
    postLogin : apiCalls.login
}

function App() {
  return (
    <div className="container">
        <Switch>
            <Route path="/login" component={LoginPage}/>
            <Route path="/signup" component={UserSignUpPage}/>
            <Route path="/:username" component={UserPage}/>
            <Route exact path="/" component={HomePage}/>
        </Switch>
    </div>
  );
}

export default App;
