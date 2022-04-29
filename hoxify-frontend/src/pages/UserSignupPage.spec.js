import React from "react";

import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserSignUpPage from "./UserSignupPage";

describe('UserSignUpPage', () => {
    describe('Layout', () => {
        it('has header of Sign Up', () => {
            const { container } = render(<UserSignUpPage/>)
            const header = container.querySelector('h1')
            expect(header).toHaveTextContent('Sign Up')
        })
    })
})