/*
Validation Rules
 */
export const required = value => {
    return (value ? undefined : 'This field is required')
}
export const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
        'Invalid email address' : undefined

export const url = value =>
    value && !/^[A-Z0-9_-]{1,200}$/i.test(value) ?
        'Invalid url address' : undefined

const minLength = min => value =>
    value && value.length < min ? `Must be at least ${min} characters long` : undefined

const maxLength = max => value =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined

const hasLength = len => value =>
    value && (value.length < len || value.length > len) ? `Must be exactly ${len} characters long` : undefined

export const passwordLength = minLength(6)

export const phoneNumber = value => hasLength(10)(value) ? hasLength(10)(value) : number(value)

