import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
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
  
  notifications: any[] = [];
  showNotifications: boolean = false;
  unreadCount: number = 0; // NEW: Tracks only unread alerts!
  pollingInterval: any;

  // THE FIX: ElementRef injected to detect clicks
  constructor(private authService: AuthService, private router: Router, private httpService: HttpService, private eRef: ElementRef) {}

  // THE FIX: Smart Click-Outside Detector!
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.showNotifications) {
      const beaconWrapper = this.eRef.nativeElement.querySelector('.beacon-wrapper');
      // If they clicked somewhere on the screen that is NOT inside the notification box, close it!
      if (beaconWrapper && !beaconWrapper.contains(event.target)) {
        this.showNotifications = false;
      }
    }
  }

  ngOnInit() {
    this.fetchNotifications();
    this.pollingInterval = setInterval(() => { this.fetchNotifications(); }, 5000);
  }

  ngOnDestroy() { clearInterval(this.pollingInterval); }

  fetchNotifications() {
    if (this.IsLoggin && (this.roleName === 'PLANNER' || this.roleName === 'STAFF')) {
      const rolePath = this.roleName.toLowerCase();
      this.httpService.getNotifications(rolePath).subscribe(data => {
         this.notifications = data;
         // Count only the alerts where isRead is false!
         this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      });
    }
  }

  // NEW FEATURE: Mark a single alert as read
  markAsRead(notif: any, event: Event) {
    event.stopPropagation(); // Prevents the box from closing when clicking an item
    if (notif.isRead) return; // Ignore if already read
    
    const rolePath = this.roleName!.toLowerCase();
    this.httpService.markNotificationRead(rolePath, notif.id).subscribe(() => {
      notif.isRead = true; // Instantly dim it on screen
      this.unreadCount = this.notifications.filter(n => !n.isRead).length; // Update the badge
    });
  }

  // NEW FEATURE: Mark all alerts as read
  markAllAsRead(event: Event) {
    event.stopPropagation();
    const rolePath = this.roleName!.toLowerCase();
    this.httpService.markAllNotificationsRead(rolePath).subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
    });
  }

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