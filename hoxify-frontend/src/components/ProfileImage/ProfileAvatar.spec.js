import React from "react";
import {fireEvent, render} from '@testing-library/react'
import ProfileAvatarWithDefault from './ProfileAvatar'
import ProfileAvatar from "./ProfileAvatar";

describe('ProfileAvatar', () => {

    it('has image', () => {
        const { container } = render(<ProfileAvatar/>)
        const image = container.querySelector('img')
        expect(image).toBeInTheDocument()
    })

    it('displays default image when image property not provided', () => {
        const { container } = render(<ProfileAvatar/>)
        const image = container.querySelector('img')
        expect(image.src).toContain('/default-avatar.png')
    })

    it('displays user image when image property is provided', () => {
        const { container } = render(<ProfileAvatar image="avatar1.png"/>)
        const image = container.querySelector('img')
        expect(image.src).oContain('/images/profile/avatar1.png')
    })

    it('displays default image when provided image loading fails',() => {
        const { container } = render(<ProfileAvatar image="avatar1.png"/>)
        const image = container.querySelector('img')
        fireEvent.error(image)
        expect(image.src).toContain('/default-avatar.png')
    })

    it('displays the image provided through src property', () => {
        const { container } = render(<ProfileAvatar image="img-from-src.png"/>)
        const image = container.querySelector('img')
        expect(image.src).toContain('/img-from-src.png')
    })
})