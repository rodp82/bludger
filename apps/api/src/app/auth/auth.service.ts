import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';

// import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
// import { IUser } from '../users/interfaces/user.interface';

export enum Provider {
  // LOCAL = 'local',
  GOOGLE = 'google'
}

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);
  private readonly JWT_SECRET = this.configService.get('JWT_SECRET', 'secretKey');

  constructor(
    private readonly configService: ConfigService,
    // private readonly usersService: UsersService,
    // private readonly jwtService: JwtService
  ) {
    // this.oauthClient = new google.auth.OAuth2(
    //   clientID,
    //   clientSecret
    // );
  }

  // async authenticate(token: string) {
  //   const tokenInfo = await this.oauthClient.getTokenInfo(token);

  //   const email = tokenInfo.email;

  //   try {
  //     const user = await this.usersService.getByEmail(email);

  //     return this.handleRegisteredUser(user);
  //   } catch (error) {
  //     if (error.status !== 404) {
  //       throw new error;
  //     }

  //     return this.registerUser(token, email);
  //   }
  // }

  async validateOAuthLogin(thirdPartyId: string, provider: Provider): Promise<string> {
    try {
      // You can add some registration logic here, 
      // to register the user using their thirdPartyId (in this case their googleId)
      // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);

      // if (!user)
      // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);

      const payload = {
        thirdPartyId,
        provider
      }

      const jwt: string = sign(payload, this.JWT_SECRET, { expiresIn: 3600 });
      return jwt;
    }
    catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

}
