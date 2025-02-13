import { HasuraAuthModule } from './hasura-module/hasura-auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HasuraAuthModule, ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
