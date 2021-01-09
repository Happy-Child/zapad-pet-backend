import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as config from 'config';

const entities = [];

const synchronize = process.env.NODE_ENV === 'dev';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DB.POSTGRES_HOST,
      port: config.DB.POSTGRES_PORT,
      username: config.DB.POSTGRES_USER,
      password: config.DB.POSTGRES_PASSWORD,
      database: config.DB.POSTGRES_DB,
      retryAttempts: 5,
      retryDelay: 2000,
      migrationsRun: false,
      entities,
      synchronize,
    }),
    UserModule,
  ],
})
export class AppModule {}
