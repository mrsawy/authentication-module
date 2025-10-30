import { cn } from '@/lib/utils/cn'

describe('cn utility', () => {
    it('should merge class names', () => {
        const result = cn('class1', 'class2')
        expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
        const result = cn('base', true && 'conditional', false && 'excluded')
        expect(result).toBe('base conditional')
    })

    it('should merge Tailwind classes correctly', () => {
        const result = cn('px-2', 'px-4')
        expect(result).toBe('px-4')
    })

    it('should handle arrays of classes', () => {
        const result = cn(['class1', 'class2'], 'class3')
        expect(result).toBe('class1 class2 class3')
    })

    it('should handle undefined and null', () => {
        const result = cn('class1', undefined, null, 'class2')
        expect(result).toBe('class1 class2')
    })

    it('should handle objects', () => {
        const result = cn({
            'class1': true,
            'class2': false,
            'class3': true
        })
        expect(result).toBe('class1 class3')
    })
})