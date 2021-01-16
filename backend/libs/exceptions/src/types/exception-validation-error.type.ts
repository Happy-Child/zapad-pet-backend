export type TExceptionValidationErrorDetail = {
  errorType?: string;
  errorCode: string;
};

export type TExceptionValidationError = {
  field: string;
  message?: string;
  errors?: TExceptionValidationErrorDetail[];
  childrenErrors?: TExceptionValidationError[];
};
