import { HttpException } from '@nestjs/common';

export class ServiceException extends Error {
    readonly httpException: HttpException;
  
    constructor(exception: HttpException, message?: string) {
        super(message);
        if (!message)
            message = exception.message;
        this.httpException = exception;
    }
}