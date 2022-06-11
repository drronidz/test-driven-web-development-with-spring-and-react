import React from "react";
import { render } from '@testing-library/react'
import HomePage from './HomePage'
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
            <HomePage/>
        </Provider>
    )
}

describe('HomePage', () => {
    describe('Layout', () => {
        it('has root page div', () => {
            const {queryByTestId} = setup()
            const homePageDiv = queryByTestId('homepage')
            expect(homePageDiv).toBeInTheDocument()
        })
    })
})

