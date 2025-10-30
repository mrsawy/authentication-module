import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NavUser } from '@/components/molecules/nav-user'
import { logout } from '@/lib/actions/auth.action'
import { IUser } from '@/lib/types/user.interface'

jest.mock('@/lib/actions/auth.action', () => ({
  logout: jest.fn(),
}))

describe('NavUser Component', () => {
  const mockUser: IUser = {
    _id: '123',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+201234567890',
    firstName: 'John',
    lastName: 'Doe',
    roleName: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns null when no user is provided', () => {
    const { container } = render(<NavUser />)
    expect(container.firstChild).toBeNull()
  })

  it('renders user information when user is provided', () => {
    render(<NavUser user={mockUser} />)
    
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('displays user initials in avatar', () => {
    render(<NavUser user={mockUser} />)
    
    expect(screen.getByText('Jo')).toBeInTheDocument()
  })

  it('displays user email in dropdown', async () => {
    render(<NavUser user={mockUser} />)
    
    const button = screen.getAllByRole('button')[0]
    fireEvent.click(button)

    await waitFor(() => {
      const emails = screen.getAllByText('john@example.com')
      expect(emails.length).toBeGreaterThan(0)
    })
  })
  
  it('renders with grayscale avatar', () => {
    const { container } = render(<NavUser user={mockUser} />)
    const avatar = container.querySelector('.grayscale')
    expect(avatar).toBeInTheDocument()
  })

  it('displays correct first name in button', () => {
    render(<NavUser user={mockUser} />)
    const firstName = screen.getAllByText('John')[0]
    expect(firstName).toBeInTheDocument()
  })
})