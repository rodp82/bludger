import { Controller, Get, Req, UseGuards, Res, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    this.logger.debug('[googleLogin]');
    // initiates the Google login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    // handles the Google OAuth2 callback
    this.logger.debug('[googleLoginCallback]');
    const jwt: string = this.authService.getToken(req.user);
    if (jwt) {
      res.redirect(`http://localhost:4200/auth/login?result=success&token=${jwt}&name=${req.user.name}`);
    } else {
      res.redirect('http://localhost:4200/auth/login?result=failure');
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    this.logger.debug('[getProfile]');
    // return the user from the request object as the JwtStrategy would've already done the lookup.
    return req.user;
  }
}
