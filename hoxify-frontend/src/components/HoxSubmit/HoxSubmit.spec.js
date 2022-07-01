import React from "react";
import {fireEvent, render, waitFor} from '@testing-library/react'
import HoxSubmit from "./HoxSubmit";
import * as apiCalls from '../../api/apiCalls'
import { Provider } from 'react-redux'
import { createStore} from "redux";
import authReducer from "../../redux/authReducer";
import {wait} from "@testing-library/user-event/dist/utils";

const defaultState = {
    id: 0,
    username: '',
    displayName: '',
    image: '',
    password: '',
    isLoggedIn: false
}

let store

const setup = (state = defaultState) => {
    store = createStore(authReducer, state)
    return render(
        <Provider store={store}>
            <HoxSubmit/>
        </Provider>
    )
}

describe('HoxSubmit', () => {
    describe('Layout', () => {
        it('has textarea', () => {
            const { container } = setup()
            const textArea = container.querySelector('textarea')
            expect(textArea).toBeInTheDocument()
        })
        it('has image', () => {
            const { container } = setup()
            const image = container.querySelector('img')
            expect(image).toBeInTheDocument()
        })
        it('displays textarea 1 line', () => {
            const { container } = setup()
            const textArea = container.querySelector('textarea')
            expect(textArea.rows).toBe(1)
        })
        it('displays user image', () => {
            const { container } = setup()
            const image = container.querySelector('img')
            expect(image.src).toContain('/images/profile/' + defaultState.image)
        });
    })
    describe('Interactions', () => {

        let textArea
        const setupFocused = () => {
            const rendered = setup()
            textArea =  rendered.container.querySelector('textarea')
            fireEvent.focus(textArea)
            return rendered
        }

        it('displays 3 rows when focused on textarea', () => {
            setupFocused()
            expect(textArea.rows).toBe(3)
        });
        it('displays Hoxify button when focused to textArea', () => {
            const { queryByText } = setupFocused()
            const hoxifyButton = queryByText('Hoxify')
            expect(hoxifyButton).toBeInTheDocument()
        })
        it('displays Cancel button when focused to textArea', () => {
            const { queryByText } = setupFocused()
            const cancelButton = queryByText('Cancel')
            expect(cancelButton).toBeInTheDocument()
        })
        it('does not display Hoxify button when not focused to textarea', () => {
            const { queryByText } = setup()
            const hoxifyButton = queryByText('Hoxify')
            expect(hoxifyButton).not.toBeInTheDocument()
        });
        it('does not display Cancel button when not focused to textarea', () => {
            const { queryByText } = setup()
            const cancelButton = queryByText('Cancel')
            expect(cancelButton).not.toBeInTheDocument()
        });
        it('returns back to unfocused state after clicking the cancel', () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            const cancelButton = queryByText('Cancel')
            fireEvent.click(cancelButton)
            expect(queryByText('Cancel')).not.toBeInTheDocument()
        });
        it('calls postHox with hox request object when clicking hoxify', () => {
            const { queryByText } = setupFocused()
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            apiCalls.postHox = jest.fn().mockResolvedValue({})
            fireEvent.click(hoxifyButton)

            expect(apiCalls.postHox).toHaveBeenCalledWith({
                content: 'Test hox content'
            })
        });
        it('returns back to unfocused state after successful postHox action', async () => {
            const { queryByText } = setupFocused()
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            apiCalls.postHox = jest.fn().mockResolvedValue({})
            fireEvent.click(hoxifyButton)

            await waitFor(() => {
                expect(queryByText('Hoxify')).not.toBeInTheDocument()
            })
        });
        it('clears content after successful postHox action', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            apiCalls.postHox = jest.fn().mockResolvedValue({})
            fireEvent.click(hoxifyButton)

            await waitFor(() => {
                expect(queryByText('Test hox content')).not.toBeInTheDocument()
            })
        });
        it('clears content after clicking the cancel button',() => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            fireEvent.click(queryByText('Cancel'))

            expect(queryByText('Test hox content')).not.toBeInTheDocument()
        });
        it('disables Hoxify button when there is postHox api call', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            const mockFunction = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({})
                    }, 300)
                })
            })

            apiCalls.postHox = mockFunction
            fireEvent.click(hoxifyButton)

            fireEvent.click(hoxifyButton)
            expect(mockFunction).toHaveBeenCalledTimes(1)
        });
        it('disables Cancel button when there is postHox api call', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            const mockFunction = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({})
                    }, 300)
                })
            })

            apiCalls.postHox = mockFunction
            fireEvent.click(hoxifyButton)

            const cancelButton = queryByText('Cancel')
            expect(cancelButton).toBeDisabled()
        });
        it('displays spinner when there is a postHox API call', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            const mockFunction = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({})
                    }, 300)
                })
            })

            apiCalls.postHox = mockFunction
            fireEvent.click(hoxifyButton)

            expect(queryByText('Loading...')).toBeInTheDocument()
        });
        it('enables Hoxify button when postHox API Call fails', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            const mockFunction = jest.fn().mockRejectedValueOnce({
                response: {
                    data: {
                        validationErrors: {
                            content: 'It must have minimum 10 & maximum 5000 characters'
                        }
                    }
                }
            })

            apiCalls.postHox = mockFunction
            fireEvent.click(hoxifyButton)

            await waitFor(() => {
                expect(queryByText('Hoxify')).not.toBeDisabled()
            })
        });
        it('enables Cancel button when postHox API Call fails', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            const mockFunction = jest.fn().mockRejectedValueOnce({
                response: {
                    data: {
                        validationErrors: {
                            content: 'It must have minimum 10 & maximum 5000 characters'
                        }
                    }
                }
            })

            apiCalls.postHox = mockFunction
            fireEvent.click(hoxifyButton)

            await waitFor(() => {
                expect(queryByText('Cancel')).not.toBeDisabled()
            })
        });
        it('enables Hoxify button after successful postHox action', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            apiCalls.postHox = jest.fn().mockResolvedValue({})
            fireEvent.click(hoxifyButton)
            fireEvent.focus(textArea)
            await waitFor(() => {
                expect(queryByText('Hoxify')).not.toBeInTheDocument()
            })
        });
        it('displays validation errors when postHox API Call fails', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            const mockFunction = jest.fn().mockRejectedValueOnce({
                response: {
                    data: {
                        validationErrors: {
                            content: 'It must have minimum 10 & maximum 5000 characters'
                        }
                    }
                }
            })

            apiCalls.postHox = mockFunction
            fireEvent.click(hoxifyButton)

            await waitFor(() => {
                const validationError =
                    queryByText('It must have minimum 10 & maximum 5000 characters')
                expect(validationError).toBeInTheDocument()
            })
        });
        it('clears validation errors after clicking Cancel button', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            const mockFunction = jest.fn().mockRejectedValueOnce({
                response: {
                    data: {
                        validationErrors: {
                            content: 'It must have minimum 10 & maximum 5000 characters'
                        }
                    }
                }
            })

            apiCalls.postHox = mockFunction
            fireEvent.click(hoxifyButton)


            await waitFor(() => {})

            fireEvent.click(queryByText('Cancel'))

            await waitFor(() => {
                const validationError =
                    queryByText('It must have minimum 10 & maximum 5000 characters')
                expect(validationError).not.toBeInTheDocument()
            })
        });
        it('clears validation errors after changing content', async () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            fireEvent.change(textArea, { target: { value: 'Test hox content'}})

            const hoxifyButton = queryByText('Hoxify')

            const mockFunction = jest.fn().mockRejectedValueOnce({
                response: {
                    data: {
                        validationErrors: {
                            content: 'It must have minimum 10 & maximum 5000 characters'
                        }
                    }
                }
            })

            apiCalls.postHox = mockFunction
            fireEvent.click(hoxifyButton)


            await waitFor(() => {})
            fireEvent.change(textArea, { target: { value: 'Text hox content updated'}})

            fireEvent.click(queryByText('Cancel'))

            const validationError = queryByText('It must have minimum 10 & maximum 5000 characters')
            expect(validationError).not.toBeInTheDocument()
        });

        it('displays file attachment input when text area focused', () => {
            const { container }= setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)

            const uploadInput = container.querySelector('input')
            expect(uploadInput.type).toBe('file')
        });

        it('displays image component when file selected', async () => {
            const { container }= setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)

            const uploadInput = container.querySelector('input')

            const file = new File(
                [ 'dummy content' ],
                'example.png',
                { type: 'image/png' })
            fireEvent.change(uploadInput, { target: { files: [file] } })

            await waitFor(() => {})

            const images = container.querySelectorAll('img')
            const attachmentImage = images[1]
            expect(attachmentImage.src).toContain('data:image/png;base64')
        });

        it('removes selected image after clicking cancel', async () => {
            const { container, queryByText }= setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)

            const uploadInput = container.querySelector('input')
            const file = new File(
                [ 'dummy content' ],
                'example.png',
                { type: 'image/png' })
            fireEvent.change(uploadInput, { target: { files: [file] } })

            await waitFor(() => {})

            fireEvent.click(queryByText('Cancel'))
            fireEvent.focus(textArea)

            const images = container.querySelectorAll('img')
            expect(images.length).toBe(1)
        })

        it('calls postHoxFile when file selected', async () => {
            apiCalls.postHoxFile = jest.fn().mockResolvedValue({
                data: {
                    id: 1,
                    name: 'random-name.png'
                }
            })

            const { container } = setupFocused()

            const uploadInput = container.querySelector('input')
            expect(uploadInput.type).toBe('file')

            const file = new File(
                ['dummy content'],
                'example.png',
                {type: 'image/png'}
                )

            fireEvent.change(uploadInput, { target: { files: [file] } })

            await waitFor(() => {

            })
            expect(apiCalls.postHoxFile).toHaveBeenCalledWith(1)
        });

        it('calls postHoxFile with selected file', async (done) => {
            apiCalls.postHoxFile = jest.fn().mockResolvedValue({
                data: {
                    id: 1,
                    name: 'random-name.png'
                }
            })

            const { container } = setupFocused()

            const uploadInput = container.querySelector('input')
            expect(uploadInput.type).toBe('file')

            const file = new File(
                ['dummy content'],
                'example.png',
                {type: 'image/png'}
            )

            fireEvent.change(uploadInput, { target: { files: [file] } })

            await waitFor(() => {

            })

            const body = apiCalls.postHoxFile.mock.calls[0][0]

            const reader = new FileReader()

            reader.onloadend = () => {
                expect(reader.result).toBe('dummy content')
                done()
            }

            reader.readAsText(body.get('file'))
        });

        it('calls postHox with hox with file attachment object when clicking hoxifiy', async () => {
            apiCalls.postHoxFile = jest.fn().mockResolvedValue({
                data: {
                    id: 1,
                    name: 'random-name.png'
                }
            })
            const { queryByText, container } = setupFocused()

            const uploadInput = container.querySelector('input')
            expect(uploadInput.type).toBe('file')

            const file = new File(
                ['dummy content'],
                'example.png',
                {type: 'image/png'}
            )

            fireEvent.change(uploadInput, { target: { files: [file] } })

            await waitFor(() => {

            })

            const hoxifyButton = queryByText('Hoxify')

            apiCalls.postHox = jest.fn().mockResolvedValue({})
            fireEvent.click(hoxifyButton)

            expect(apiCalls.postHox).toHaveBeenCalledWith({
                content: 'Test hox content',
                attachment: {
                    id: 1,
                    name: 'random-name.png'
                }
            })
        });

        it('clears image after postHox success', async () => {
            apiCalls.postHoxFile = jest.fn().mockResolvedValue({
                data: {
                    id: 1,
                    name: 'random-name.png'
                }
            })
            const { queryByText, container } = setupFocused()
            fireEvent.change(textArea, { target: { value : 'Test Hox content'}})

            const uploadInput = container.querySelector('input')
            expect(uploadInput.type).toBe('file')

            const file = new File(
                ['dummy content'],
                'example.png',
                {type: 'image/png'}
            )

            fireEvent.change(uploadInput, { target: { files: [file] } })

            await waitFor(() => {

            })

            const hoxifyButton = queryByText('Hoxify')

            apiCalls.postHox = jest.fn().mockResolvedValue({})
            fireEvent.click(hoxifyButton)

            await waitFor(() => {

            })

            fireEvent.focus(textArea)

            const images = container.querySelectorAll('img')
            expect(images.length).toBe(1)
        });

        it('calls postHox without file attachment after cancelling previous file selection', async () => {
            apiCalls.postHoxFile = jest.fn().mockResolvedValue({
                data: {
                    id: 1,
                    name: 'random-name.png'
                }
            })
            const { queryByText, container } = setupFocused()
            fireEvent.change(textArea, { target: { value : 'Test Hox content'}})

            const uploadInput = container.querySelector('input')
            expect(uploadInput.type).toBe('file')

            const file = new File(
                ['dummy content'],
                'example.png',
                {type: 'image/png'}
            )

            fireEvent.change(uploadInput, { target: { files: [file] } })

            await waitFor(() => {

            })

            fireEvent.click(queryByText('Cancel'))
            fireEvent.focus(textArea)

            const hoxifyButton = queryByText('Hoxify')

            apiCalls.postHox = jest.fn().mockResolvedValue({})
            fireEvent.change(textArea, { target: { value: 'Test Hox conent' } })
            fireEvent.click(hoxifyButton)

            expect(apiCalls.postHox).toHaveBeenCalledWith({
                content: 'Test Hox content'
            })
        });
    })
})