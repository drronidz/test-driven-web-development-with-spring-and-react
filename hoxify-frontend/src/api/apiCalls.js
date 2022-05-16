import axios from "axios";

export const signUp = (user) => {
    return axios.post('/api/1.0/users', user)
}

export const login = (user) => {
    return axios.post('/api/1.0/login', {}, {auth: user})
}

export const setAuthorizationHeader = (persistedState) => {
    if (persistedState.isLoggedIn) {
        axios.defaults.headers.common['Authorization'] =
            `Basic ${btoa(persistedState.username + ':' + persistedState.password)}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

