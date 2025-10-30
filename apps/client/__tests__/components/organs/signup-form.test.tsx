import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/components/organs/signup-form'
import { signUpAction } from '@/lib/actions/auth.action'

jest.mock('@/lib/actions/auth.action', () => ({
    signUpAction: jest.fn(),
}))

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}))

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}))

const mockSignUpAction = signUpAction as jest.MockedFunction<typeof signUpAction>


describe('SignupForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders signup form elements', () => {
        render(<SignupForm />)

        expect(screen.getByText('Create a new account')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('your first name...')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('your last name...')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('your email...')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Choose your username...')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    })

    it('shows validation errors for empty required fields', async () => {
        render(<SignupForm />)

        const submitButton = screen.getByRole('button', { name: /sign up/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('First name is required')).toBeInTheDocument()
            expect(screen.getByText('Last name is required')).toBeInTheDocument()
            expect(screen.getByText('Email is required')).toBeInTheDocument()
        })
    })

    it('validates email format', async () => {
        render(<SignupForm />)

        const emailInput = screen.getByPlaceholderText('your email...')
        await userEvent.type(emailInput, 'invalid-email')

        const submitButton = screen.getByRole('button', { name: /sign up/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Invalid email format')).toBeInTheDocument()
        })
    })

    it('validates password length', async () => {
        render(<SignupForm />)

        const passwordInput = screen.getAllByPlaceholderText('your password...')[0]
        await userEvent.type(passwordInput, '12345')

        const submitButton = screen.getByRole('button', { name: /sign up/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
        })
    })

    it('validates password confirmation match', async () => {
        render(<SignupForm />)

        const passwordInput = screen.getAllByPlaceholderText('your password...')[0]
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm Your Password...')

        await userEvent.type(passwordInput, 'password123')
        await userEvent.type(confirmPasswordInput, 'different123')

        const submitButton = screen.getByRole('button', { name: /sign up/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Passwords must match')).toBeInTheDocument()
        })
    })

    it('toggles password visibility', async () => {
        render(<SignupForm />)

        const passwordInputs = screen.getAllByPlaceholderText(/password/i) as HTMLInputElement[]
        expect(passwordInputs[0].type).toBe('password')

        const toggleButtons = screen.getAllByRole('button', { name: '' })
        fireEvent.click(toggleButtons[0])

        expect(passwordInputs[0].type).toBe('text')
    })

    it('submits form with valid data', async () => {
        mockSignUpAction.mockResolvedValue({ token: 'test-token', user: {} } as any)

        render(<SignupForm />)

        await userEvent.type(screen.getByPlaceholderText('your first name...'), 'John')
        await userEvent.type(screen.getByPlaceholderText('your last name...'), 'Doe')
        await userEvent.type(screen.getByPlaceholderText('your email...'), 'john@example.com')
        await userEvent.type(screen.getByPlaceholderText('Choose your username...'), 'johndoe')
        await userEvent.type(screen.getByPlaceholderText("Enter phone number"), '01275881277')

        const passwordInputs = screen.getAllByPlaceholderText(/password/i)
        await userEvent.type(passwordInputs[0], 'password123')
        await userEvent.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: /sign up/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockSignUpAction).toHaveBeenCalled()
        })
    })

    it('displays error when username is taken', async () => {
        mockSignUpAction.mockResolvedValue({
            err: { message: 'username already exists' }
        } as any)

        render(<SignupForm />)

        await userEvent.type(screen.getByPlaceholderText('your first name...'), 'John')
        await userEvent.type(screen.getByPlaceholderText('your last name...'), 'Doe')
        await userEvent.type(screen.getByPlaceholderText('your email...'), 'john@example.com')
        await userEvent.type(screen.getByPlaceholderText("Enter phone number"), '01275881277')
        await userEvent.type(screen.getByPlaceholderText('Choose your username...'), 'johndoe')
        const passwordInputs = screen.getAllByPlaceholderText(/password/i)
        await userEvent.type(passwordInputs[0], 'password123')
        await userEvent.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: /sign up/i })
        fireEvent.click(submitButton)

        await waitFor(() => expect(mockSignUpAction).toHaveBeenCalled())
        await waitFor(() => {
            expect(screen.getByText('This username is already taken.')).toBeInTheDocument()
        })

    })

    it('renders login link', () => {
        render(<SignupForm />)

        expect(screen.getByText('Already have an account?')).toBeInTheDocument()
        expect(screen.getByText('Login')).toBeInTheDocument()
    })
})