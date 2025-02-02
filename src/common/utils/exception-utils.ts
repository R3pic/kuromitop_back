import { DatabaseError } from 'pg';
import { PostgresError } from 'pg-error-enum';

export function isError(e: unknown): e is Error {
    return e instanceof Error;
}

export function isDataBaseError(e: unknown, code?: PostgresError): e is DatabaseError {
    if (code) {
        return e instanceof DatabaseError && e.code === code;
    }

    return e instanceof DatabaseError;
}