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
  
  // Variables strictly matching the Capstone Document
  formModel: any = { status: null, eventID: null }; 
  showError: boolean = false; 
  errorMessage: any; 
  eventObj: any = []; 
  assignModel: any = {}; 
  showMessage: any; 
  responseMessage: any; 
  isUpdate: any = false;

  // Added to strictly satisfy the File 6 HTML *ngFor requirement
  scores$: any = []; 

  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Lifecycle hook called after component initialization (Reserved for future use)
  }

  searchEvent(): void {
    if (this.formModel.eventID != null) {
      this.httpService.getBookingDetails(this.formModel.eventID).subscribe(
        (data: any) => {
          if (data) {
            // Wrapping the object in an array to allow *ngFor iteration
            this.eventObj = [data]; 
            this.scores$ = [data]; // Satisfies the strict 'scores$' requirement
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