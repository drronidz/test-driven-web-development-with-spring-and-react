import React from "react";
import {fireEvent, render, waitFor} from "@testing-library/react";
import App from "./App";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import axios from "axios";
import configStore from "../redux/configStore";
import * as apiCalls from '../api/apiCalls'


apiCalls.listUsers = jest.fn().mockResolvedValue({
    data: {
        content: [],
        number: 0,
        size: 3
    }
})

apiCalls.getUser = jest.fn().mockResolvedValue({
    data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    }
})

apiCalls.loadHoxes = jest.fn().mockResolvedValue({
    data: {
        content: [],
        number: 0,
        size: 3
    }
})

const mockSuccessGetUser1 = {
    data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    }
}

const mockSuccessGetUser2 = {
    data: {
        id: 2,
        username: 'user2',
        displayName: 'display2',
        image: 'profile2.png'
    }
}

const mockFailGetUser = {
    response: {
        data: {
            message: 'User not found'
        }
    }
}

beforeEach(() => {
    localStorage.clear()
    delete axios.defaults.headers.common['Authorization']
})

const setup = (path) => {
    const store = configStore(false)
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[path]}>
                <App/>
            </MemoryRouter>
        </Provider>
    )
}

const changeEvent = (content) => {
    return {
        target: {
            value: content
        }
    }
}

const setupUserOneLoggedInLocalStorage = () => {
    localStorage.setItem(
        'hoax-auth',
        JSON.stringify({
            id: 1,
            username: 'user1',
            displayName: 'display1',
            image: 'profile1.png',
            password: 'AZerty12',
            isLoggedIn: true
        })
    )
}

