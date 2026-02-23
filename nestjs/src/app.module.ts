import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todos/todo.module';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import argon2Config from './config/argon2.config';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, argon2Config],
      validationSchema,
      validationOptions: { abortEarly: true, allowUnknown: true },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        ...configService.get('database'),
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    AuthModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
