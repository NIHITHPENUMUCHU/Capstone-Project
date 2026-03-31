import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  // Controls the visibility of the logout confirmation modal
  showLogoutModal: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  get IsLoggin(): boolean {
    return this.authService.getLoginStatus();
  }

  get roleName(): string | null {
    const role = this.authService.getRole();
    return role ? role.toUpperCase() : null;
  }

  // Opens the modal instead of logging out immediately
  triggerLogout(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  // Actually performs the logout when confirmed
  confirmLogout(): void {
    this.authService.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }
}
