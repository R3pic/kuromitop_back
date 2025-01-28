import {
    ArgumentsHost, 
    Catch,
    ExceptionFilter, 
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceException } from './service.error';

@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
    catch(exception: ServiceException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = exception.httpException.getStatus();
        const execeptionResponse = exception.httpException.getResponse();

        if (typeof execeptionResponse === 'object'
            && 'message' in execeptionResponse
        )
            response
                .status(status)
                .json({
                    message: exception.message,
                    error: execeptionResponse.message,
                    statusCode: status,
                });
    }
}
