import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { HasuraAuthGuard } from './gaurd/hasura-auth.gaurd';
import { Request } from 'express';
import { HasuraAuthService } from './hasura-auth.service';

@Controller('hasura-auth')
export class HasuraAuthController {
  constructor(private readonly authService: HasuraAuthService) { }

  private readonly logger = new Logger(HasuraAuthController.name);

  @Post()
  @HttpCode(200)
  @UseGuards(HasuraAuthGuard)
  async authenticateUser(@Req() request: Request) {
    const userData = request['user'] as { sub: string, wallet_address: string };

    this.logger.log(`start authentication for user: ${userData.sub}`);

    const userId = await this.authService.checkAndCreateUser(userData.sub, userData.wallet_address);

    this.logger.log(`authentication successful for user: ${userId}`);

    return {
      'X-Hasura-User-Id': userId,
      'X-Hasura-Role': 'user',
    };
  }
}
