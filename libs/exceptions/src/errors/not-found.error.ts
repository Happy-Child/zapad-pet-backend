import { NotFoundException } from '@nestjs/common';
import { IAbstractError, TExceptionValidationError } from '@libs/exceptions';
import { getDefaultExceptionErrors } from '../helpers/get-default-errors.helper';

const defaultErrors = getDefaultExceptionErrors('Not found');

class NotFoundError extends NotFoundException implements IAbstractError {
  constructor(
    public readonly errors: TExceptionValidationError[] = defaultErrors,
  ) {
    super();
  }
}

export { NotFoundError };
