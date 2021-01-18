import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { IAbstractError } from '@libs/exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const isHttp = host.getType() === 'http';
    if (isHttp) {
      const ctx = host.switchToHttp();
      const res: Response = ctx.getResponse();

      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const message = exception.message;

        if (status >= 400 && status <= 500) {
          const isAbstractError = this.checkInstanceAbstractError(exception);
          const errors = isAbstractError
            ? ((exception as unknown) as IAbstractError).errors
            : [];
          res.status(status).json({ status, message, errors });
          return;
        }
      }

      res.status(500).json({ status: 500, errors: 'Internal Server Error' });
    }
  }

  private checkInstanceAbstractError(exception: any): boolean {
    return (
      exception !== null &&
      typeof exception === 'object' &&
      exception.hasOwnProperty('errors')
    );
  }
}
