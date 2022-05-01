// Core React
import React from "react";
// Components
// Styles
import UserSignUpPage from "./pages/UserSignupPage";
import * as apiCalls from "./api/apiCalls";


const actions = {
    postSignUp: apiCalls.signUp
}

function App() {
  return (
    <div className="App">
      <UserSignUpPage actions={actions}/>
    </div>
  );
}

export default App;
