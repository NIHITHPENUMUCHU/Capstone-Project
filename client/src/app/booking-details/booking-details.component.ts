import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {

  activeTab: string = 'CATALOG';
  availableEvents: any[] = [];
  myTickets: any[] = [];
  username: string = '';

  constructor(public router: Router, public httpService: HttpService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'client';
    this.fetchActiveEvents();
    this.loadMyTickets();
  }

  fetchActiveEvents(): void {
    this.httpService.getActiveEvents().subscribe(
      (data: any[]) => { this.availableEvents = data; },
      (error) => console.error(error)
    );
  }

  loadMyTickets(): void {
    const stored = localStorage.getItem('myTickets_' + this.username);
    if (stored) {
      this.myTickets = JSON.parse(stored);
      this.syncTicketsWithDatabase();
    }
  }

  syncTicketsWithDatabase(): void {
    if (!this.myTickets || this.myTickets.length === 0) return;

    let updated = false;
    let checksCompleted = 0;

    // THE FIX: Securely check the status of each individual ticket using the Client's API
    this.myTickets.forEach((ticket, index) => {
      const eventId = ticket.eventID || ticket.id;

      this.httpService.getClientEventDetails(eventId).subscribe(
        (liveEvent: any) => {
          // If the backend says the event is now COMPLETED, update the local ticket
          if (liveEvent && liveEvent.status?.toUpperCase() !== ticket.status?.toUpperCase()) {
            this.myTickets[index].status = liveEvent.status?.toUpperCase();
            this.myTickets[index].title = liveEvent.title;
            updated = true;
          }

          checksCompleted++;

          // Once all tickets are checked, save to memory and instantly update the UI graphics!
          if (checksCompleted === this.myTickets.length && updated) {
            this.myTickets = [...this.myTickets]; // Forces Angular to instantly redraw the greyscale boxes
            localStorage.setItem('myTickets_' + this.username, JSON.stringify(this.myTickets));
          }
        },
        (error) => {
          console.error("Background sync failed for ticket ID:", eventId, error);
          checksCompleted++;
        }
      );
    });
  }


  bookTicket(event: any): void {
    const newTicket = {
      ...event,
      uniqueTicketId: Date.now() + Math.floor(Math.random() * 1000)
    };

    this.httpService.bookEventPass(event.eventID || event.id).subscribe(() => {
      this.myTickets.unshift(newTicket);
      localStorage.setItem('myTickets_' + this.username, JSON.stringify(this.myTickets));

      // Automatically switch to the Tickets tab after booking
      this.activeTab = 'MY_TICKETS';
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;

    // THE FIX: Force the background sync to run every time they open the Tickets tab!
    if (tab === 'MY_TICKETS') {
      this.syncTicketsWithDatabase();
    } else if (tab === 'CATALOG') {
      this.fetchActiveEvents();
    }
  }
}