// Core React
import React from "react";
// Components
// Styles
import UserSignUpPage from "./pages/UserSignupPage/UserSignupPage";
import * as apiCalls from "./api/apiCalls";
import LoginPage from "./pages/LoginPage/LoginPage";


const actions = {
    postSignUp: apiCalls.signUp
}

function App() {
  return (
    <div className="App">
        <LoginPage/>
      {/*<UserSignUpPage actions={actions}/>*/}
    </div>
  );
}

export default App;
