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
  totalEvents: number = 0;
  scheduledEvents: number = 0;
  ongoingEvents: number = 0;
  completedEvents: number = 0;

  availableResources: number = 0;
  totalResources: number = 0;
  totalAllocations: number = 0;

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
    // 1. Fetch Events & Calculate Statuses
    this.httpService.GetAllevents().subscribe(
      (data: any[]) => { 
        if (data) {
          this.totalEvents = data.length;
          this.scheduledEvents = data.filter(e => e.status?.toUpperCase() === 'SCHEDULED').length;
          this.ongoingEvents = data.filter(e => e.status?.toUpperCase() === 'ONGOING').length;
          this.completedEvents = data.filter(e => e.status?.toUpperCase() === 'COMPLETED').length;
        }
      },
      (error) => console.error("Could not load events", error)
    );

    // 2. Fetch Resources
    this.httpService.GetAllResources().subscribe(
      (data: any[]) => { 
        if (data) {
          this.totalResources = data.length;
          this.availableResources = data.filter(res => res.availability === true).length;
        }
      },
      (error) => console.error("Could not load resources", error)
    );

    // 3. Fetch Allocations (with deduplication)
    this.httpService.getAllAllocations().subscribe(
      (data: any[]) => {
        if (data) {
          const seen = new Set();
          const uniqueAllocations = data.filter(alloc => {
            const uniqueKey = `${alloc.event?.eventID}-${alloc.resource?.resourceID}`;
            if (seen.has(uniqueKey)) return false;
            seen.add(uniqueKey);
            return true;
          });
          this.totalAllocations = uniqueAllocations.length;
        }
      },
      (error) => console.error("Could not load allocations", error)
    );
  }

  toggleFAQ(): void { this.showFAQ = !this.showFAQ; }
  
  toggleFaqItem(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }
}