import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '@libs/constants';
import { TJwtPayload } from '../types/jwt.type';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate({ userId, userEmail }: any): Promise<TJwtPayload> {
    await this.userRepository.findOrFailByEmail(userEmail);
    return { userId, userEmail };
  }
}
