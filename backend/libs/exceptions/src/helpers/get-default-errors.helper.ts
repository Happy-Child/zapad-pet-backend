import { TExceptionValidationError } from '@libs/exceptions';

export const getDefaultExceptionErrors = (
  message = 'Error',
): TExceptionValidationError[] => {
  return [{ field: '', message }];
};
