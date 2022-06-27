import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [{
  path: 'auth', component: AuthComponent, children: [
    { path: 'login', component: LoginComponent },
    // { path: 'logout', component: LogoutComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
