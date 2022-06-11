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

export const listUsers = (params = { page : 0, size: 3 }) => {
    const path =
        `/api/1.0/users?page=${params.page || 0}&size=${params.size || 3}`
    return axios.get(path)
}

export const getUser = (username) => {
    return axios.get(`/api/1.0/users/${username}`)
}

export const updateUser = (userId, body) => {
    return axios.put('/api/1.0/users/' + userId, body)
}

export const postHox = (user) => {
    return axios.post('/api/1.0/hoxes', user)
}

