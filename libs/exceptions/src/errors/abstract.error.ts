import { TExceptionValidationError } from '../types';

export interface IAbstractError {
  readonly errors: TExceptionValidationError[];
}
