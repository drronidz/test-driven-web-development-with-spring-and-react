import React from "react";
import { render } from '@testing-library/react'
import ProfileCard from './ProfileCard'
import UserPage from "../../pages/UserPage/UserPage";

const userWithImage = {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'avatar.png'
}

const userWithoutImage = {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: undefined
}

const setup = (props, isEditable = undefined) => {
    return render(<ProfileCard user={props} isEditable={isEditable}/>)
}

describe('ProfileCard', () => {

    it('displays the displayName@username', () => {
        const { queryByText } = setup(userWithImage)
        const userInfo = queryByText('display1@user1')
        expect(userInfo).toBeInTheDocument()
    });

    it('has image', () => {
        const { container } =  setup(userWithImage)
        const image = container.querySelector('img')
        expect(image).toBeInTheDocument()
    })

    it('displays default image when user does not have one', () => {
        const { container } = setup(userWithoutImage)
        const image = container.querySelector('img')
        expect(image.src).toContain('/default-avatar.png')
    })

    it('displays user image when user has one', () => {
        const { container } = setup(userWithImage)
        const image = container.querySelector('img')
        expect(image.src).toContain('/images/profile/' + userWithImage.image)
    })

    it('displays edit button when isEditable property set as true',() => {
        const { queryByText } = setup(userWithImage, true)
        const editButton = queryByText('Edit')
        expect(editButton).toBeInTheDocument()
    })

    it('does not display edit button when isEditable not provided',() => {
        const { queryByText } = setup(userWithImage)
        const editButton = queryByText('Edit')
        expect(editButton).not.toBeInTheDocument()
    })
})