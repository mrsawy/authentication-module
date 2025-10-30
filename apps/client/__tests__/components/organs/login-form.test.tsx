import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/organs/login-form'
import { loginAction } from '@/lib/actions/auth.action'

// Mock the login action
jest.mock('@/lib/actions/auth.action', () => ({
    loginAction: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}))

// Mock toast
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}))

describe('LoginForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders login form elements', () => {
        render(<LoginForm />)

        expect(screen.getByText('Login to your account')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('your identifier...')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('your password...')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('shows validation errors for empty fields', async () => {
        render(<LoginForm />)

        const submitButton = screen.getByRole('button', { name: /login/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/username , phone or email are required/i)).toBeInTheDocument()
        })
    })

    it('toggles password visibility', async () => {
        render(<LoginForm />)

        const passwordInput = screen.getByPlaceholderText('your password...') as HTMLInputElement
        expect(passwordInput.type).toBe('password')

        const toggleButton = screen.getByRole('button', { name: '' })
        fireEvent.click(toggleButton)

        expect(passwordInput.type).toBe('text')
    })

    it('submits form with valid data', async () => {
        const mockLoginAction = loginAction as jest.MockedFunction<typeof loginAction>
        mockLoginAction.mockResolvedValue({ token: 'test-token', user: {} } as any)

        render(<LoginForm />)

        const identifierInput = screen.getByPlaceholderText('your identifier...')
        const passwordInput = screen.getByPlaceholderText('your password...')
        const submitButton = screen.getByRole('button', { name: /login/i })

        await userEvent.type(identifierInput, 'testuser')
        await userEvent.type(passwordInput, 'password123')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockLoginAction).toHaveBeenCalledWith({
                identifier: 'testuser',
                password: 'password123',
            })
        })
    })

    it('displays error on login failure', async () => {
        const mockLoginAction = loginAction as jest.MockedFunction<typeof loginAction>
        mockLoginAction.mockRejectedValue(new Error('Invalid credentials'))

        render(<LoginForm />)

        const identifierInput = screen.getByPlaceholderText('your identifier...')
        const passwordInput = screen.getByPlaceholderText('your password...')
        const submitButton = screen.getByRole('button', { name: /login/i })

        await userEvent.type(identifierInput, 'testuser')
        await userEvent.type(passwordInput, 'wrongpassword')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
        })
    })

    it('renders signup link', () => {
        render(<LoginForm />)

        expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
        expect(screen.getByText('Sign up')).toBeInTheDocument()
    })

    it('calls onSignupClick when provided', async () => {
        const mockOnSignupClick = jest.fn()
        render(<LoginForm onSignupClick={mockOnSignupClick} />)

        const signupButton = screen.getByText('Sign up')
        fireEvent.click(signupButton)

        expect(mockOnSignupClick).toHaveBeenCalled()
    })
})