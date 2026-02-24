import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttpException) {
      const request = ctx.getRequest();
      this.logger.error(
        `Unexpected exception on ${httpAdapter.getRequestMethod(request)} ${httpAdapter.getRequestUrl(request)}`,
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

    const responseBody = {
      statusCode: status,
      error: errorName,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
