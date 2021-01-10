import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

const entities = [UserRepository];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
