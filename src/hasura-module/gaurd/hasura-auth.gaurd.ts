import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class HasuraAuthGuard implements CanActivate {
  private readonly logger = new Logger(HasuraAuthGuard.name);
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.body['headers']['authorization']?.replace(
      'Bearer ',
      '',
    );
    if (!token) {
      this.logger.error('Missing authentication token');
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        {},
      ) as any;

      // Attach user information to the request (optional)
      request['user'] = decoded;

      return true;
    } catch (error) {
      this.logger.error(
        `Authentication failed: ${error.message} for token: ${token}`,
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}
