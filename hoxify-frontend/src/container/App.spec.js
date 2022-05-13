import React from "react";
import {fireEvent, render} from "@testing-library/react";
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
        expect(queryByTestId('login')).not.toBeInTheDocument()
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

    it('displays Navigation Bar when url is /', () => {
        const { container } = setup('/')
        const navigationBar = container.querySelector('nav')
        expect(navigationBar).toBeInTheDocument()
    })

    it('displays Navigation Bar when url is /login', () => {
        const { container } = setup('/login')
        const navigationBar = container.querySelector('nav')
        expect(navigationBar).toBeInTheDocument()
    })

    it('displays Navigation Bar when url is /signup', () => {
        const { container } = setup('/signup')
        const navigationBar = container.querySelector('nav')
        expect(navigationBar).toBeInTheDocument()
    })

    it('displays Navigation Bar when url is /user1', () => {
        const { container } = setup('/user1')
        const navigationBar = container.querySelector('nav')
        expect(navigationBar).toBeInTheDocument()
    })

    it('shows the User Sign Up Page when clicking Sign Up', () => {
        const { queryByText, container } = setup('/')
        const signUpLink = queryByText('Sign Up')
        fireEvent.click(signUpLink)
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Sign Up')
    })

    it('shows the Login Page when clicking Login', () => {
        const { queryByText, container } = setup('/')
        const loginLink = queryByText('Login')
        fireEvent.click(loginLink)
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent('Login')
    })

    it('shows the Home Page when clicking the logo', () => {
        const { queryByTestId, container } = setup('/login')
        const logo = container.querySelector('img')
        fireEvent.click(logo)
        expect(queryByTestId('homepage')).toBeInTheDocument()
    })
})