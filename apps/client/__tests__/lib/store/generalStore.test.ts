import { renderHook, act } from '@testing-library/react'
import useGeneralStore from '@/lib/store/generalStore'

describe('useGeneralStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useGeneralStore.setState({ generalIsLoading: false })
    })

    it('should have initial state', () => {
        const { result } = renderHook(() => useGeneralStore())
        expect(result.current.generalIsLoading).toBe(false)
    })

    it('should update loading state', () => {
        const { result } = renderHook(() => useGeneralStore())

        act(() => {
            useGeneralStore.setState({ generalIsLoading: true })
        })

        expect(result.current.generalIsLoading).toBe(true)
    })

    it('should toggle loading state multiple times', () => {
        const { result } = renderHook(() => useGeneralStore())

        act(() => {
            useGeneralStore.setState({ generalIsLoading: true })
        })
        expect(result.current.generalIsLoading).toBe(true)

        act(() => {
            useGeneralStore.setState({ generalIsLoading: false })
        })
        expect(result.current.generalIsLoading).toBe(false)
    })
})