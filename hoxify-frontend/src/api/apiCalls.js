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

export const loadHoxes = (username = null) => {
    const basePath = username
        ? `/api/1.0/users/${username}/hoxes`
        : '/api/1.0/hoxes'
    return axios.get(basePath + '?page=0&size=5&sort=id,desc')
}

export const loadOldHoxes = (hoxId, username = undefined) => {
    const basePath = username
        ? `/api/1.0/users/${username}/hoxes`
        : `/api/1.0/hoxes`
    const path = `${basePath}/${hoxId}?direction=before?&page=0&size=5&sort=id,desc`
    return axios.get(path)
}

export const loadNewHoxes = (hoxId, username = undefined) => {
    const basePath = username
        ? `/api/1.0/users/${username}/hoxes`
        : `/api/1.0/hoxes`
    const path = `${basePath}/${hoxId}?direction=after&sort=id,desc`
    return axios.get(path)
}

export const loadNewHoxCount = (hoxId, username = undefined) => {
    const basePath = username
        ? `/api/1.0/users/${username}/hoxes`
        : `/api/1.0/hoxes`
    const path = `${basePath}/${hoxId}?direction=after&count=true`
    return axios.get(path)
}

export const postHoxFile = file => {
    return axios.post('/api/1.0/hoxes/upload', file)
}

