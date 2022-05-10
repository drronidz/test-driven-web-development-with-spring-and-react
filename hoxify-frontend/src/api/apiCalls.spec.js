import axios from "axios";
import * as apiCalls from "./apiCalls";

describe('apiCalls', () => {

    describe('SignUp', () => {
        it('calls /api/1.0/users', () => {
            const mockSignUp = jest.fn()
            axios.post = mockSignUp
            apiCalls.signUp()

            const path = mockSignUp.mock.calls[0][0]
            expect(path).toBe('/api/1.0/users')
        })
    })

    describe('login', () => {
        it('calls /api/1.0/login', () => {
            const mockLogin = jest.fn()
            axios.post = mockLogin
            apiCalls.login({
                username: 'test-user',
                password: 'test-password'
            })
            const path = mockLogin.mock.calls[0][0]
            expect(path).toBe('/api/1.0/login')
        })
    })
})