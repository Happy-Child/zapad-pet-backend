import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationError } from 'class-validator/types/validation/ValidationError';
import { TExceptionValidationError } from '@libs/exceptions';
import { BadRequestError } from '@libs/exceptions';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.isValidMetatype(metatype)) {
      return value;
    }

    const plainData = plainToClass(metatype, value);
    const errors: ValidationError[] = await validate(plainData);

    if (errors.length) {
      const formattedError = this.prepareErrors(errors);
      throw new BadRequestError(formattedError);
    }

    return value;
  }

  private isValidMetatype(metatype: Type): boolean {
    const types: Type[] = [Number, String, Array, Object, Boolean];
    return !types.includes(metatype);
  }

  private prepareErrors(errors: ValidationError[]) {
    return errors.map(({ property, constraints, children }) => {
      const errors = Object.keys(constraints).map((errorType) => ({
        errorType,
        errorCode: constraints[errorType],
      }));

      const resultError: TExceptionValidationError = {
        field: property,
        errors,
      };

      if (children.length) {
        resultError.childrenErrors = this.prepareErrors(children);
      }

      return resultError;
    });
  }
}
