import React from "react";
import {render, waitFor} from '@testing-library/react'
import UserList from './UserList'
import * as apiCalls from '../../api/apiCalls'

const setup = () => {
    return render(<UserList/>)
}

apiCalls.listUsers = jest.fn().mockResolvedValue({
    data: {
        content: [],
        number: 0,
        size: 3
    }
})

const mockedEmptySuccessResponse = {
    data: {
        content: [],
        number: 0,
        size: 3
    }
}

const mockSuccessGetSinglePage = {
    data: {
        content: [
            { username: 'user1', displayName: 'display1', image: ''},
            { username: 'user2', displayName: 'display2', image: ''},
            { username: 'user3', displayName: 'display3', image: ''}
        ],
        number: 0,
        first: true,
        last: true,
        size: 3,
        totalPages: 1
    }
}

describe('UserList', () => {

    describe("Layout", () => {

        it('has header of Users', () => {
            const { container } = setup()
            const header = container.querySelector('h3')
            expect(header).toHaveTextContent("Users")
        })

        it('displays three items when listUsers API returns three users', async () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetSinglePage)
            const { queryByTestId } = setup()
            await waitFor(() => {
                const userGroup = queryByTestId("usergroup")
                expect(userGroup.childElementCount).toBe(3)
            })
        })

        it('displays the displayName@username when listUser API returns users', async () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetSinglePage)
            const { queryByText } = setup()
            await waitFor(() => {
                const firstUser = queryByText('display1@user1')
                expect(firstUser).toBeInTheDocument()
            })

        })
    })

    describe("Life cycle", () => {
        it('calls listUsers API when it is rendered', () => {
            apiCalls.listUsers = jest
                .fn()
                .mockResolvedValue(mockedEmptySuccessResponse)
            setup()
            expect(apiCalls.listUsers).toHaveBeenCalledTimes(1)
        })

        it("calls listUsers method with page zero and size three", () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockedEmptySuccessResponse)
            setup()
            expect(apiCalls.listUsers).toHaveBeenCalledWith({ page: 0, size: 3})
        })
    })

})