import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { IUser } from '../../users/interfaces/user.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Validates a user based on a supplied Bearer Token payload
   * @param payload 
   */
  async validate(payload: JwtPayload, done: any): Promise<void> {
    this.logger.debug('[validate]');
    try {
      // You could add a function to the authService to verify the claims of the token:
      // i.e. does the user still have the roles that are claimed by the token
      //const validClaims = await this.authService.verifyTokenClaims(payload);

      //if (!validClaims)
      //    return done(new UnauthorizedException('invalid token claims'), false);

      // return a user object with id instead of sub property
      const user = (({ thirdPartyId, provider}) => ({ id: thirdPartyId, provider, name: 'Rod', email: 'rod@email.com' }))(payload); //TODO

      done(null, user);
    }
    catch (err) {
      throw new UnauthorizedException('unauthorized', err.message);
    }
  }

}
