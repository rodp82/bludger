import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'bludger-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent /* implements OnInit  */ {
  constructor(private authService: AuthService, private router: Router) { }

  // ngOnInit(): void { }

  logout() {
    this.authService.purgeAuth();
    this.router.navigate(['auth/login']);
  }
}
