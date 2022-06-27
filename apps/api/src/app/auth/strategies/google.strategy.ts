import { Provider, User } from '@bludger/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';


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

  async validate(request: any, accessToken: string, refreshToken: string, profile: Profile, done) {
    this.logger.debug('[validate]');

    try {
      const userData: User = {
        name: profile.displayName,
        email: profile.emails[0].value
      }
      const user = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE, userData);
      done(null, user);
    }
    catch (err) {
      console.error(err);
      done(err, false);
    }
  }

}