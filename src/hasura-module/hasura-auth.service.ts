/*
https://docs.nestjs.com/providers#services
*/

//#region Imports
// NestJS
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

// Database
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Caching
import { Cache } from 'cache-manager';

// Entities
import { User } from './entities/user.entity';
//#endregion

@Injectable()
export class HasuraAuthService {
  //#region Constructor and Properties
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(CACHE_MANAGER) cacheManager: Cache
  ) {
    this.cacheManager = cacheManager;
  }
  private cacheManager: Cache;
  private readonly CACHE_TTL = 1000 * 60 * 10; // 10 minutes
  private readonly logger = new Logger(HasuraAuthService.name);
  //#endregion

  //#region Methods 
  async authenticateUser(request: Request) {
    const user = request['user'] as { sub: string };

    this.logger.log(`Authenticated user: ${user.sub}`);
  }

  public async checkAndCreateUser(userId: string, wallet_address: string): Promise<string> {
    try {
      // Check cache first
      const cachedUser = await this.cacheManager.get<string>(`user:${userId}`);
      if (cachedUser) {
        this.logger.log(`User found in cache: ${userId}`);
        return cachedUser;
      }

      this.logger.log(`Checking if user exists with ID: ${userId}`);

      const existingUser = await this.dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      if (!existingUser) {
        this.logger.log(`Creating new user with ID: ${userId}`);
        const newUser = new User();
        newUser.id = userId;
        newUser.wallet_address = wallet_address;
        const savedUser = await this.dataSource
          .getRepository(User)
          .save(newUser);

        // Cache the new user
        await this.cacheManager.set(
          `user:${savedUser.id}`,
          savedUser.id,
          this.CACHE_TTL
        );

        return savedUser.id;
      }

      // Cache the existing user
      await this.cacheManager.set(
        `user:${existingUser.id}`,
        existingUser.id,
        this.CACHE_TTL
      );

      return existingUser.id;

    } catch (error) {
      this.logger.error(`Error checking/creating user: ${error.message}`);
      throw error;
    }
  }
  //#endregion
}
