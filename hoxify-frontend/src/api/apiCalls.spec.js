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

    describe('listUser', () => {

        it('calls /api/1.0/users?page=0&size3 when no param provided for listUsers', () => {
            const mockListUsers = jest.fn()
            axios.get = mockListUsers
            apiCalls.listUsers()
            expect(mockListUsers).toBeCalledWith("/api/1.0/users?page=0&size=3")
        })

        it("calls /api/1.0/users?page=5&size=10 when corresponding params provided for listUsers", () => {
            const mockListUsers = jest.fn()
            axios.get = mockListUsers
            apiCalls.listUsers({ page: 5, size: 10})
            expect(mockListUsers).toBeCalledWith("/api/1.0/users?page=5&size=10")
        })

        it("calls /api/1.0/users?page=5&size=3 when only page param provided for listUsers", () => {
            const mockListUsers = jest.fn()
            axios.get = mockListUsers
            apiCalls.listUsers({ page: 5 })
            expect(mockListUsers).toBeCalledWith("/api/1.0/users?page=5&size=3")
        })

        it("calls /api/1.0/users?page=0&size=5 when only size param provided for listUsers", () => {
            const mockListUsers = jest.fn()
            axios.get = mockListUsers
            apiCalls.listUsers({ size: 5})
            expect(mockListUsers).toBeCalledWith("/api/1.0/users?page=0&size=5")
        })
    })

    describe('getUser', () => {
        it('calls /api/1.0/users/user5 when user5 is provided for getUser', () => {
            const mockGetUser = jest.fn()
            axios.get = mockGetUser
            apiCalls.getUser('user5')
            expect(mockGetUser).toBeCalledWith('/api/1.0/users/user5')
        })
    })

    describe('updateUser', () => {
        it('calls /api/1.0/users/5 when 5 is provided for updateUser', () => {
            const mockUpdateUser = jest.fn()
            axios.put = mockUpdateUser
            apiCalls.updateUser('5')
            const path = mockUpdateUser.mock.calls[0][0]
            expect(path).toBe('/api/1.0/users/5')
        })
    })

    describe('postHox', () => {
        it('calls /api/1.0/hoxes', () => {
            const mockPostHox = jest.fn()
            axios.post = mockPostHox
            apiCalls.postHox()
            const path = mockPostHox.mock.calls[0][0]
            expect(path).toBe('/api/1.0/hoxes')
        })
    })

    describe('loadHoxes', () => {
        it('calls /api/1.0/hoxes?page=0&size=5&sort=id,desc when no param provided', () => {
            const mockGetHoxes = jest.fn()
            axios.get = mockGetHoxes
            apiCalls.loadHoxes()
            expect(mockGetHoxes)
                .toBeCalledWith('/api/1.0/hoxes?page=0&size=5&sort=id,desc')
        });
        it('calls /api/1.0/users/user1/hoxes?page=0&size=5&sort=id,desc when user param is provided', () => {
            const mockGetHoxes = jest.fn()
            axios.get = mockGetHoxes
            apiCalls.loadHoxes('user1')
            expect(mockGetHoxes)
                .toBeCalledWith('/api/1.0/users/user1/hoxes?page=0&size=5&sort=id,desc')
        });
    });

    describe('loadOldHoxes', () => {
        it('calls /api/1.0/hoxes/5?direction=before?&page=0&size=5&sort=id,desc when hox id param is provided', () => {
            const mockGetHoxes = jest.fn()
            axios.get = mockGetHoxes
            apiCalls.loadOldHoxes(5)
            expect(mockGetHoxes)
                .toBeCalledWith('/api/1.0/hoxes/5?direction=before?&page=0&size=5&sort=id,desc')
        });
        it('calls /api/1.0/users/user3/hoxes/5?direction=before?&page=0&size=5&sort=id,desc when hox id & username params are provided', () => {
            const mockGetHoxes = jest.fn()
            axios.get = mockGetHoxes
            apiCalls.loadOldHoxes(5, 'user3')
            expect(mockGetHoxes)
                .toBeCalledWith('/api/1.0/users/user3/hoxes/5?direction=before?&page=0&size=5&sort=id,desc')
        });
    });

    describe('loadNewHoxes', () => {
        it('calls /api/1.0/hoxes/5?direction=after?&page=0&size=5&sort=id,desc when hox id param is provided', () => {
            const mockGetHoxes = jest.fn()
            axios.get = mockGetHoxes
            apiCalls.loadNewHoxes(5)
            expect(mockGetHoxes)
                .toBeCalledWith('/api/1.0/hoxes/5?direction=after&sort=id,desc')
        });
        it('calls /api/1.0/users/user3/hoxes/5?direction=after?&sort=id,desc when hox id & username params are provided', () => {
            const mockGetHoxes = jest.fn()
            axios.get = mockGetHoxes
            apiCalls.loadNewHoxes(5, 'user3')
            expect(mockGetHoxes)
                .toBeCalledWith('/api/1.0/users/user3/hoxes/5?direction=after&sort=id,desc')
        });
    });

    describe('loadNewHoxCount', () => {
        it('calls /api/1.0/hoxes/5?direction=after&count=true when hox id param is provided', () => {
            const mockGetHoxes = jest.fn()
            axios.get = mockGetHoxes
            apiCalls.loadNewHoxCount(5)
            expect(mockGetHoxes)
                .toBeCalledWith('/api/1.0/hoxes/5?direction=after&count=true')
        });
        it('calls /api/1.0/users/user3/hoxes/5?direction=after?&sort=id,desc when hox id & username params are provided', () => {
            const mockGetHoxes = jest.fn()
            axios.get = mockGetHoxes
            apiCalls.loadNewHoxes(5, 'user3')
            expect(mockGetHoxes)
                .toBeCalledWith('/api/1.0/users/user3/hoxes/5?direction=after&sort=id,desc')
        });
    });
})