import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './container/App';
import {HashRouter} from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import authReducer from "./redux/authReducer";
import logger from 'redux-logger'

const loggedInState = {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile.png',
    password: 'AZerty12',
    isLoggedIn: true
}

const store = createStore(authReducer, loggedInState, applyMiddleware(logger))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
      <Provider store={store}>
          <App />
      </Provider>
  </HashRouter>
);
