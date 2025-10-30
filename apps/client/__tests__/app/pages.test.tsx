import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import LoginPage from '@/app/(auth)/login/page'
import SignupPage from '@/app/(auth)/signup/page'
import Private from '@/app/private/page'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return React.createElement('img', props);
    },
}));

describe('Page Components', () => {
    describe('Home Page', () => {
        it('displays main heading', () => {
            render(<Home />)

            const heading = screen.getByText("Welcome to the application.")
            expect(heading).toBeInTheDocument()
        })
    })

    describe('Login Page', () => {
        it('renders login page with form', () => {
            render(<LoginPage />)

            expect(screen.getByText('Login to your account')).toBeInTheDocument()
        })

        it('has proper container styling', () => {
            const { container } = render(<LoginPage />)
            const mainDiv = container.querySelector('.bg-muted')

            expect(mainDiv).toBeInTheDocument()
            expect(mainDiv).toHaveClass('flex', 'min-h-svh')
        })

        it('renders LoginForm component', () => {
            render(<LoginPage />)

            expect(screen.getByPlaceholderText('your identifier...')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('your password...')).toBeInTheDocument()
        })
    })

    describe('Signup Page', () => {
        it('renders signup page with form', () => {
            render(<SignupPage />)

            expect(screen.getByText('Create a new account')).toBeInTheDocument()
        })

        it('has proper container styling', () => {
            const { container } = render(<SignupPage />)
            const mainDiv = container.querySelector('.bg-muted')

            expect(mainDiv).toBeInTheDocument()
            expect(mainDiv).toHaveClass('flex', 'min-h-svh')
        })

        it('renders SignupForm component', () => {
            render(<SignupPage />)

            expect(screen.getByPlaceholderText('your first name...')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('your last name...')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('your email...')).toBeInTheDocument()
        })
    })

    describe('Private Page', () => {
        it('renders private page with welcome message', () => {
            render(<Private />)

            expect(screen.getByText('"Welcome to the application.')).toBeInTheDocument()
        })

        it('has centered layout', () => {
            const { container } = render(<Private />)
            const mainDiv = container.querySelector('.flex')

            expect(mainDiv).toHaveClass('justify-center', 'items-center', 'min-h-screen')
        })

        it('has large text on desktop', () => {
            const { container } = render(<Private />)
            const heading = container.querySelector('.lg\\:text-9xl')

            expect(heading).toBeInTheDocument()
        })
    })
})