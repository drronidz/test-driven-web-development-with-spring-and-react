import React from "react";
import {fireEvent, render, waitFor} from '@testing-library/react'
import HoxFeed from "./HoxFeed";
import * as apiCalls from '../../api/apiCalls'
import {MemoryRouter} from "react-router-dom";

const originalSetInterval = window.setInterval
const originalClearInterval = window.clearInterval

let timedFunction

const useFakeIntervals = () => {
    window.setInterval = (callback, interval) => {
        timedFunction = callback
    }
    window.clearInterval = () => {
        timedFunction = undefined
    }
}

const useRealIntervals = () => {
    window.setInterval = originalSetInterval
    window.clearInterval = originalClearInterval
}

const runTimer = () => {
    timedFunction && timedFunction()
}

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

const mockSuccessGetNetHoxesList = {
    data: [
        {
            id: 21,
            content: 'This is the newest hox',
            date: 1561294668539,
            user: {
                id: 1,
                username: 'user1',
                displayName: 'display1',
                image: 'profile1.png'
            }
        }
    ]
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

const mockSuccessGetHoxesMiddleOfMultiPage = {
    data: {
        content: [
            {
                id: 1,
                content: 'This hox is in middle page',
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
        first: false,
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
            useFakeIntervals()
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
            useRealIntervals()
        });
        it('calls loadNewHoxCount with topHox id and username when rendered with user property',
            async () => {
            useFakeIntervals()
                apiCalls.loadHoxes = jest
                    .fn()
                    .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
                apiCalls.loadNewHoxCount = jest
                    .fn()
                    .mockResolvedValue({data: {count: 1}})

                const {queryByText} = setup({user: 'user1'})
                runTimer()
                await waitFor(() => {
                    queryByText('There is 1 new hox')
                    expect(apiCalls.loadNewHoxCount).toHaveBeenCalledWith(10, 'user1')
                    useRealIntervals()
                })
            });
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
                    .mockResolvedValue({data: {count: 2}})
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
                await waitFor(() => {
                    queryByText('This is 1 new hox')
                })
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
        // load new hoxes
        it('calls loadNewHoxes with hox id when clicking new hox count card', async () => {
            useFakeIntervals()

            apiCalls.loadHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadNewHoxCount = jest
                .fn()
                .mockResolvedValue({ data: { count: 1} })

            apiCalls.loadNewHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetNetHoxesList)

            const { queryByText } = setup()
            await waitFor(() => {})
            runTimer()
            await waitFor(() => {
                const newHoxCount = queryByText('There is 1 new hox')
                fireEvent.click(newHoxCount)
                const firstParam = apiCalls.loadNewHoxes.mock.calls[0][0]
                expect(firstParam).toBe(9)
                useRealIntervals()
            })

        });
        it('does not allow loadOldHoxes to be called when there is an active API call about it', async () => {
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
                fireEvent.click(loadMore)
                expect(apiCalls.loadOldHoxes).toHaveBeenCalledTimes(1)
            })
        });
        it('replaces Load More with Spinner when there is an active API call about it', async () => {
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
                const spinner = queryByText('Loading...')
                expect(spinner).toBeInTheDocument()
                expect(queryByText('Load More')).not.toBeInTheDocument()
            })
        });
        it('replaces Spinner with Load More after active api call for loadOldHoxes finishes', async () => {
           apiCalls.loadHoxes = jest
               .fn()
               .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
            apiCalls.loadOldHoxes = jest.fn().mockImplementation(() => {
                return new Promise(((resolve, reject) => {
                    setTimeout(() => {resolve(mockSuccessGetHoxesMiddleOfMultiPage)}, 300)
                }))
            })
            const { queryByText } = setup()
            await waitFor(() => {
                const loadMore = queryByText('Load More')
                fireEvent.click(loadMore)
                const middlePageHox = queryByText('This hox is in middle page')
                expect(queryByText('Loading...')).not.toBeInTheDocument()
                expect(queryByText('Load More')).toBeInTheDocument()
            })
        })
        it('replaces Spinner with Load More after active api call finishes with error', async () => {
            apiCalls.loadHoxes = jest
                .fn()
                .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)
            apiCalls.loadOldHoxes = jest.fn().mockImplementation(() => {
                return new Promise(((resolve, reject) => {
                    setTimeout(() => {
                        reject({ response : { data: {}}})},
                        300)
                }))
            })
            const { queryByText } = setup()
            await waitFor(() => {
                const loadMore = queryByText('Load More')
                fireEvent.click(loadMore)
                queryByText('This hox is in middle page')
                expect(queryByText('Loading...')).not.toBeInTheDocument()
                expect(queryByText('Load More')).toBeInTheDocument()
            })
        })
        it('displays modal when clicking delete on hox', async () => {
            apiCalls.loadHoxes =
                jest
                    .fn()
                    .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadNewHoxCount =
                jest
                    .fn()
                    .mockResolvedValue({ data: { count: 1 } })

            const { queryByTestId, container } = setup()
            await waitFor(() => {
                const deleteButton = container.querySelectorAll('button')[0]
                fireEvent.click(deleteButton)
            })


            const modalRootDiv = queryByTestId('modal-root')
            expect(modalRootDiv).toHaveClass('modal fade d-block show')
        });

        it('hides modal when clicking cancel', async () => {
            apiCalls.loadHoxes =
                jest
                    .fn()
                    .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadNewHoxCount =
                jest
                    .fn()
                    .mockResolvedValue({ data: { count: 1 } })

            const { queryByTestId, container, queryByText } = setup()
            await waitFor(() => {
                const deleteButton = container.querySelectorAll('button')[0]
                fireEvent.click(deleteButton)
                fireEvent.click(queryByText('Cancel'))
            })


            const modalRootDiv = queryByTestId('modal-root')
            expect(modalRootDiv).not.toHaveClass('d-block show')
        });

        it('displays modal with information about the action', async () => {
            apiCalls.loadHoxes =
                jest
                    .fn()
                    .mockResolvedValue(mockSuccessGetHoxesFirstOfMultiPage)

            apiCalls.loadNewHoxCount =
                jest
                    .fn()
                    .mockResolvedValue({ data: { count: 1 } })

            const { queryByTestId, container, queryByText } = setup()

            await waitFor(() => {
                const deleteButton = container.querySelectorAll('button')[0]
                fireEvent.click(deleteButton)

                const message = queryByText(`
                Are you sure to delete 'This is the latest hox'?`)

                expect(message).toBeInTheDocument()
            })

        });
    });
})