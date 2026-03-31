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
  
  // Live Database Metrics
  activeEventsCount: number = 0;
  availableResources: number = 0;
  totalResources: number = 0;

  // Client FAQ Tracking
  showFAQ: boolean = false;
  activeFaqIndex: number | null = null;

  faqs = [
    { question: 'How do I use this dashboard?', answer: 'Click "Retrieve Booking" to search for your event using the Booking ID provided by your planner.' },
    { question: 'Can I purchase tickets directly here?', answer: 'Currently, EventMaster Pro operates as a B2B management system. All ticket allocations are finalized directly with your Event Planner.' },
    { question: 'What does "Ongoing" status mean?', answer: 'If your digital ticket says "Ongoing", it means our Staff team has actively set up the venue and operations are currently running live!' }
  ];

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

    if (this.roleName === 'PLANNER') {
      this.fetchLiveMetrics();
    }
  }

  fetchLiveMetrics(): void {
    this.httpService.GetAllevents().subscribe(
      (data: any[]) => { this.activeEventsCount = data ? data.length : 0; },
      (error) => console.error("Could not load events", error)
    );

    this.httpService.GetAllResources().subscribe(
      (data: any[]) => { 
        if (data) {
          this.totalResources = data.length;
          this.availableResources = data.filter(res => res.availability === true).length;
        }
      },
      (error) => console.error("Could not load resources", error)
    );
  }

  toggleFAQ(): void { this.showFAQ = !this.showFAQ; }
  
  toggleFaqItem(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }
}
