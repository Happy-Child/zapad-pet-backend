import { EntityRepository, Repository } from 'typeorm';

import { User } from '@libs/entities';
import { SEARCH_TYPES } from '@libs/constants';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
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
