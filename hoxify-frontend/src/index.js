import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './container/App';
import {HashRouter} from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import authReducer from "./redux/authReducer";
import logger from 'redux-logger'
import thunk from "redux-thunk";
import configStore from "./redux/configStore";

const store = configStore()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
      <Provider store={store}>
          <App />
      </Provider>
  </HashRouter>
);
