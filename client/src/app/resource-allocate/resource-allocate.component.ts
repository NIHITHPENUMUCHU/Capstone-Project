import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls: ['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent implements OnInit {
  
  // Variables strictly matching the Capstone Document
  itemForm!: FormGroup;  
  formModel: any = { status: null }; 
  showError: boolean = false; 
  errorMessage: any; 
  resourceList: any = []; 
  assignModel: any = {}; 
  showMessage: boolean = false; 
  responseMessage: any; 
  eventList: any = [];

  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // 3 controls required: eventId, resourceId, and quantity (Test Case 37)
    this.itemForm = this.formBuilder.group({
      eventId: ['', Validators.required],
      resourceId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });

    // Fetch dropdown data on load
    this.getEvent();
    this.getResources();
  }

  getEvent(): void {
    this.httpService.GetAllevents().subscribe(
      (data: any) => {
        this.eventList = data;
      },
      (error: any) => {
        console.error("Failed to fetch events", error);
      }
    );
  }

  getResources(): void {
    this.httpService.GetAllResources().subscribe(
      (data: any) => {
        this.resourceList = data;
      },
      (error: any) => {
        console.error("Failed to fetch resources", error);
      }
    );
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const formValues = this.itemForm.value;
      
      // HttpService expects (eventId, resourceId, details)
      this.httpService.allocateResources(formValues.eventId, formValues.resourceId, formValues).subscribe(
        (res: any) => {
          this.showMessage = true;
          this.responseMessage = "Resource successfully allocated to the event!";
          this.showError = false;
          
          // Reset form and refresh dropdowns to update resource availability
          this.itemForm.reset();
          this.getResources(); 
          
          console.log(this.responseMessage);
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Failed to allocate resource. Please check availability and try again.";
          this.showMessage = false;
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}