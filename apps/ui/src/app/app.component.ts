import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './auth/shared/auth.service';

@Component({
  selector: 'bludger-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit  {

  user?: User;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe({
      next: (user) => this.user = user,
      error: console.error
    });
  }

  ngOnInit() {
    this.authService.checkAuth();
  }
}
