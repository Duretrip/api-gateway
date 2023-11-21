import { ExceptionFilter, Catch, ArgumentsHost,HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Default status code
    if (exception instanceof HttpException) {
      // If it's an HttpException, use its status
      status = exception.getStatus();
    } else if (typeof exception?.getStatus === 'function') {
      // If getStatus is a function, use its result
      status = exception.getStatus();
    }
    const message = exception?.message || 'Internal server error';
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception?.response?.errors || message,
    });
  }
}
