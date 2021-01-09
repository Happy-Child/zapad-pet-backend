import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from '@libs/entities';

const entities = [User];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
