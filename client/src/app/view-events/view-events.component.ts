import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {
  
  // Variables strictly matching the Capstone Document
  itemForm!: FormGroup;  
  formModel: any = { status: null, eventID: null }; 
  showError: boolean = false; 
  errorMessage: any; 
  eventObj: any = {}; 
  assignModel: any = {};
  showMessage: boolean = false; 
  responseMessage: any; 
  isUpdate: boolean = false;

  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Exactly 5 controls required by the automated test cases (Test 38, 39)
    this.itemForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dateTime: ['', Validators.required],
      location: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  searchEvent(): void {
    if (this.formModel.eventID) {
      this.httpService.GetEventdetails(this.formModel.eventID).subscribe(
        (data: any) => {
          if (data) {
            this.eventObj = data;
            this.showError = false;
            this.showMessage = false;
            this.edit(this.eventObj);
          } else {
            this.showError = true;
            this.errorMessage = "Event not found. Please check the ID.";
            this.isUpdate = false;
          }
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Failed to fetch event details. Ensure the ID is correct.";
          this.isUpdate = false;
        }
      );
    }
  }

  edit(val: any): void {
    this.isUpdate = true;
    
    // Pre-fill the form with the fetched event data
    this.itemForm.patchValue({
      title: val.title,
      description: val.description,
      dateTime: val.dateTime,
      location: val.location,
      status: val.status
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.updateEvent(this.itemForm.value, this.formModel.eventID).subscribe(
        (res: any) => {
          this.showMessage = true;
          this.responseMessage = "Event setup updated successfully!";
          this.showError = false;
          
          // Hide the form and reset after a successful update
          this.isUpdate = false; 
          this.itemForm.reset();
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Failed to update event. Please try again.";
          this.showMessage = false;
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}