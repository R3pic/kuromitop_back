import { DatabaseError } from 'pg';

export function isError(e: unknown): e is Error {
    return e instanceof Error;
}

export function isDataBaseError(e: unknown): e is DatabaseError {
    return e instanceof DatabaseError;
}