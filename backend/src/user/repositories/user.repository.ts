import { EntityRepository, Repository } from 'typeorm';

import { User } from '@libs/entities';
import { ERRORS, SEARCH_TYPES } from '@libs/constants';
import { NotFoundError, TExceptionValidationError } from '@libs/exceptions';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findOrFailByEmail(email: string): Promise<User> {
    const user = await this.findBy(email);

    if (!user) {
      const error: TExceptionValidationError[] = [
        {
          field: '',
          errors: [{ errorCode: ERRORS.USER_NOT_FOUND }],
        },
      ];
      throw new NotFoundError(error);
    }

    return user;
  }

  public async findBy(
    value: string,
    type: SEARCH_TYPES = SEARCH_TYPES.EMAIL,
  ): Promise<User> {
    return this.findOne({
      where: {
        [type]: value,
      },
    });
  }

  public async updateUserInfo(userId: number, userInfo: Partial<User>) {
    return this.update({ id: userId }, userInfo);
  }
}
