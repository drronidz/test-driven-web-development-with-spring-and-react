import React from "react";
import {render, waitFor} from '@testing-library/react'
import UserPage from './UserPage'
import * as apiCalls from '../../api/apiCalls'

const mockSuccessGetUser = {
    data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    }
}

const mockFailureGetUser = {
    response: {
        data: {
            message: 'User not found'
        }
    }
}

const match = {
    params: {
        username: 'user1'
    }
}

const setup = (props) => {
    return render(<UserPage {...props}/>)
}

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
})

