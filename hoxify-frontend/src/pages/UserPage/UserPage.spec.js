import React from "react";
import {fireEvent, queryByTestId, render, waitFor} from '@testing-library/react'
import UserPage from './UserPage'
import * as apiCalls from '../../api/apiCalls'
import {Provider} from "react-redux";
import configStore from "../../redux/configStore";
import axios from "axios";
import {wait} from "@testing-library/user-event/dist/utils";

const mockSuccessGetUser = {
    data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    }
}

const mockSuccessUpdateUser = {
    data: {
        id: 1,
        username: 'user1',
        displayName: 'display1-update',
        image: 'profile1-update.png',
    },
};

const mockFailureGetUser = {
    response: {
        data: {
            message: 'User not found'
        }
    }
}

const mockFailUpdateUser = {
    response: {
        data: {
            validationErrors: {
                displayName: 'It must have minimum of 4 and maximum of 255 characters',
                image: 'Only PNG and JPEG files are allowed'
            }
        }
    }
}

const mockDelayedUpdateSuccess = () => {
    return jest.fn().mockImplementation(() => {
        return new Promise(((resolve, reject) => {
            setTimeout(() => {
                resolve(mockSuccessUpdateUser)
            }, 300)
        }))
    })
}

const match = {
    params: {
        username: 'user1'
    }
}

beforeEach(() => {
    localStorage.clear()
    delete axios.defaults.headers.common['Authorization']
})

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

let store
const setup = (props) => {
    store = configStore(false)
    return render(
        <Provider store={store}>
            <UserPage {...props}/>
        </Provider>
    )
}

apiCalls.listUsers = jest.fn().mockResolvedValue({
    data: {
        content: [],
        number: 0,
        size: 3
    }
})

apiCalls.loadHoxes = jest.fn().mockResolvedValue({
    data: {
        content: [],
        number: 0,
        size: 3
    }
})

