import React from 'react'
import { render, screen } from '@testing-library/react'
import Loader from '@/components/organs/loader'
import useGeneralStore from '@/lib/store/generalStore'

jest.mock('@/lib/store/generalStore')

describe('Loader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loader when generalIsLoading is true', () => {
    ;(useGeneralStore as unknown as jest.Mock).mockReturnValue({
      generalIsLoading: true,
    })

    const { container } = render(<Loader />)
    expect(container.querySelector('.loader')).toBeInTheDocument()
  })

  it('does not render loader when generalIsLoading is false', () => {
    ;(useGeneralStore as unknown as jest.Mock).mockReturnValue({
      generalIsLoading: false,
    })

    const { container } = render(<Loader />)
    expect(container.querySelector('.loader')).not.toBeInTheDocument()
  })

  it('renders all 9 squares when loading', () => {
    ;(useGeneralStore as unknown as jest.Mock).mockReturnValue({
      generalIsLoading: true,
    })

    const { container } = render(<Loader />)
    const squares = container.querySelectorAll('.square')
    expect(squares).toHaveLength(9)
  })

  it('has correct IDs for each square', () => {
    ;(useGeneralStore as unknown as jest.Mock).mockReturnValue({
      generalIsLoading: true,
    })

    const { container } = render(<Loader />)
    
    for (let i = 1; i <= 9; i++) {
      expect(container.querySelector(`#sq${i}`)).toBeInTheDocument()
    }
  })

  it('has fixed positioning overlay', () => {
    ;(useGeneralStore as unknown as jest.Mock).mockReturnValue({
      generalIsLoading: true,
    })

    const { container } = render(<Loader />)
    const overlay = container.querySelector('div')
    
    expect(overlay).toHaveClass('fixed')
    expect(overlay).toHaveClass('top-0')
    expect(overlay).toHaveClass('left-0')
  })

  it('has high z-index for overlay', () => {
    ;(useGeneralStore as unknown as jest.Mock).mockReturnValue({
      generalIsLoading: true,
    })

    const { container } = render(<Loader />)
    const overlay = container.querySelector('div')
    
    expect(overlay).toHaveClass('z-99999')
  })
})