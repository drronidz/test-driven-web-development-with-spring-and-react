import React from "react";
import { render} from "@testing-library/react";
import App from "./App";
import {MemoryRouter} from "react-router-dom";

const setup = (path) => {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <App/>
        </MemoryRouter>
    )
}

describe('App', () => {

    it('displays Home Page when url is /', () => {
        const { queryByTestId } = setup('/')
        expect(queryByTestId('homepage')).toBeInTheDocument()
    })

    it('displays Login Page when url is /login', () => {
        const { container } = setup('/login')
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Login')
    })

    it('displays only Login Page when url is /login', () => {
        const { queryByTestId } = setup('/login')
        expect(queryByTestId('homepage')).not.toBeInTheDocument()
    })

    it('displays User Sign up Page when url is /signup', () => {
        const { container } = setup('/signup')
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Sign Up')

    })

    it ('displays User Page when url is other that /, /login or /signup', () => {
        const { queryByTestId } = setup('/user1')
        expect(queryByTestId('userpage')).toBeInTheDocument()
    })
})