describe('UserPage', () => {

    describe('Layout', () => {

        it('has root page div', () => {
            const {queryByTestId} = setup()
            const homePageDiv = queryByTestId('userpage')
            expect(homePageDiv).toBeInTheDocument()
        })

        it('displays the displayName@username when user data loaded',async () => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser)
            const { queryByText } = setup({match})
            await waitFor(() => {
                const text = queryByText('display1@user1')
                expect(text).toBeInTheDocument()
            })
        })

        it('displays not found alert when user not found', async () => {
            apiCalls.getUser = jest.fn().mockRejectedValue(mockFailureGetUser)
            const { queryByText } = setup({ match })
            await waitFor(() => {
                const alert = queryByText('User not found')
                expect(alert).toBeInTheDocument()
            })
        })

        it('displays Spinner while loading user DATA', () => {
            apiCalls.getUser = jest.fn().mockImplementation(() => {
                return new Promise(((resolve, reject) => {
                    setTimeout(() => {
                        resolve(mockSuccessGetUser)
                    }, 300)
                }))
            })
            const { queryByText } = setup({ match })
            const spinner = queryByText('Loading...')
            expect(spinner).toBeInTheDocument()
        })

        it('displays the edit button when logged in User matches to user in url', async () => {
            setupUserOneLoggedInLocalStorage()
            apiCalls.getUser = jest
                .fn()
                .mockResolvedValue(mockSuccessGetUser)
            const { queryByText } = setup({ match })
            await waitFor(() => {
                queryByText('display1@user1')
                const editButton = queryByText('Edit')
                expect(editButton).toBeInTheDocument()
            })

        })
    })

    describe('Life cycle', () => {

        it('calls getUser when it is rendered', () => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser)
            setup({match})
            expect(apiCalls.getUser).toHaveBeenCalledTimes(1)
        })

        it('calls getUser for user1 when it is rendered with user1 in match',() => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser)
            setup({match})
            expect(apiCalls.getUser).toHaveBeenCalledWith('user1')
        })
    })

    describe('ProfileCard Interactions', () => {
        const setupForEdit = async () => {
            setupUserOneLoggedInLocalStorage()
            let editButton
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser)
            const rendered = setup({ match })
            await waitFor(() => {
                editButton = rendered.queryByText('Edit')
                fireEvent.click(editButton)
            })
            return rendered
        }

        it('displays edit layout when clicking edit button', async () => {
            const { queryByText } = await setupForEdit()
            expect(queryByText('Save')).toBeInTheDocument()
        })

        it('returns back to none edit mode after clicking cancel' ,async () => {
            const { queryByText } = await setupForEdit()

            const cancelButton = queryByText('Cancel')
            fireEvent.click(cancelButton)

            expect(queryByText('Edit')).toBeInTheDocument()
        })

        it('calls updateUser API when clicking save', async () => {
            const { queryByText } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessGetUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            expect(apiCalls.updateUser).toHaveBeenCalledTimes(1)
        })

        it('calls userUpdate API with user id', async () => {
            const { queryByText } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessGetUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            const userId = apiCalls.updateUser.mock.calls[0][0]
            expect(userId).toBe(1)
        })

        it('calls updateUser API with request body having changed displayName' , async () => {
            const { queryByText, container } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessGetUser)

            const displayInput = container.querySelector('input')
            fireEvent.change(displayInput, { target : { value: 'display1-updated'}})

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            const requestBody = apiCalls.updateUser.mock.calls[0][1]

            expect(requestBody.displayName).toBe('display1-updated')
        })

        it('returns to non edit mode after a successful updateUser API call', async () => {
            const { queryByText } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessGetUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            await waitFor(() => {
                const editButtonAfterClickingSave = queryByText('Edit')
                expect(editButtonAfterClickingSave).toBeInTheDocument()
            })
        })

        it('returns to original displayName after its changed in edit mode but cancelled', async () => {
            const { queryByText, container } = await setupForEdit()
            const displayInput = container.querySelector('input')
            fireEvent.change(displayInput, { target : { value: 'display1-updated'}})

            const cancelButton = queryByText('Cancel')
            fireEvent.click(cancelButton)

            const originalDisplayText = queryByText('display1@user1')
            expect(originalDisplayText).toBeInTheDocument()
        })

        it('returns to last updated displayName when display is changed for another time but cancelled', async () => {
            let editButtonAfterClickingSave
            const { queryByText, container } = await setupForEdit()
            let displayInput = container.querySelector('input')
            fireEvent.change(displayInput, { target : { value: 'display1-updated'}})
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            await waitFor(() => {
                editButtonAfterClickingSave = queryByText('Edit')
                fireEvent.click(editButtonAfterClickingSave)
            })

            displayInput = container.querySelector('input')
            fireEvent.change(displayInput, { target: { value : 'display1-update-second-time' } })

            const cancelButton = queryByText('Cancel')
            fireEvent.click(cancelButton)

            const lastSavedData = container.querySelector('h4')

            expect(lastSavedData).toHaveTextContent('display1-updated@user1')
        })

        it('displays Spinner when there is an update User API call', async () => {
            let editButtonAfterClickingSave
            const { queryByText, container } = await setupForEdit()
            apiCalls.updateUser = mockDelayedUpdateSuccess()


            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)
            const spinner = queryByText('Loading...')
            expect(spinner).toBeInTheDocument()
        })

        it('disables cancel button when there is update User API call', async () => {
            const { queryByText } = await setupForEdit()
            apiCalls.updateUser = mockDelayedUpdateSuccess()

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            const cancelButton = queryByText('Cancel')

            expect(cancelButton).toBeDisabled()
        })

        it('enables save button after updateUser API call success', async () => {
            const { queryByText, container } = await setupForEdit()
            let displayInput = container.querySelector('input')
            fireEvent.change(displayInput, {
                target: {
                    value: 'display1-update'
                }
            })
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            await waitFor(() => {
                const editButtonAfterClickingSave = queryByText('Edit')
                fireEvent.click(editButtonAfterClickingSave)
            })

            const saveButtonAfterSecondEdit = queryByText('Save')

            expect(saveButtonAfterSecondEdit).not.toBeDisabled()
        })

        it('enables save button after updateUser api call fails', async () => {
            const { queryByText, container } = await setupForEdit()
            let displayInput = container.querySelector('input')
            fireEvent.change(displayInput, {
                target: {
                    value: 'display1-update'
                }
            })
            apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(saveButton).not.toBeDisabled()
            })
        })

        it('displays the selected image in edit mode', async () => {
            const { container } = await setupForEdit()

            const inputs = container.querySelectorAll('input')
            const uploadInput = inputs[1]

            const file = new File(
                ['dummy content'],
                'example.png',
                { type: 'image/png'})

            fireEvent.change(uploadInput, {
                target: {
                   files: [file]
                }
            })

            await waitFor(() => {
                const image = container.querySelector('img')
                expect(image.src).toContain('data:image/png;base64')
            })
        })

        it('returns back to the original image even the new image to upload box but canceled', async () => {
            const { queryByText, container } = await setupForEdit()

            const inputs = container.querySelectorAll('input')
            const uploadInput = inputs[1]

            const file = new File(
                ['dummy content'],
                'example.png',
                { type: 'image/png'})

            fireEvent.change(uploadInput, {
                target: {
                    files: [file]
                }
            })
            const cancelButton = queryByText('Cancel')
            fireEvent.click(cancelButton)

            await waitFor(() => {
                const image = container.querySelector('img')
                expect(image.src).toContain('/assets/default-avatar.png')
            })
        })

        it('does not throw error after file not selected', async () => {
            const { container }  = await setupForEdit()
            const inputs = container.querySelectorAll('input')
            const uploadInput = inputs[1]
            expect(() => fireEvent.change(uploadInput, {
                target: {
                    files: []
                }
            })).not.toThrow()
        })

        it('calls updateUse API with request body having new image without data:image/png;base64', async () => {
            const { queryByText, container } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser)

            const inputs = container.querySelectorAll('input')
            const uploadInput = inputs[1]

            const file = new File(['dummy content'], 'example.png', {
                type: 'image/png'
            })

            fireEvent.change(uploadInput, {
                target: {
                    files: [file]
                }
            })

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            const requestBody = apiCalls.updateUser.mock.calls[0][1]

            expect(requestBody.image).not.toContain('data:image/png;base64')
        })

        it('returns to last updated image when image is change for another time but cancelled', async () => {
            const { queryByText, container } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser)

            const inputs = container.querySelectorAll('input')
            const uploadInput = inputs[1]

            const file = new File(['dummy content'], 'example.png', {
                type: 'image/png'
            })

            fireEvent.change(uploadInput, {
                target: {
                    files: [file]
                }
            })

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            await waitFor(() => {
                const editButtonAfterClickingSave = queryByText('Edit')
                fireEvent.click(editButtonAfterClickingSave)
            })

            const newFile = new File(['another content'], 'example2.png', {
                type: 'image/png'
            })

            fireEvent.change(uploadInput, {
                target: {
                    files: [newFile]
                }
            })

            const cancelButton = queryByText('Cancel')
            fireEvent.click(cancelButton)
            const image = container.querySelector('img')

            expect(image.src).toContain('/images/profile/profile1-update.png')
        })

        it('displays validation error for displayName when update api fails', async () => {
            const { queryByText } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            await waitFor(() => {
                const errorMessage = queryByText('It must have minimum of 4 and maximum of 255 characters')
                expect(errorMessage).toBeInTheDocument()
            })
        })

        it('displays validation error for file when update API fails', async () => {
            const { queryByText } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            await waitFor(() => {
                const errorMessage = queryByText('Only PNG and JPEG files are allowed')
                expect(errorMessage).toBeInTheDocument()
            })
        })

        it('removes validation error for displayName when user changes the displayName', async () => {
            const { queryByText, container } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)



            await waitFor(() => {
                const displayInput = container.querySelectorAll('input')[0]
                fireEvent.change(displayInput, {
                    target: {
                        value: 'new-display-name'
                    }
                })
                const errorMessage = queryByText('It must have minimum of 4 and maximum of 255 characters')
                expect(errorMessage).not.toBeInTheDocument()
            })
        })

        it('removes validation error for file when user changes the file', async () => {
            const { queryByText, container } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            await waitFor(() => {
                const fileInput = container.querySelectorAll('input')[1]

                const newFile = new File(['another content'], 'example2.png', {
                    type: 'image/png'
                })

                fireEvent.change(fileInput, {
                    target: {
                        files: [newFile]
                    }
                })
                const errorMessage = queryByText('Only PNG and JPEG files are allowed')
                expect(errorMessage).not.toBeInTheDocument()
            })
        })

        it('removes validation error if user cancels', async () => {
            const { queryByText } = await setupForEdit()
            apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser)

            const saveButton = queryByText('Save')
            let cancelButton
            let editButton

            fireEvent.click(saveButton)

            await waitFor(() => {
                cancelButton = queryByText('Cancel')
                editButton = queryByText('Edit')
                fireEvent.click(cancelButton)
                fireEvent.click(editButton)
            })


            await  waitFor(() => {
                const errorMessage = queryByText('It must have minimum of 4 and maximum of 255 characters')
                expect(errorMessage).not.toBeInTheDocument()
            })
        })

        it('updates redux state after updateUser API call success', async () => {
            const { queryByText, container } = await setupForEdit()
            let displayInput = container.querySelector('input')
            fireEvent.change(displayInput, {
                target: {
                    value: 'display1-update'
                }
            })
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)
            await waitFor(() => {})
            const storedUserData = store.getState()
            expect(storedUserData.image).toBe(mockSuccessUpdateUser.data.image)
        });

        it('updates localStorage after updateUser api call success', async () => {
            const { queryByText, container } = await setupForEdit()
            let displayInput = container.querySelector('input')
            fireEvent.change(displayInput, {
                target: {
                    value: 'display1-update'
                }
            })
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser)

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)
            await waitFor(() => {})
            const storedUserData = JSON.parse(localStorage.getItem('hoax-auth'))
            expect(storedUserData.displayName).toBe(mockSuccessUpdateUser.data.displayName)
            expect(storedUserData.image).toBe(mockSuccessUpdateUser.data.image)
        })
    })
})

