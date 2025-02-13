import { HasuraAuthController } from './hasura-auth.controller';
import { HasuraAuthService } from './hasura-auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        HasuraAuthController,],
    providers: [
        HasuraAuthService,],
})
export class HasuraAuthModule { }
