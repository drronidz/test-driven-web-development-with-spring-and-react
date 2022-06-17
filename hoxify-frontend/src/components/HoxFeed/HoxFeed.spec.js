import React from "react";
import {render, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import HoxFeed from "./HoxFeed";
import * as apiCalls from '../../api/apiCalls'
import {MemoryRouter} from "react-router-dom";

const setup = props => {
    return render(
        <MemoryRouter>
            <HoxFeed {...props}/>
        </MemoryRouter>
    )
}

const mockEmptyResponse = {
    data: {
        content: []
    }
}

const mockSuccessGetHoxesSinglePage = {
    data: {
        content: [
            {
                id: 10,
                content: 'This is the latest hox',
                date: 1561294668539,
                user: {
                    id: 1,
                    username: 'user1',
                    displayName: 'display1',
                    image: 'profile1.png'
                }
            }
        ],
        number: 0,
        first: true,
        last: true,
        size: 5,
        totalPages: 1
    }
}

const mockSuccessGetHoxesFirstOfMultiPage = {
    data: {
        content: [
            {
                id: 10,
                content: 'This is the latest hox',
                date: 1561294668539,
                user: {
                    id: 1,
                    username: 'user1',
                    displayName: 'display1',
                    image: 'profile1.png'
                }
            }
        ],
        number: 0,
        first: true,
        last: false,
        size: 5,
        totalPages: 2
    }
}

describe('HoxFeed', () => {
    describe('Lifecycle', () => {
        it('calls loadHoxes when it is rendered', () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockEmptyResponse)
            setup()
            expect(apiCalls.loadHoxes).toHaveBeenCalled()
        });
        it('calls loadHoxes with user parameter when it is rendered with user property', () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockEmptyResponse)
            setup({ user: 'user1'})
            expect(apiCalls.loadHoxes).toHaveBeenCalledWith('user1')
        });
        it('calls loadHoxes without user parameter when it is rendered without user property', () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockEmptyResponse)
            setup()
            const parameter = apiCalls.loadHoxes.mock.calls[0][0]
            expect(parameter).toBeUndefined()
        });
    });
    describe('Layout', () => {
        it('displays no hox message when the response has empty page', async () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockEmptyResponse)
            const { queryByText } = setup()
            await waitFor(() => {
                const message = queryByText('There are no hoxes')
                expect(message).toBeInTheDocument()
            })

        });
        it('does not display no hox message when the response has page of hox', async () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockSuccessGetHoxesSinglePage)
            const { queryByText } = setup()
            await waitFor(() => {
                const message = queryByText('There are no hoxes')
                expect(message).not.toBeInTheDocument()
            })
        });
        it('displays spinner when loading the hoxes', () => {
            apiCalls.loadHoxes = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(mockSuccessGetHoxesSinglePage)
                    }, 300)
                })
            })
            const { queryByText } = setup()
            expect(queryByText('Loading...')).toBeInTheDocument()
        });
        it('displays hox content', async () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockSuccessGetHoxesSinglePage)
            const { queryByText } = setup()
            await waitFor(() => {
                const hoxContent = queryByText('This is the latest hox')
                expect(hoxContent).toBeInTheDocument()
            })
        })
        it('displays load more when there are next pages', async () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
            const { queryByText } = setup()
            await waitFor(() => {
                const loadMore = queryByText('Load More')
                expect(loadMore).toBeInTheDocument()
            })
        });
    });
})