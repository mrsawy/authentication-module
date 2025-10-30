import * as Yup from 'yup';
import { InferType } from "yup"
import { Country } from '../types/enum/country.enum';

export const signupSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(3, 'First name must be at least 3 characters'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(3, 'Last name must be at least 3 characters'),

    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),


    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .test('no-spaces', 'Username cannot contain spaces', (value: string) => !value?.includes(' '))
        .test('starts-with-letter', 'Username must start with a letter', (value: string) => /^[a-zA-Z]/.test(value || '')),

    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\+?[0-9]\d{1,14}$/, 'Please enter a valid phone number'),

    country: Yup.string()
        .oneOf(Object.values(Country), 'Please select a valid country')
        .required('Country is required'),

    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),


});

export const loginSchema = Yup.object().shape({
    identifier: Yup.string().required('username , phone or email are required'),
    password: Yup.string()
        .required('Password is required'),
});

export type LoginSchema = InferType<typeof loginSchema>;
export type SignupSchema = InferType<typeof signupSchema>;
