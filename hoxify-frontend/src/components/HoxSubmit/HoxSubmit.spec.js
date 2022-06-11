import React from "react";
import {fireEvent, render} from '@testing-library/react'
import HoxSubmit from "./HoxSubmit";
import { Provider } from 'react-redux'
import { createStore} from "redux";
import authReducer from "../../redux/authReducer";

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
        it('displays 3 rows when focused on textarea', () => {
            const { container } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            expect(textArea.rows).toBe(3)
        });
        it('displays Hoxify button when focused to textArea', () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
            const hoxifyButton = queryByText('Hoxify')
            expect(hoxifyButton).toBeInTheDocument()
        })
        it('displays Cancel button when focused to textArea', () => {
            const { container, queryByText } = setup()
            const textArea = container.querySelector('textarea')
            fireEvent.focus(textArea)
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
    })
})