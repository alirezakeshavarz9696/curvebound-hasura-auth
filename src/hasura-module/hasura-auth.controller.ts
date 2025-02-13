import { Controller, Post, UseGuards, Req, HttpCode } from '@nestjs/common';
import { HasuraAuthGuard } from './gaurd/hasura-auth.gaurd';
import { Request } from 'express';

@Controller('hasura-auth')
export class HasuraAuthController {
    @Post()
    @HttpCode(200)
    @UseGuards(HasuraAuthGuard)
    authenticateUser(@Req() request: Request) {
        const user = request['user'];

        return {
            "X-Hasura-User-Id": user.sub.toString(),
            "X-Hasura-Role": "user",
        };
    }
}
