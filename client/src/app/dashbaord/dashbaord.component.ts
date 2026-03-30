import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  roleName: string | null = null;
  currentDate: Date = new Date();
  
  // Live Data Variables
  activeEventsCount: number = 0;
  availableResources: number = 0;
  totalResources: number = 0;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    if (!this.authService.getLoginStatus()) {
      this.router.navigate(['/login']);
      return; 
    }

    const rawRole = this.authService.getRole();
    this.roleName = rawRole ? rawRole.toUpperCase() : null;

    // Fetch live data ONLY if the user is a Planner
    if (this.roleName === 'PLANNER') {
      this.fetchLiveMetrics();
    }
  }

  fetchLiveMetrics(): void {
    // 1. Fetch real event count
    this.httpService.GetAllevents().subscribe(
      (data: any[]) => { this.activeEventsCount = data ? data.length : 0; },
      (error) => console.error("Could not load events", error)
    );

    // 2. Fetch real resource counts
    this.httpService.GetAllResources().subscribe(
      (data: any[]) => { 
        if (data) {
          this.totalResources = data.length;
          // Count only resources where availability is true
          this.availableResources = data.filter(res => res.availability === true).length;
        }
      },
      (error) => console.error("Could not load resources", error)
    );
  }
}
