import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = isHttpException ? (exception as HttpException).getResponse() : null;
    const errorMessage = isHttpException
      ? typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any)?.message || (errorResponse as any)?.error || 'Error'
      : 'Internal server error';

    const errorName = isHttpException
      ? (typeof errorResponse === 'object' && (errorResponse as any)?.error) || exception.name
      : 'InternalServerError';

    response.status(status).json({
      statusCode: status,
      error: errorName,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
