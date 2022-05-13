import React from "react";
import { render } from '@testing-library/react'
import NavigationBar from './NavigationBar'
import {MemoryRouter} from "react-router-dom";

const setup = () => {
    return render(
        <MemoryRouter>
            <NavigationBar/>
        </MemoryRouter>
    )
}

describe('Navigation Bar', () => {

    describe('Layout',() => {

        it('has application Logo (Hoaxify Logo)', () => {
            const { container } = setup()
            const image = container.querySelector('img')
            expect(image.src).toContain('hoaxify-logo.png')
        })

        it('has link to home from logo', () => {
            const { container } = setup()
            const image = container.querySelector('img')
            expect(image.parentElement.getAttribute('href')).toBe('/')
        })

        it('has link to Sign Up', () => {
            const { queryByText } = setup()
            const signUpLink = queryByText('Sign Up')
            expect(signUpLink.getAttribute('href')).toBe('/signup')
        })

        it('has link to Login', () => {
            const { queryByText } = setup()
            const signUpLink = queryByText('Login')
            expect(signUpLink.getAttribute('href')).toBe('/login')
        })
    })
})