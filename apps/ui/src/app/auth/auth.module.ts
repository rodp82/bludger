import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
// import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    AuthComponent,
    ProfileComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('jwtToken'),
        allowedDomains: ['localhost:3000'],
      },
    }),
    AuthRoutingModule,
  ],
  providers: [],
  exports:[]
})
export class AuthModule {}
