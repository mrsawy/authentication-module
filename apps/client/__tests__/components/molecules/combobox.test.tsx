import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from '@/components/molecules/combobox'

describe('Combobox Component', () => {
    const mockData = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ]

    it('renders with default value', async () => {
        render(
            <Combobox
                data={mockData}
                defaultValue={{ value: 'option1', label: 'Option 1' }}
                placeholder="Search..."
            />
        )
        const button = screen.getByRole('combobox')
        expect(button).toHaveTextContent('Option 1')
        fireEvent.click(button)
        const selectedOption = await screen.findByRole('option', { name: 'Option 1' })
        expect(selectedOption).toBeInTheDocument()
    })

    it('renders with title when no value selected', () => {
        render(
            <Combobox
                data={mockData}
                title="Select an option"
                placeholder="Search..."
            />
        )
        expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    it('opens popover on button click', async () => {
        render(<Combobox data={mockData} placeholder="Search..." />)

        const button = screen.getByRole('combobox')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
        })
    })

    it('filters options based on search', async () => {
        render(<Combobox data={mockData} placeholder="Search..." />)

        const button = screen.getByRole('combobox')
        fireEvent.click(button)

        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText('Search...')
            fireEvent.change(searchInput, { target: { value: 'Option 2' } })
        })

        await waitFor(() => {
            const selectedOption = screen.getByRole('option', { name: 'Option 2' })
            expect(selectedOption).toBeInTheDocument()
        })
    })

    it('calls onValueChange when option is selected', async () => {
        const handleValueChange = jest.fn()
        render(
            <Combobox
                data={mockData}
                placeholder="Search..."
                onValueChange={handleValueChange}
            />
        )

        const button = screen.getByRole('combobox')
        fireEvent.click(button)

        await waitFor(() => {
            const option = screen.getByText('Option 2')
            fireEvent.click(option)
        })

        expect(handleValueChange).toHaveBeenCalledWith('option2')
    })

    it('shows loading state', async () => {
        render(
            <Combobox data={[]} placeholder="Search..." isLoading={true} />
        )

        const button = screen.getByRole('combobox')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })
    })

    it('shows custom empty message before search', async () => {
        render(
            <Combobox
                data={[]}
                placeholder="Search..."
                customTitleBeforeSearch="Start typing to search"
            />
        )

        const button = screen.getByRole('combobox')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Start typing to search')).toBeInTheDocument()
        })
    })

    it('calls onSearch when search input changes', async () => {
        const handleSearch = jest.fn()
        render(
            <Combobox
                data={mockData}
                placeholder="Search..."
                onSearch={handleSearch}
            />
        )

        const button = screen.getByRole('combobox')
        fireEvent.click(button)

        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText('Search...')
            fireEvent.change(searchInput, { target: { value: 'test' } })
        })

        expect(handleSearch).toHaveBeenCalledWith('test')
    })

    it('displays checkmark for selected option', async () => {
        render(
            <Combobox
                data={mockData}
                defaultValue={{ value: 'option1', label: 'Option 1' }}
                placeholder="Search..."
            />
        )
        const button = screen.getByRole('combobox')
        fireEvent.click(button)

        const selectedOption = await screen.findByRole('option', { name: 'Option 1' })
        expect(selectedOption).toBeInTheDocument()
        expect(selectedOption.querySelector('svg.lucide-check')).toBeInTheDocument()
    })

    test('updates controlled value', () => {
        render(<Combobox data={mockData} value="option1" placeholder="Search..." />)

        const comboboxButton = screen.getByRole('combobox')
        fireEvent.click(comboboxButton)

        const option1 = screen.getByRole('option', { name: /option 1/i })
        expect(option1).toBeInTheDocument()
    })
})