describe('App', () => {

    it('displays Home Page when url is /', () => {
        const { queryByTestId } = setup('/')
        expect(queryByTestId('homepage')).toBeInTheDocument()
    })

    it('displays Login Page when url is /login', () => {
        const { container } = setup('/login')
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Login')
    })

    it('displays only Login Page when url is /login', () => {
        const { queryByTestId } = setup('/login')
        expect(queryByTestId('login')).not.toBeInTheDocument()
    })

    it('displays User Sign up Page when url is /signup', () => {
        const { container } = setup('/signup')
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Sign Up')

    })

    it ('displays User Page when url is other that /, /login or /signup', () => {
        const { queryByTestId } = setup('/user1')
        expect(queryByTestId('userpage')).toBeInTheDocument()
    })

    it('displays Navigation Bar when url is /', () => {
        const { container } = setup('/')
        const navigationBar = container.querySelector('nav')
        expect(navigationBar).toBeInTheDocument()
    })

    it('displays Navigation Bar when url is /login', () => {
        const { container } = setup('/login')
        const navigationBar = container.querySelector('nav')
        expect(navigationBar).toBeInTheDocument()
    })

    it('displays Navigation Bar when url is /signup', () => {
        const { container } = setup('/signup')
        const navigationBar = container.querySelector('nav')
        expect(navigationBar).toBeInTheDocument()
    })

    it('displays Navigation Bar when url is /user1', () => {
        const { container } = setup('/user1')
        const navigationBar = container.querySelector('nav')
        expect(navigationBar).toBeInTheDocument()
    })

    it('shows the User Sign Up Page when clicking Sign Up', () => {
        const { queryByText, container } = setup('/')
        const signUpLink = queryByText('Sign Up')
        fireEvent.click(signUpLink)
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Sign Up')
    })

    it('shows the Login Page when clicking Login', () => {
        const { queryByText, container } = setup('/')
        const loginLink = queryByText('Login')
        fireEvent.click(loginLink)
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Login')
    })

    it('shows the Home Page when clicking the logo', () => {
        const { queryByTestId, container } = setup('/login')
        const logo = container.querySelector('img')
        fireEvent.click(logo)
        expect(queryByTestId('homepage')).toBeInTheDocument()
    })

    it('displays My Profile on Navigation Bar after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login')
        const usernameInput = queryByPlaceholderText('Your username')
        fireEvent.change(usernameInput, changeEvent('my-user-name'))
        const passwordInput = queryByPlaceholderText('Your password')
        fireEvent.change(usernameInput, changeEvent('AZerty12'))
        const button = container.querySelector('button')

        axios.post = jest.fn().mockResolvedValue({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'dispaly1',
                image: 'profile1.png'
            }
        })
        fireEvent.click(button)
        const myProfileLink = await waitFor(() => {queryByText('My Profile')})
        expect(myProfileLink).toBeInTheDocument()
    })

    it('displays My Profile on Navigation Bar after Sign Up success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/signup')
        const displayNameInput  = queryByPlaceholderText('Your display name')
        const usernameInput = queryByPlaceholderText('Your username')
        const passwordInput = queryByPlaceholderText('Your password')
        const passwordConfirmationInput = queryByPlaceholderText('Your password confirmation')


        fireEvent.change(displayNameInput, changeEvent('display1'))
        fireEvent.change(usernameInput, changeEvent('user1'))
        fireEvent.change(passwordInput, changeEvent('AZerty12'))
        fireEvent.change(passwordConfirmationInput, changeEvent('AZerty12'))

        const button = container.querySelector('button')

        axios.post = jest.fn().mockResolvedValue({
            data: {
                message: 'User saved'
            }
        })
            .mockResolvedValueOnce({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'dispaly1',
                image: 'profile1.png'
            }
        })

        fireEvent.click(button)
        await waitFor(() => {
            const myProfileLink = queryByText('My Profile')
            expect(myProfileLink).toBeInTheDocument()
        })
    })

    it('saves logged in user data to local Storage after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/signup')
        const displayNameInput  = queryByPlaceholderText('Your display name')
        const usernameInput = queryByPlaceholderText('Your username')
        const passwordInput = queryByPlaceholderText('Your password')
        const passwordConfirmationInput = queryByPlaceholderText('Your password confirmation')


        fireEvent.change(displayNameInput, changeEvent('display1'))
        fireEvent.change(usernameInput, changeEvent('user1'))
        fireEvent.change(passwordInput, changeEvent('AZerty12'))
        fireEvent.change(passwordConfirmationInput, changeEvent('AZerty12'))

        const button = container.querySelector('button')

        axios.post = jest.fn().mockResolvedValue({
            data: {
                message: 'User saved'
            }
        })
            .mockResolvedValueOnce({
                data: {
                    id: 1,
                    username: 'user1',
                    displayName: 'dispaly1',
                    image: 'profile1.png'
                }})

        fireEvent.click(button)
        await waitFor(() => {queryByText('My Profile')} )
        const dataInStorage = JSON.parse(localStorage.getItem('hoax-auth'))
        expect(dataInStorage).toEqual({
            id: 1,
            username: 'user1',
            displayName: 'dispaly1',
            image: 'profile1.png',
            password: 'AZerty12',
            isLoggedIn: true,
            message: "User saved"
        })
    })

    it('displays logged in Navigation Bar when storage has logged in user data', () => {
        localStorage.setItem(
            'hoax-auth',
            JSON.stringify({
                id: 1,
                username: 'user1',
                displayName: 'dispaly1',
                image: 'profile1.png',
                password: 'AZerty12',
                isLoggedIn: true,
                message: "User saved"}))

        const { queryByText } = setup('/')
        const myProfileLink = queryByText('My Profile')
        expect(myProfileLink).toBeInTheDocument()
    })

    it('sets axios authorization with base64 encoded user credentials after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login')

        const usernameInput = queryByPlaceholderText('Your username')
        fireEvent.change(usernameInput, changeEvent('user1'))

        const passwordInput = queryByPlaceholderText('Your password')
        fireEvent.change(passwordInput, changeEvent('AZerty12'))

        const button = container.querySelector('button')

        axios.post = jest.fn().mockResolvedValue({
            data: {
                message: 'User saved'
            }
        })
            .mockResolvedValueOnce({
                data: {
                    id: 1,
                    username: 'user1',
                    displayName: 'dispaly1',
                    image: 'profile1.png'
                }})
        fireEvent.click(button)

        await waitFor(() => queryByText('My Profile'))
        const axiosAuthorization = axios.defaults.headers.common['Authorization']
        const encoded = btoa('user1:AZerty12')
        const expectedAuthorization = `Basic ${encoded}`
        expect(axiosAuthorization).toBe(expectedAuthorization)
    })

    it('sets axios authorization with base64 encoded user credentials when storage has logged in user data', () => {
        localStorage.setItem(
            'hoax-auth',
            JSON.stringify({
                id: 1,
                username: 'user1',
                display: 'display1',
                image: 'profile1.png',
                password: 'AZzerty12',
                isLoggedIn: true
            }))

        setup('/')
        const axiosAuthorization = axios.defaults.headers.common['Authorization']
        const encoded = btoa('user1:AZzerty12')
        const expectedAuthorization = `Basic ${encoded}`
        expect(axiosAuthorization).toBe(expectedAuthorization)
    })

    it('removes axios authorization header when user logout', () => {
        localStorage.setItem(
            'hoax-auth',
            JSON.stringify({
                id: 1,
                username: 'user1',
                display: 'display1',
                image: 'profile1.png',
                password: 'AZzerty12',
                isLoggedIn: true
            })
        )
        const {queryByText} = setup('/')
        fireEvent.click(queryByText('Logout'))

        const axiosAuthorization = axios.defaults.headers.common['Authorization']
        expect(axiosAuthorization).toBeFalsy()
    })

    it('updates user page after clicking my profile when another user page was opened',async () => {
        apiCalls.getUser = jest
            .fn()
            .mockResolvedValueOnce(mockSuccessGetUser1)
            .mockRejectedValueOnce(mockSuccessGetUser2)

        setupUserOneLoggedInLocalStorage()

        const { queryByText } = setup('/user2')
        let userOne = undefined
        let userTwo = undefined

        await waitFor(() => {
            userTwo = queryByText('display2@user2')
        })

        const myProfileLink = queryByText('My Profile')

        fireEvent.click(myProfileLink)

        await waitFor(() => {
            userOne = queryByText('display1@user1')
        })

        expect(userOne).toBeInTheDocument()
    })

    it('updates user page after clicking my profile when another non existing user page was opened',
        async () => {
            apiCalls.getUser = jest
                .fn()
                .mockResolvedValueOnce(mockFailGetUser)
                .mockRejectedValueOnce(mockSuccessGetUser2)

            setupUserOneLoggedInLocalStorage()

            const { queryByText } = setup('/user50')

            await waitFor(() => {queryByText('User not found')})

            const myProfileLink = queryByText('My Profile')

            fireEvent.click(myProfileLink)

            await waitFor(() => {
                const userOne = queryByText('display1@user1')
                expect(userOne).toBeInTheDocument()
            })


    })
})