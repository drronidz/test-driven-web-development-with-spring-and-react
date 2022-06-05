import React from "react";
import {fireEvent, render} from '@testing-library/react'
import NavigationBar from './NavigationBar'
import {MemoryRouter} from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore} from "redux";
import authReducer from "../../redux/authReducer";
import * as authActions from '../../redux/authActions'

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

let store

const setup = (state = defaultState) => {
    store = createStore(authReducer, state)
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

        it('displays the displayName when user logged in', () => {
            const { queryByText } = setup(loggedInState)
            const displayName = queryByText('display1')
            expect(displayName).toBeInTheDocument()
        })

        it('displays user image when user is logged in', () => {
            const { container } = setup(loggedInState)
            const images = container.querySelectorAll('img')
            const userImage = images[1]
            expect(userImage.src).toContain('/images/profile/' + loggedInState.image)
        });
    })

    describe('Interactions', () => {
        it('displays the login and sign up links when user clicks logout', () => {
            const { queryByText } = setup(loggedInState)
            const logoutLink = queryByText('Logout')
            fireEvent.click(logoutLink)
            const loginLink = queryByText('Login')
            expect(loginLink).toBeInTheDocument()
        })

        it('adds show class to dropdown men when clicking the username', () => {
            const { queryByText, queryByTestId} = setup(loggedInState)
            const displayName = queryByText('display1')
            fireEvent.click(displayName)
            const dropDownMenu = queryByTestId('drop-down-menu')
            expect(dropDownMenu).toHaveClass('show')
        });

        it('removes show class to drop down menu when clicking app logo', () => {
            const { queryByText, queryByTestId, container} = setup(loggedInState)
            const displayName = queryByText('display1')
            fireEvent.click(displayName)

            const logo = container.querySelector('img')
            fireEvent.click(logo)

            const dropDownMenu = queryByTestId('drop-down-menu')
            expect(dropDownMenu).not.toHaveClass('show')
        });

        it('removes show class to dropdown menu when clicking logout', () => {
            const { queryByText, queryByTestId } = setup(loggedInState)
            const displayName = queryByText('display1')
            fireEvent.click(displayName)

            fireEvent.click(queryByText('Logout'))

            store.dispatch(authActions.loginSuccess(loggedInState))

            const dropDownMenu = queryByTestId('drop-down-menu')
            expect(dropDownMenu).not.toHaveClass('show')
        })

        it('removes show class to dropdown men when clicking My Profile', () => {
            const { queryByText, queryByTestId } = setup(loggedInState)
            const displayName = queryByText('display1')
            fireEvent.click(displayName)

            fireEvent.click(queryByText('Logout'))

            const dropDownMenu = queryByTestId('drop-down-menu')
            expect(dropDownMenu).not.toHaveClass('show')
        })
    })
})