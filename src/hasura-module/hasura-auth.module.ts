import { HasuraAuthController } from './hasura-auth.controller';
import { HasuraAuthService } from './hasura-auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [TypeOrmModule.forFeature([User]), CacheModule.register({ store: 'memory', max: 300 })],
  controllers: [HasuraAuthController],
  providers: [HasuraAuthService],
  exports: [HasuraAuthService],
})
export class HasuraAuthModule { }
