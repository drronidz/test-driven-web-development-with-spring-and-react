import {applyMiddleware, createStore} from "redux";
import authReducer from "./authReducer";
import thunk from "redux-thunk";
import logger from "redux-logger";

const configStore = (addLogger = true) => {
    const middleware = addLogger
        ? applyMiddleware(thunk, logger)
        : applyMiddleware(thunk)

    return createStore(authReducer, middleware)
}

export default configStore
