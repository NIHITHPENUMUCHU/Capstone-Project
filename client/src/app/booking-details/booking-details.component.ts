import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  
  formModel: any = { eventID: null }; 
  showError: boolean = false; 
  errorMessage: string = ''; 
  eventObj: any = []; 
  scores$: any = []; 

  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  searchEvent(): void {
    if (this.formModel.eventID != null) {
      this.httpService.getBookingDetails(this.formModel.eventID).subscribe(
        (data: any) => {
          if (data) {
            this.eventObj = [data]; 
            this.scores$ = [data]; 
            this.showError = false;
          } else {
            this.showError = true;
            this.errorMessage = "Booking details not found.";
            this.eventObj = [];
            this.scores$ = [];
          }
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Failed to fetch booking details. Please verify the Event ID.";
          this.eventObj = [];
          this.scores$ = [];
        }
      );
    }
  }
}
