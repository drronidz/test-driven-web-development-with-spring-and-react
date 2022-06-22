import React from "react";
import {fireEvent, render, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import HoxFeed from "./HoxFeed";
import * as apiCalls from '../../api/apiCalls'
import {MemoryRouter} from "react-router-dom";
import {wait} from "@testing-library/user-event/dist/utils";

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
            },
            {
                id: 9,
                content: 'This is the hox 9',
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

const mockSuccessGetHoxesLastOfMultiPage = {
    data: {
        content: [
            {
                id: 1,
                content: 'This is the oldest hox',
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
            setup({user: 'user1'})
            expect(apiCalls.loadHoxes).toHaveBeenCalledWith('user1')
        });
        it('calls loadHoxes without user parameter when it is rendered without user property', () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockEmptyResponse)
            setup()
            const parameter = apiCalls.loadHoxes.mock.calls[0][0]
            expect(parameter).toBeUndefined()
        });
        it('calls loadNewHoxCount with topHox id', async () => {
            apiCalls.loadOldHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadNewHoxCount = jest
                .fn()
                .mockResolvedValue({data: {count: 1}})

            await waitFor(() => {
                const {queryByText} = setup()
                queryByText('This is the latest hox')
            })
            const firstParam = apiCalls.loadNewHoxCount.mock.calls[0][0]
            expect(firstParam).toBe(10)
        }, 7000);
        it('calls loadNewHoxCount with topHox id and username when rendered with user property',
            async () => {
                apiCalls.loadHoxes = jest
                    .fn()
                    .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
                apiCalls.loadNewHoxCount = jest
                    .fn()
                    .mockResolvedValue({data: {count: 1}})

                const {queryByText} = setup({user: 'user1'})
                await waitFor(() => {
                    queryByText('There is 1 new hox')
                    expect(apiCalls.loadNewHoxCount).toHaveBeenCalledWith(10, 'user1')
                })
            }, 7000);
        it('displays new hox count as 1 after loadNewHoxCount success',
            async () => {
                apiCalls.loadHoxes = jest
                    .fn()
                    .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
                apiCalls.loadNewHoxCount = jest
                    .fn()
                    .mockResolvedValue({data: {count: 1}})

                const {queryByText} = setup({user: 'user1'})
                await waitFor(() => {
                    const newHoxCount = queryByText('There is 1 new hox')
                    expect(newHoxCount).toBeInTheDocument()
                })
            });
        it('displays new hox count constantly',
            async () => {
                apiCalls.loadHoxes = jest
                    .fn()
                    .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
                apiCalls.loadNewHoxCount = jest
                    .fn()
                    .mockResolvedValue({data: {count: 1}})
                const {queryByText} = setup({user: 'user1'})
                await waitFor(() => queryByText('There is 1 new hox'))
                apiCalls.loadNewHoxCount = jest
                    .fn()
                    .mockResolvedValue({ data: {count: 2 } })
                await waitFor(() => {
                    const newHoxCount = queryByText('There are 2 new hoxes')
                    expect(newHoxCount).toBeInTheDocument()
                })
        }, 7000)
        it('does not call loadNewHoxCount after component is unmounted',
            async (done) => {
                apiCalls.loadHoxes = jest
                    .fn()
                    .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
                apiCalls.loadNewHoxCount = jest
                    .fn()
                    .mockResolvedValue({data: {count: 1}})
                const {queryByText, unmount} = setup({user: 'user1'})
                await waitFor(() => {queryByText('This is 1 new hox')})
                unmount()
                setTimeout(() => {
                    expect(apiCalls.loadNewHoxCount).toHaveBeenCalledTimes(1)
                    done()
                }, 3500)
        }, 7000);

    });
    describe('Layout', () => {
        it('displays no hox message when the response has empty page', async () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockEmptyResponse)
            const {queryByText} = setup()
            await waitFor(() => {
                const message = queryByText('There are no hoxes')
                expect(message).toBeInTheDocument()
            })

        });
        it('does not display no hox message when the response has page of hox', async () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockSuccessGetHoxesSinglePage)
            const {queryByText} = setup()
            await waitFor(() => {
                const message = queryByText('There are no hoxes')
                expect(message).not.toBeInTheDocument()
            })
        });
        it('displays spinner when loading the hoxes', async () => {
            apiCalls.loadHoxes = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(mockSuccessGetHoxesSinglePage)
                    }, 300)
                })
            })
            const {queryByText} = setup()
            expect(queryByText('Loading...')).toBeInTheDocument()
            await waitFor(() => {
            })
        });
        it('displays hox content', async () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockSuccessGetHoxesSinglePage)
            const {queryByText} = setup()
            await waitFor(() => {
                const hoxContent = queryByText('This is the latest hox')
                expect(hoxContent).toBeInTheDocument()
            })
        })
        it('displays load more when there are next pages', async () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
            const {queryByText} = setup()
            await waitFor(() => {
                const loadMore = queryByText('Load More')
                expect(loadMore).toBeInTheDocument()
            })
        });
    });

    describe('Interactions', () => {
        it('calls loadOldHoxes with hox id when clicking on Load More', async () => {
            apiCalls.loadHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadOldHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesLastOfMultiPage)

            const {queryByText} = setup()
            await waitFor(() => {
                const loadMore = queryByText('Load More')
                fireEvent.click(loadMore)
                const firstParam = apiCalls.loadOldHoxes.mock.calls[0][0]
                expect(firstParam).toBe(9)
            })
        });
        it('calls loadOldHoxes with hox id & username when clicking on Load More when rendered with user property', async () => {
            apiCalls.loadHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadOldHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesLastOfMultiPage)

            const {queryByText} = setup({user: 'user1'})
            await waitFor(() => {
                const loadMore = queryByText('Load More')
                fireEvent.click(loadMore)
                expect(apiCalls.loadOldHoxes).toHaveBeenCalledWith(9, 'user1')
            })
        });
        it('displays loaded old hox when loadOldHoxes API call success', async () => {
            apiCalls.loadHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadOldHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesLastOfMultiPage)

            const {queryByText} = setup()
            await waitFor(() => {
                const loadMore = queryByText('Load More')
                fireEvent.click(loadMore)
                const oldHox = queryByText('This is the oldest hox')
                expect(oldHox).toBeInTheDocument()
            })
        });
        it('hides Load More when loadOldHoxes API call returns last page', async () => {
            apiCalls.loadHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadOldHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesLastOfMultiPage)

            const {queryByText} = setup()
            let loadMore
            await waitFor(() => {
                loadMore = queryByText('Load More')
                fireEvent.click(loadMore)
            })

            await waitFor(() => {
                queryByText('This is the oldest hox')
                expect(queryByText('Load More')).not.toBeInTheDocument()
            })

        });
    });
})