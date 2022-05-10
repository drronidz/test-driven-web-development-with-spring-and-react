import React from "react";
import {render, fireEvent, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import  {LoginPage} from './LoginPage'

describe('LoginPage', () => {

    it('has header of Login', () => {
        const { container } = render(<LoginPage/>)
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Login')
    })

    it ('has input for username', () => {
        const { queryByPlaceholderText } = render(<LoginPage/>)
        const usernameInput = queryByPlaceholderText('Your username')
        expect(usernameInput).toBeInTheDocument()
    })

    it ('has text type for username input', () => {
        const { queryByPlaceholderText } = render(<LoginPage/>)
        const usernameInput = queryByPlaceholderText('Your username')
        expect(usernameInput.type).toBe('text')
    })

    it ('has input for password', () => {
        const { queryByPlaceholderText } = render(<LoginPage/>)
        const passwordInput = queryByPlaceholderText('Your password')
        expect(passwordInput).toBeInTheDocument()
    })

    it ('has password type for password input', () => {
        const { queryByPlaceholderText } = render(<LoginPage/>)
        const passwordInput = queryByPlaceholderText('Your password')
        expect(passwordInput.type).toBe('password')
    })

    it('has Login button', () => {
        const { container } = render(<LoginPage/>)
        const button = container.querySelector('button')
        expect(button).toBeInTheDocument()
    })
})

describe('Interactions', () => {

    const changeEvent = (content) => {
        return {
            target: {
                value : content
            }
        }
    }

    let usernameInput, passwordInput, button


    const setupForSubmit = (props) => {
        const rendered = render(<LoginPage {...props}/>)
        const { container, queryByPlaceholderText } = rendered
        usernameInput = queryByPlaceholderText('Your username')
        fireEvent.change(usernameInput, changeEvent('my-user-name'))
        passwordInput = queryByPlaceholderText('Your password')
        fireEvent.change(passwordInput, changeEvent('my-password'))
        button = container.querySelector('button')
        return rendered
    }

    it ('sets the username value into state', () => {
        const { queryByPlaceholderText } = render(<LoginPage/>)
        const usernameInput = queryByPlaceholderText('Your username')
        fireEvent.change(usernameInput, changeEvent('my-user-name'))
        expect(usernameInput).toHaveValue('my-user-name')
    })

    it ('sets the password value into state', () => {
        const { queryByPlaceholderText } = render(<LoginPage/>)
        const passwordInput = queryByPlaceholderText('Your password')
        fireEvent.change(passwordInput, changeEvent('my-password'))
        expect(passwordInput).toHaveValue('my-password')
    })

    it ('calls postLogin when the actions are provided in props and input fields have values', () => {
        const actions = {
            postLogin: jest.fn().mockResolvedValue({

            })
        }
        setupForSubmit({ actions })
        fireEvent.click(button)
        expect(actions.postLogin).toHaveBeenCalledTimes(1)
    })

    it ('does not throw exception when clicking the button when actions not provided in props', () => {
        setupForSubmit()
        fireEvent.click(button)
        !expect(() => fireEvent.click(button)).not.toThrow()
    })

    it ('calls postLogin with credentials in body', () => {
        const actions = {
            postLogin: jest.fn().mockResolvedValue({

            })
        }
        setupForSubmit({ actions })
        fireEvent.click(button)

        const expectedUserObject = {
            username: 'my-user-name',
            password: 'my-password'
        }


        expect(actions.postLogin).toHaveBeenCalledWith(expectedUserObject)
    })

    it ('enables the button when username and password is not empty', () => {
        setupForSubmit()
        expect(button).not.toBeDisabled()
    })

    it ('disables the button when username is empty', () => {
        setupForSubmit()
        fireEvent.change(usernameInput, changeEvent(''))
        expect(button).toBeDisabled()
    })

    it ('disables the button when password is empty', () => {
        setupForSubmit()
        fireEvent.change(passwordInput, changeEvent(''))
        expect(button).toBeDisabled()
    })

    it ('displays alert when login fails',async () => {
        const actions = {
            postLogin: jest.fn().mockRejectedValue({
                response: {
                    data : {
                        message: 'Login failed'
                    }
                }
            })
        }
        const { queryByText } = setupForSubmit({ actions })
        fireEvent.click(button)

        await waitFor(() => {
            const alert = queryByText('Login failed')
            expect(alert).toBeInTheDocument()
        })
    })

    it ('hides the alert when user changes username',async () => {
        const actions = {
            postLogin: jest.fn().mockRejectedValue({
                response: {
                    data : {
                        message: 'Login failed'
                    }
                }
            })
        }
        const { queryByText } = setupForSubmit({ actions })
        fireEvent.click(button)
        fireEvent.change(usernameInput, changeEvent('updated-username'))

        await waitFor(() => {
            const alert = queryByText('Login failed')
            expect(alert).toBeInTheDocument()
        })
    })

    it ('hides the alert when user changes password',async () => {
        const actions = {
            postLogin: jest.fn().mockRejectedValue({
                response: {
                    data : {
                        message: 'Login failed'
                    }
                }
            })
        }
        const { queryByText } = setupForSubmit({ actions })
        fireEvent.click(button)
        fireEvent.change(passwordInput, changeEvent('updated-passowrd'))

        await waitFor(() => {
            const alert = queryByText('Login failed')
            expect(alert).toBeInTheDocument()
        })
    })
})


