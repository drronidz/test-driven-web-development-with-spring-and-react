import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './container/App';
import {HashRouter} from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import authReducer from "./redux/authReducer";

const store = createStore(authReducer)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
