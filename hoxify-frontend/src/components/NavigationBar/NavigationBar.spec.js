import React from "react";
import { render } from '@testing-library/react'
import NavigationBar from './NavigationBar'
import {MemoryRouter} from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore} from "redux";
import authReducer from "../../redux/authReducer";

const defaultState = {
    id: 0,
    username: '',
    displayName: '',
    image: '',
    password: '',
    isLoggedIn: false
}

const loggedInState = {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile.png',
    password: 'AZerty12',
    isLoggedIn: true
}

const setup = (state = defaultState) => {
    const store = createStore(authReducer, state)
    return render(
        <Provider store={store}>
            <MemoryRouter>
                <NavigationBar/>
            </MemoryRouter>
        </Provider>
    )
}

describe('Navigation Bar', () => {

    describe('Layout',() => {

        it('has application Logo (Hoaxify Logo)', () => {
            const { container } = setup()
            const image = container.querySelector('img')
            expect(image.src).toContain('hoaxify-logo.png')
        })

        it('has link to home from logo', () => {
            const { container } = setup()
            const image = container.querySelector('img')
            expect(image.parentElement.getAttribute('href')).toBe('/')
        })

        it('has link to Sign Up', () => {
            const { queryByText } = setup()
            const signUpLink = queryByText('Sign Up')
            expect(signUpLink.getAttribute('href')).toBe('/signup')
        })

        it('has link to Login', () => {
            const { queryByText } = setup()
            const signUpLink = queryByText('Login')
            expect(signUpLink.getAttribute('href')).toBe('/login')
        })

        it('has link to logout when user logged in', () => {
            const { queryByText } = setup(loggedInState)
            const logoutLink = queryByText('Logout')
            expect(logoutLink).toBeInTheDocument()
        })

        it('has link to user profile when user logged in', () => {
            const { queryByText } = setup(loggedInState)
            const profileLink = queryByText('My Profile')
            expect(profileLink.getAttribute('href')).toBe('/user1')
        })
    })
})