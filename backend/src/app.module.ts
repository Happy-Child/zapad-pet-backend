import * as config from 'config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GlobalFiltersModule } from '@libs/filters/global-filters.module';
import { GlobalPipesModule } from '@libs/pipes/global-pipes.module';
import { User } from '@libs/entities';

const entities = [User];

const synchronize = config.NODE_ENV === 'dev';

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
    GlobalPipesModule,
    GlobalFiltersModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
