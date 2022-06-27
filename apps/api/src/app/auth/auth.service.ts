import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Provider, User } from '@bludger/api-interfaces';
import { UsersService } from '../users/users.service';



@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);
  private readonly JWT_SECRET = this.configService.get('JWT_SECRET', 'secretKey');

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateOAuthLogin(thirdPartyId: string, provider: Provider, profileData: User): Promise<User> {
    this.logger.debug('[validateOAuthLogin]');
    try {
      // You can add some registration logic here, 
      // to register the user using their thirdPartyId (in this case their googleId)
      this.logger.debug('Attempting to find existing user by thirdparty ID');
      let user = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);

      if (!user){
        this.logger.debug('No user found, attempt to register');
        user = await this.usersService.registerOAuthUser(thirdPartyId, provider, profileData);
      }

      return user;

    }
    catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  getToken(user: User): string {
    this.logger.debug('[getToken]');
    const payload = { name: user.name, sub: user.id };
    return this.jwtService.sign(payload);
  }

}
