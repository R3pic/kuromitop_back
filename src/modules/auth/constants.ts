import type { IsStrongPasswordOptions } from 'class-validator';

export const AUTH_API_MESSAGE = {
    USER_ALREAY_EXIST: '이미 존재하는 유저입니다.',
    INVALID_CREDENTIALS: '아이디 또는 비밀번호를 다시 확인해주세요.',
};

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