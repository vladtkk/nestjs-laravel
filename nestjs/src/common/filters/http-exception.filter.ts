import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttpException) {
      this.logger.error(
        `Unexpected exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const errorResponse = isHttpException ? exception.getResponse() : null;
    const errorMessage = isHttpException
      ? typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as Record<string, unknown>)?.message ?? (errorResponse as Record<string, unknown>)?.error ?? 'Error'
      : 'Internal server error';

    const errorName = isHttpException
      ? (typeof errorResponse === 'object' && (errorResponse as Record<string, unknown>)?.error) || exception.name
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
