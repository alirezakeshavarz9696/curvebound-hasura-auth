import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class HasuraAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        console.log(process.env.JWT_SECRET);
        // console.log('Received Request Headers:', request.headers);
        // console.log('Received Request Body:', request.body);

        const token = request.body['headers']['authorization']?.replace('Bearer ', '');
        if (!token) {
            throw new UnauthorizedException('Missing authentication token');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {

            }) as any;

            // Attach user information to the request (optional)
            request['user'] = decoded;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
