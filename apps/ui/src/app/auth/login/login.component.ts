import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '../shared/auth.service';

@Component({
  selector: 'bludger-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent /* implements OnInit  */ {

  error = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe({
      next: (authed) => {
        if (authed) {
          this.router.navigate(['auth/profile'])
        }
      },
      error: (err) => console.error(err)
    })
    this.route.queryParams.subscribe(params => {
      if (params['result'] && params['result'] === 'success') {
        console.log('params', params)
        this.authService.setAuth({ name: params['name'] }, params['token'])
      }
    })
  }

  signInWithGoogle() {
    window.location.href = '/api/auth/google';
    // this.socAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    //   .then(data => {
    //     // send info to backend to look up user
    //     this.authService.googleLogin(data).subscribe({
    //       next: () => this.router.navigate(['']),
    //       error: err => this.error = err.error.message
    //     });

    //   })
    //   .catch(err => this.error = 'Error signing in with Google');
  }

}
