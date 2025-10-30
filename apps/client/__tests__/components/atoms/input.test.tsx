import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/atoms/input'

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles text input', async () => {
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement
    
    await userEvent.type(input, 'Hello World')
    expect(input.value).toBe('Hello World')
  })

  it('applies type attribute', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled" />)
    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" placeholder="Custom" />)
    const input = screen.getByPlaceholderText('Custom')
    expect(input).toHaveClass('custom-input')
  })

  it('handles onChange event', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} placeholder="Change test" />)
    
    const input = screen.getByPlaceholderText('Change test')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('supports controlled component pattern', () => {
    const { rerender } = render(<Input value="initial" onChange={() => {}} />)
    const input = screen.getByDisplayValue('initial') as HTMLInputElement
    expect(input.value).toBe('initial')
    
    rerender(<Input value="updated" onChange={() => {}} />)
    expect(input.value).toBe('updated')
  })

  it('renders with default value', () => {
    render(<Input defaultValue="default text" />)
    const input = screen.getByDisplayValue('default text')
    expect(input).toBeInTheDocument()
  })

  it('handles focus events', () => {
    const handleFocus = jest.fn()
    render(<Input onFocus={handleFocus} placeholder="Focus test" />)
    
    const input = screen.getByPlaceholderText('Focus test')
    fireEvent.focus(input)
    
    expect(handleFocus).toHaveBeenCalled()
  })

  it('handles blur events', () => {
    const handleBlur = jest.fn()
    render(<Input onBlur={handleBlur} placeholder="Blur test" />)
    
    const input = screen.getByPlaceholderText('Blur test')
    fireEvent.blur(input)
    
    expect(handleBlur).toHaveBeenCalled()
  })
})