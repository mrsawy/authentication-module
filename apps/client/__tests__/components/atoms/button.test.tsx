import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/atoms/button'

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('handles click events', () => {
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Click me</Button>)

        fireEvent.click(screen.getByText('Click me'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies default variant classes', () => {
        render(<Button>Default</Button>)
        const button = screen.getByText('Default')
        expect(button).toHaveClass('bg-primary')
    })

    it('applies destructive variant classes', () => {
        render(<Button variant="destructive">Delete</Button>)
        const button = screen.getByText('Delete')
        expect(button).toHaveClass('bg-destructive')
    })

    it('applies outline variant classes', () => {
        render(<Button variant="outline">Outline</Button>)
        const button = screen.getByText('Outline')
        expect(button).toHaveClass('border')
    })

    it('applies different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>)
        expect(screen.getByText('Small')).toHaveClass('h-9')

        rerender(<Button size="lg">Large</Button>)
        expect(screen.getByText('Large')).toHaveClass('h-11')
    })

    it('renders as child when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        )
        const link = screen.getByText('Link Button')
        expect(link.tagName).toBe('A')
    })

    it('disables button when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>)
        const button = screen.getByText('Disabled')
        expect(button).toBeDisabled()
    })

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>)
        const button = screen.getByText('Custom')
        expect(button).toHaveClass('custom-class')
    })

    it('renders icon when provided', () => {
        const TestIcon = () => <span data-testid="test-icon">Icon</span>
        render(
            <Button icon={TestIcon} iconPlacement="left">
                With Icon
            </Button>
        )
        expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })
})