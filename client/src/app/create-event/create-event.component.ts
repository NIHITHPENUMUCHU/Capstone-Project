import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  
  // Variables strictly matching the Capstone Document
  itemForm!: FormGroup;  
  formModel: any = { status: null }; 
  showError: boolean = false; 
  errorMessage: any; 
  eventList: any = []; 
  assignModel: any = {};
  showMessage: boolean = false; 
  responseMessage: any;

  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) { }

    ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dateTime: ['', Validators.required],
      location: ['', Validators.required],
      status: ['SCHEDULED', Validators.required]
    });
    this.getEvent();
  }

  getEvent(): void {
    this.httpService.GetAllevents().subscribe(
      (data: any) => { 
        this.eventList = data; 
      },
      (error: any) => {
        this.showError = true;
        this.errorMessage = "Failed to fetch events from the server.";
        console.error(this.errorMessage, error);
      }
    );
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.createEvent(this.itemForm.value).subscribe(
        (res: any) => {
          this.showMessage = true;
          this.responseMessage = "Event created successfully!";
          this.showError = false;
          this.itemForm.reset({ status: 'SCHEDULED' });
          this.getEvent();
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Failed to create event. Please try again.";
          this.showMessage = false;
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
