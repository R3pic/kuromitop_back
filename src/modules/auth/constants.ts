import type { IsStrongPasswordOptions } from 'class-validator';

export const USERNAME = {
    MIN_LENGTH: 5,
    MAX_LENGTH: 30,
    MATCHES: /^[a-zA-Z][a-zA-Z0-9]*$/,
};

export const EMAIL = {
    MAX_LENGTH: 255,
};

export const PASSWORD: IsStrongPasswordOptions = {
    minLength: 8,
    minSymbols: 1,
    minUppercase: 0,
    minLowercase: 0,
    minNumbers: 0,
};

export const tokenCookieOptions = {
    httpOnly: true,
    secure: true,
};