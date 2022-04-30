import React from "react";

import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserSignUpPage from "./UserSignupPage";
import {fireEvent} from "@testing-library/dom";

beforeEach(cleanup)

describe('UserSignUpPage', () => {
    describe('Layout', () => {
        it('has header of Sign Up', () => {
            const { container } = render(<UserSignUpPage/>)
            const header = container.querySelector('h1')
            expect(header).toHaveTextContent('Sign Up')
        })
        it('has input for display name', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const displayNameInput = queryByPlaceholderText('Your display name')
            expect(displayNameInput).toBeInTheDocument()
        })

        it('has input for username', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const usernameInput = queryByPlaceholderText('Your username')
            expect(usernameInput).toBeInTheDocument()
        })

        // Password Field
        it('has input for password', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const passwordInput = queryByPlaceholderText('Your password')
            expect(passwordInput).toBeInTheDocument()
        })

        it('has password type for password input', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const passwordInput = queryByPlaceholderText('Your password')
            expect(passwordInput.type).toBe('password')
        })

        // Password Confirmation
        it('has input for password confirmation', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const passwordConfirmationInput = queryByPlaceholderText('Your password confirmation')
            expect(passwordConfirmationInput).toBeInTheDocument()
        })

        it('has password type for password confirmation input', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const passwordConfirmationInput = queryByPlaceholderText('Your password confirmation')
            expect(passwordConfirmationInput.type).toBe('password')
        })

        it('has submit button', () => {
            const { container } = render(<UserSignUpPage/>)
            const submitButton = container.querySelector('button')
            expect(submitButton).toBeInTheDocument()
        })
    })
    describe('Interactions', () => {

        const changeEvent = (content) => {
            return {
                target: {
                    value: content
                }
            }
        }

        it('sets the displayName value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const displayNameInput  = queryByPlaceholderText('Your display name')

            fireEvent.change(displayNameInput, changeEvent('my-display-name'))
            expect(displayNameInput).toHaveValue('my-display-name')
        })

        it('sets the username value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const usernameInput = queryByPlaceholderText('Your username')

            fireEvent.change(usernameInput, changeEvent('my-user-name'))
            expect(usernameInput).toHaveValue('my-user-name')
        })

        it('sets the password value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const passwordInput = queryByPlaceholderText('Your password')

            fireEvent.change(passwordInput, changeEvent('my-password'))
            expect(passwordInput).toHaveValue('my-password')
        })

        it('sets password confirmation value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage/>)
            const passwordConfirmationInput = queryByPlaceholderText('Password confirmation')

            fireEvent.change(passwordConfirmationInput, changeEvent('my-password-confirmation'))
            expect(passwordConfirmationInput).toHaveValue('my-password-confirmation')
        })

    })
})