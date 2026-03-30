import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // CRITICAL FIX: Changed ../../ to ../
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  IsLoggin: boolean = false;
  roleName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check local storage immediately when the app loads
    this.IsLoggin = this.authService.getLoginStatus();
    this.roleName = this.authService.getRole();
  }

  logout(): void {
    this.authService.logout();
    this.IsLoggin = false;
    this.roleName = null;
    this.router.navigate(['/login']);
  }
}
