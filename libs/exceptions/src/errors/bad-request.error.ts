import { BadRequestException } from '@nestjs/common';
import { IAbstractError, TExceptionValidationError } from '@libs/exceptions';
import { getDefaultExceptionErrors } from '../helpers/get-default-errors.helper';

const defaultErrors = getDefaultExceptionErrors('Bad request');

class BadRequestError extends BadRequestException implements IAbstractError {
  constructor(
    public readonly errors: TExceptionValidationError[] = defaultErrors,
  ) {
    super();
  }
}

export { BadRequestError };
