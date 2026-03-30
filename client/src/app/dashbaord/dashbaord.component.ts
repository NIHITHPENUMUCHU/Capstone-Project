import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  roleName: string | null = null;
  
  // Modern UI Mock Data
  currentDate: Date = new Date();
  activeEventsCount: number = 12;
  availableResources: number = 45;
  pendingAllocations: number = 3;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.getLoginStatus()) {
      this.router.navigate(['/login']);
      return; 
    }

    // CRITICAL FIX: Forces the role to be uppercase so the *ngIf never fails
    const rawRole = this.authService.getRole();
    this.roleName = rawRole ? rawRole.toUpperCase() : null;
  }
}
