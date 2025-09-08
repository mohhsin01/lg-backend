import { ExceptionFilter, Catch, ArgumentsHost,  ConflictException,} from '@nestjs/common';
import { Response } from 'express';
import { ConflictEmailException } from './email.exception';

@Catch(ConflictEmailException, ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = exception.getStatus ? exception.getStatus() : 409;
    let errorResponse = {
      statusCode: status,
      message:  'Conflict occurred beacuse the email is already registered',
      error: 'Conflict',
    };

   
    if (exception instanceof ConflictEmailException) {
      errorResponse = exception.getResponse() as any;
    }

    response.status(status).json(errorResponse);
  }
}
