import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, Provider } from '../auth.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['profile email']
    })
    this.logger.debug('[validate]' + configService.get('GOOGLE_AUTH_CLIENT_ID'));

  }

  async validate(request: any, accessToken: string, refreshToken: string, profile, done) {
    this.logger.debug('[validate]');
    console.log('profile', profile)

    try {
      const jwt = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);;
      const user = {
        name: profile.displayName,
        jwt
      }
      done(null, user);
    }
    catch (err) {
      console.error(err);
      done(err, false);
    }
  }

}