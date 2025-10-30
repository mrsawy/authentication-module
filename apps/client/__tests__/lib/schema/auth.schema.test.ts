import { loginSchema, signupSchema } from '@/lib/schema/auth.schema'
import { Country } from '@/lib/types/enum/country.enum'

describe('Auth Schema', () => {
    describe('loginSchema', () => {
        it('should validate correct login data', async () => {
            const validData = {
                identifier: 'testuser',
                password: 'password123'
            }

            await expect(loginSchema.validate(validData)).resolves.toEqual(validData)
        })

        it('should reject missing identifier', async () => {
            const invalidData = {
                password: 'password123'
            }

            await expect(loginSchema.validate(invalidData)).rejects.toThrow('username , phone or email are required')
        })

        it('should reject missing password', async () => {
            const invalidData = {
                identifier: 'testuser'
            }

            await expect(loginSchema.validate(invalidData)).rejects.toThrow('Password is required')
        })
    })

    describe('signupSchema', () => {
        const validSignupData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            username: 'johndoe',
            phone: '+201234567890',
            country: Country.Egypt,
            password: 'password123',
            confirmPassword: 'password123'
        }

        it('should validate correct signup data', async () => {
            await expect(signupSchema.validate(validSignupData)).resolves.toEqual(validSignupData)
        })

        it('should reject short first name', async () => {
            const invalidData = { ...validSignupData, firstName: 'Jo' }
            await expect(signupSchema.validate(invalidData)).rejects.toThrow('First name must be at least 3 characters')
        })

        it('should reject invalid email', async () => {
            const invalidData = { ...validSignupData, email: 'invalid-email' }
            await expect(signupSchema.validate(invalidData)).rejects.toThrow('Invalid email format')
        })

        it('should reject username with spaces', async () => {
            const invalidData = { ...validSignupData, username: 'john doe' }
            await expect(signupSchema.validate(invalidData)).rejects.toThrow('Username can only contain letters, numbers, and underscores')
        })

        it('should reject username starting with number', async () => {
            const invalidData = { ...validSignupData, username: '123john' }
            await expect(signupSchema.validate(invalidData)).rejects.toThrow('Username must start with a letter')
        })

        it('should reject invalid phone number', async () => {
            const invalidData = { ...validSignupData, phone: 'invalid' }
            await expect(signupSchema.validate(invalidData)).rejects.toThrow('Please enter a valid phone number')
        })

        it('should reject short password', async () => {
            const invalidData = { ...validSignupData, password: '12345', confirmPassword: '12345'}
            await expect(signupSchema.validate(invalidData)).rejects.toThrow('Password must be at least 6 characters')
        })

        it('should reject mismatched passwords', async () => {
            const invalidData = { ...validSignupData, confirmPassword: 'different' }
            await expect(signupSchema.validate(invalidData)).rejects.toThrow('Passwords must match')
        })

        it('should reject invalid country', async () => {
            const invalidData = { ...validSignupData, country: 'InvalidCountry' as Country }
            await expect(signupSchema.validate(invalidData)).rejects.toThrow('Please select a valid country')
        })
    })
})