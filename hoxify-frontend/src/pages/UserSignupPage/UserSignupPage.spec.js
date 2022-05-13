import React from "react";

import {render, cleanup, waitFor, waitForElementToBeRemoved, fireEvent, getByText} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserSignUpPage from "./UserSignupPage";

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

        const mockAsyncDelayedResolve = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({})
                    }, 300)
                })
            })
        }

        const mockAsyncDelayedReject = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject({
                            response: {
                                data: {}
                            }
                        })
                    }, 300)
                })
            })
        }

        let button, displayNameInput, usernameInput, passwordInput, passwordConfirmationInput

        const setupForSubmit = (props) => {
            const rendered = render(<UserSignUpPage {...props}/>)

            const { container, queryByPlaceholderText } = rendered
            displayNameInput  = queryByPlaceholderText('Your display name')
            usernameInput = queryByPlaceholderText('Your username')
            passwordInput = queryByPlaceholderText('Your password')
            passwordConfirmationInput = queryByPlaceholderText('Your password confirmation')


            fireEvent.change(displayNameInput, changeEvent('my-display-name'))
            fireEvent.change(usernameInput, changeEvent('my-user-name'))
            fireEvent.change(passwordInput, changeEvent('my-password'))
            fireEvent.change(passwordConfirmationInput, changeEvent('my-password-confirmation'))

            button = container.querySelector('button')

            return rendered
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
            const passwordConfirmationInput = queryByPlaceholderText('Your password confirmation')

            fireEvent.change(passwordConfirmationInput, changeEvent('my-password-confirmation'))
            expect(passwordConfirmationInput).toHaveValue('my-password-confirmation')
        })

        it('calls postSignUp when the fields are valid and the actions are provided in props', () => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValueOnce({})
            }
            setupForSubmit({ actions })
            fireEvent.click(button)
            expect(actions.postSignUp).toHaveBeenCalledTimes(1)
        })

        it('does not throw exception when clicking the button when actions are provided in props', () => {
            setupForSubmit()
            expect(() => fireEvent.click(button)).not.toThrow()
        })

        it('calls post with user body when the fields are valid', () => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValueOnce({})
            }
            setupForSubmit({ actions })
            fireEvent.click(button)
            const expectedUserObject = {
                displayName:'my-display-name',
                username:'my-user-name',
                password:'my-password',
                passwordConfirmation:'my-password-confirmation'
            }
            expect(actions.postSignUp).toHaveBeenCalledWith(expectedUserObject)
        })

        it('does not allow user to click the Sign Up button when there is an ongoing api call', () => {
            const actions = {
                postSignUp: mockAsyncDelayedResolve()
            }
            setupForSubmit({ actions })
            fireEvent.click(button)

            fireEvent.click(button)
            expect(actions.postSignUp).toHaveBeenCalledTimes(1)
        })

        it('displays a Spinner when there is an ongoing API Call', async () => {
            const actions = {
                postSignUp: mockAsyncDelayedResolve()
            }
            const { queryByText } = setupForSubmit({ actions })
            fireEvent.click(button)

            // await waitForElementToBeRemoved()

            await waitFor(() => {
                expect(queryByText('Loading...')).toBeInTheDocument();
            });
        })

        it('hides a Spinner after API call finishes Successfully!', async () => {
            const actions = {
                postSignUp: mockAsyncDelayedResolve()
            }
            const { queryByText } = setupForSubmit({ actions })
            fireEvent.click(button)

            // await waitForElementToBeRemoved()

            const spinner = queryByText('Loading...')
            expect(spinner).not.toBeInTheDocument()
        })

        it('hides a Spinner after API call finishes with Error', async () => {
            const actions = {
                postSignUp: mockAsyncDelayedReject()
            }
            const { queryByText } = setupForSubmit({ actions })
            fireEvent.click(button)

            // await waitForElementToBeRemoved()

            const spinner = queryByText('Loading...')
            expect(spinner).not.toBeInTheDocument()
        })

        // it('displays validation error for displayName when error is received for the field', async () => {
        //     const actions = {
        //         postSignUp: jest.fn().mockRejectedValue({
        //             response: {
        //                 data: {
        //                     validationErrors: {
        //                         displayName: 'Cannot be null'
        //                     }
        //                 }
        //             }
        //         })
        //     }
        //
        //     const { queryByText } = setupForSubmit({ actions })
        //     fireEvent.click(button)
        //
        //     // const errorMessage = await waitFor(() => queryByText("Cannot be null"))
        //     // expect(errorMessage).toBeInTheDocument()
        //     await waitFor(() => {
        //         expect(getByText('Cannot be null')).toBeInTheDocument
        //     })
        // })

        it('displays validation error for displayName when error is received for the field', async() => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                displayName: 'Cannot be null'
                            }
                        }
                    }
                })
            }

            const { queryByText } = setupForSubmit({ actions })

            fireEvent.click(button);

            await waitFor(() => {
                expect(queryByText('Cannot be null')).toBeInTheDocument();
            });
        });

        it ('enables the SignUp button when password and repeat password have same value', () => {
            setupForSubmit()
            expect(button).not.toBeDisabled()
        })

        it ('disables the SignUp button when password repeat does not match password', () => {
            setupForSubmit()
            fireEvent.change(passwordConfirmationInput, changeEvent('new-pass'))
            expect(button).toBeDisabled()
        })

        it ('disables the SignUp button when password does not match password repeat', () => {
            setupForSubmit()
            fireEvent.change(passwordInput, changeEvent('new-pass'))
            expect(button).toBeDisabled()
        })

        it ('displays error style for password confirmation input when password confirmation mismatch', () => {
            const { queryByText } = setupForSubmit()
            fireEvent.change(passwordConfirmationInput, changeEvent('new-pass'))
            const mismatchWarning = queryByText('Does not match to password')
            expect(mismatchWarning).toBeInTheDocument()
        })

        it ('displays error style for password confirmation input when password input mismatch', () => {
            const { queryByText } = setupForSubmit()
            fireEvent.change(passwordInput, changeEvent('new-pass'))
            const mismatchWarning = queryByText('Does not match to password')
            expect(mismatchWarning).toBeInTheDocument()
        })

        it('hides the validation error when user changes the content of displayName', async() => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                 displayName: 'Cannot be null'
                            }
                        }
                    }
                })
            }

            const { queryByText } = setupForSubmit({ actions })

            fireEvent.click(button);

            await waitFor(() => {
                queryByText('Cannot be null')
            });
            fireEvent.change(displayNameInput, changeEvent('name updated'))

            const errorMessage = queryByText('Cannot be null')
            expect(errorMessage).not.toBeInTheDocument()

        });

        it ('hides the validation error when user changes the content of password', async () => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                password: 'Cannot be null'
                            }
                        }
                    }
                })
            }
            const { queryByText } = setupForSubmit({actions})
            fireEvent.click(button)

            await waitFor(() => queryByText('Cannot be null'))
            fireEvent.change(passwordInput, changeEvent('updated-password'))

            const errorMessage = queryByText('Cannot be null')
            expect(errorMessage).not.toBeInTheDocument()
        })


        it ('redirects to home Page after successful Sign Up', async () => {
            const actions = {
                postSignUp: jest.fn().mockResolvedValue({})
            }
            const history = {
                push: jest.fn()
            }
            setupForSubmit({ actions, history })
            fireEvent.click(button)
            await waitFor(() => {
                expect(history.push).toHaveBeenCalledWith('/')
            })

            expect(history.push).toHaveBeenCalledTimes(1)
        })
    })

})