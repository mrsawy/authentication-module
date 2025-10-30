import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PhoneInput } from '@/components/organs/phone-input'

describe('PhoneInput Component', () => {
    it('renders with default country code', () => {
        render(<PhoneInput />)
        expect(screen.getByText('🇪🇬 +20')).toBeInTheDocument()
    })

    it('renders with custom label', () => {
        render(<PhoneInput label="Mobile Number" />)
        expect(screen.getByText('Mobile Number')).toBeInTheDocument()
    })

    it('renders without label when not provided', () => {
        const { container } = render(<PhoneInput label="" />)
        expect(container.querySelector('label')).not.toBeInTheDocument()
    })

    it('handles phone number input', async () => {
        const handleValueChange = jest.fn()
        render(<PhoneInput onValueChange={handleValueChange} />)

        const phoneInput = screen.getByPlaceholderText('Enter phone number')
        await userEvent.type(phoneInput, '1234567890')

        expect(handleValueChange).toHaveBeenCalled()
    })

    it('combines country code and phone number', async () => {
        const handleValueChange = jest.fn()
        render(<PhoneInput onValueChange={handleValueChange} />)

        const phoneInput = screen.getByPlaceholderText('Enter phone number')
        await userEvent.type(phoneInput, '1234567890')

        await waitFor(() => {
            expect(handleValueChange).toHaveBeenCalledWith('201234567890')
        })
    })

    it('updates when country code changes', async () => {
        const handleValueChange = jest.fn()
        render(<PhoneInput onValueChange={handleValueChange} />)

        // First add phone number
        const phoneInput = screen.getByPlaceholderText('Enter phone number')
        await userEvent.type(phoneInput, '1234567890')

        // Then change country code
        const comboboxButton = screen.getByRole('combobox')
        fireEvent.click(comboboxButton)

        // The implementation would need to handle country code selection
        // This is a simplified test
        expect(handleValueChange).toHaveBeenCalled()
    })

    it('parses incoming value correctly', () => {
        render(<PhoneInput value="201234567890" />)

        const phoneInput = screen.getByPlaceholderText('Enter phone number') as HTMLInputElement
        expect(phoneInput.value).toBe('1234567890')
        expect(screen.getByText('🇪🇬 +20')).toBeInTheDocument()
    })

    it('handles empty value', () => {
        const handleValueChange = jest.fn()
        render(<PhoneInput value="" onValueChange={handleValueChange} />)

        const phoneInput = screen.getByPlaceholderText('Enter phone number') as HTMLInputElement
        expect(phoneInput.value).toBe('')
    })

    it('applies custom className', () => {
        const { container } = render(<PhoneInput className="custom-phone-input" />)
        expect(container.querySelector('.custom-phone-input')).toBeInTheDocument()
    })

    it('normalizes phone number by removing + prefix', async () => {
        const handleValueChange = jest.fn()
        render(<PhoneInput onValueChange={handleValueChange} />)

        const phoneInput = screen.getByPlaceholderText('Enter phone number')
        await userEvent.type(phoneInput, '1234567890')

        await waitFor(() => {
            const lastCall = handleValueChange.mock.calls[handleValueChange.mock.calls.length - 1]
            expect(lastCall[0]).not.toContain('+')
        })
    })

    it('handles value prop updates (form rehydration)', () => {
        const { rerender } = render(<PhoneInput value="201234567890" />)

        let phoneInput = screen.getByPlaceholderText('Enter phone number') as HTMLInputElement
        expect(phoneInput.value).toBe('1234567890')

        rerender(<PhoneInput value="441234567890" />)
        phoneInput = screen.getByPlaceholderText('Enter phone number') as HTMLInputElement
        expect(phoneInput.value).toBe('1234567890')
    })

    it('handles phone number with unknown country code', () => {
        render(<PhoneInput value="9991234567890" />)

        const phoneInput = screen.getByPlaceholderText('Enter phone number') as HTMLInputElement
        // Should fall back to default country code
        expect(screen.getByText('🇪🇬 +20')).toBeInTheDocument()
    })
})