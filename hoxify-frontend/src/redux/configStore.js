import {applyMiddleware, createStore} from "redux";
import authReducer from "./authReducer";
import thunk from "redux-thunk";
import logger from "redux-logger";

const configStore = (addLogger = true) => {

    let localStorageData = localStorage.getItem('hoax-auth')

    let persistedState = {
        id: 0,
        username: '',
        displayName: '',
        image: '',
        password: '',
        isLoggedIn: false
    }

    if (localStorageData) {
        try {
            persistedState = JSON.parse(localStorageData)
        } catch (error) {

        }
    }

    const middleware = addLogger
        ? applyMiddleware(thunk, logger)
        : applyMiddleware(thunk)

    const store = createStore(authReducer, persistedState, middleware)

    store.subscribe(() => {
        localStorage.setItem('hoax-auth', JSON.stringify(store.getState()))
    })

    return store
}

export default configStore
