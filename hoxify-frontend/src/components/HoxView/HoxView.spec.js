import React from "react";
import {render} from '@testing-library/react'
import HoxView from "./HoxView";
import {MemoryRouter} from 'react-router-dom'


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

const setup = (hox = hoxWithoutAttachment) => {
    const oneMinute = 60 * 1000
    hox.date = new Date(new Date() - oneMinute)
    return render(
        <MemoryRouter>
            <HoxView hox={hoxWithoutAttachment}/>
        </MemoryRouter>)
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
    })
})