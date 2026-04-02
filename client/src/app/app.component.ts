import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showLogoutModal: boolean = false;
  
  // Header Beacon Variables
  notifications: any[] = [];
  showNotifications: boolean = false;
  pollingInterval: any;

  constructor(private authService: AuthService, private router: Router, private httpService: HttpService) {}

  ngOnInit() {
    // Background scanner that fetches alerts every 5 seconds!
    this.pollingInterval = setInterval(() => {
      if (this.IsLoggin && (this.roleName === 'PLANNER' || this.roleName === 'STAFF')) {
        const rolePath = this.roleName.toLowerCase();
        this.httpService.getNotifications(rolePath).subscribe(data => {
           this.notifications = data;
        });
      }
    }, 5000);
  }

  ngOnDestroy() { clearInterval(this.pollingInterval); }

  get IsLoggin(): boolean { return this.authService.getLoginStatus(); }
  get roleName(): string | null { const r = this.authService.getRole(); return r ? r.toUpperCase() : null; }

  toggleNotifications(): void { this.showNotifications = !this.showNotifications; }
  triggerLogout(): void { this.showLogoutModal = true; }
  cancelLogout(): void { this.showLogoutModal = false; }
  
  confirmLogout(): void {
    this.authService.logout();
    this.showLogoutModal = false;
    this.showNotifications = false;
    this.router.navigate(['/login']);
  }
}
