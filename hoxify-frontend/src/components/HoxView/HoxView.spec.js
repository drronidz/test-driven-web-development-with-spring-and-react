import React from "react";
import {render} from '@testing-library/react'
import HoxView from "./HoxView";
import {MemoryRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore} from "redux";
import authReducer from "../../redux/authReducer";

const loggedInStateUserOne = {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile.png',
    password: 'AZerty12',
    isLoggedIn: true
}

const loggedInStateUserTwo = {
    id: 2,
    username: 'user2',
    displayName: 'display2',
    image: 'profile2.png',
    password: 'AZerty34',
    isLoggedIn: true
}

const hoxWithoutAttachment = {
    id: 10,
    content: 'This is the first hox',
    user: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    }
}

const hoxWithAttachment = {
    id: 10,
    content: 'This is the first hox',
    user: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    },
    attachment: {
        fileType: 'image/png',
        name: 'attached-image.png'
    }
}

const hoxWithPDFAttachment = {
    id: 10,
    content: 'This is the first hox',
    user: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    },
    attachment: {
        fileType: 'application/pdf',
        name: 'attached-file.pdf'
    }
}

const setup = (hox = hoxWithoutAttachment, state = loggedInStateUserOne) => {
    const oneMinute = 60 * 1000
    hox.date = new Date(new Date() - oneMinute)
    const store = createStore(authReducer, state)
    return render(
        <Provider store={store}>
            <MemoryRouter>
                <HoxView hox={hoxWithoutAttachment}/>
            </MemoryRouter>
        </Provider>)
}

describe('HoxView' , () => {
    describe('Layout', () => {
        it('displays hox content', () => {
            const { queryByText } = setup()
            expect(queryByText('This is the first hox')).toBeInTheDocument()
        })
        it('displays user image', () => {
            const { container } = setup()
            const image = container.querySelector('img')
            expect(image.src).toContain('/images/profile/profile1.png')
        });
        it('displays displayName@user', () => {
            const { queryByText } = setup()
            expect(queryByText('display1@user1')).toBeInTheDocument()
        });

        it('displays relative time', () => {
            const { queryByText } = setup()
            expect(queryByText('1 minute ago')).toBeInTheDocument()
        })

        it('has link to user page', () => {
            const { container } = setup()
            const anchor = container.querySelector('a')
            expect(anchor.getAttribute('href')).toBe('/user1')
        });

        it('displays file attachment image', () => {
            const { container } = setup(hoxWithAttachment)
            const images = container.querySelectorAll('img')
            expect(images.length).toBe(2)
        });

        it('does not displays file attachment when attachment type is not image', () => {
            const { container } = setup(hoxWithPDFAttachment)
            const images = container.querySelectorAll('img')
            expect(images.length).toBe(1)
        });

        it('sets the attachment path as source for file attachment image', () => {
            const { container }  = setup(hoxWithAttachment)
            const images = container.querySelector('img')
            const attachmentImage = images[1]
            expect(attachmentImage.src).toContain(
                '/images/attachments/' + hoxWithAttachment.attachment.name
            )
        });

        it('displays delete button when hox owned by logged in user', () => {
            const { container } = setup()
            expect(container.querySelector('button')).toBeInTheDocument()
        });

        it('does not display delete button when hox is not owned by logged in user', () => {
            const { container } = setup(hoxWithoutAttachment, loggedInStateUserTwo)
            expect(container.querySelector('button')).not.toBeInTheDocument()
        });
    })
})