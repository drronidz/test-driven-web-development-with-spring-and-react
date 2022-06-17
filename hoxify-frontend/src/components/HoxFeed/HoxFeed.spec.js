import React from "react";
import { render } from '@testing-library/react'
import HoxFeed from "./HoxFeed";
import * as apiCalls from '../../api/apiCalls'

const setup = props => {
    return render(<HoxFeed {...props}/>)
}

const mockEmptyResponse = {
    data: {
        content: []
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
        it('displays no hox message when the response has empty page', () => {
            apiCalls.loadHoxes = jest.fn().mockResolvedValue(mockEmptyResponse)
            const { queryByText } = setup()
            expect(queryByText('There are no hoxes')).toBeInTheDocument()
        });
    });
})