import React from "react";
import { render } from '@testing-library/react'
import HoxSubmit from "./HoxSubmit";

describe('HoxSubmit', () => {
    describe('Layout', () => {
        it('has textarea', () => {
            const { container } = render(<HoxSubmit/>)
            const textArea = container.querySelector('textarea')
            expect(textArea).toBeInTheDocument()
        })
        it('has image', () => {
            const { container } = render(<HoxSubmit/>)
            const image = container.querySelector('img')
            expect(image).toBeInTheDocument()
        })
        it('displays textarea 1 line', () => {
            const { container } = render(<HoxSubmit/>)
            const textArea = container.querySelector('textarea')
            expect(textArea.rows).toBe(1)
        })
    })
})