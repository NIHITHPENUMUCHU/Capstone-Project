import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls: ['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent implements OnInit {
  
  itemForm!: FormGroup;  
  showError: boolean = false; 
  errorMessage: string = ''; 
  showMessage: boolean = false; 
  responseMessage: string = ''; 
  
  resourceList: any[] = []; 
  eventList: any[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    public httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      eventId: ['', Validators.required],
      resourceId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]] // Added quantity back!
    });

    this.getEvent();
    this.getResources();
  }

  getEvent(): void {
    this.httpService.GetAllevents().subscribe(
      (data: any) => { this.eventList = data; },
      (error: any) => { console.error("Failed to fetch events", error); }
    );
  }

  getResources(): void {
    this.httpService.GetAllResources().subscribe(
      (data: any) => { this.resourceList = data; },
      (error: any) => { console.error("Failed to fetch resources", error); }
    );
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const formValues = this.itemForm.value;
      
      // Using your exact method signature: eventId, resourceId, and the form payload
      this.httpService.allocateResources(formValues.eventId, formValues.resourceId, formValues).subscribe(
        (res: any) => {
          this.showMessage = true;
          this.responseMessage = "Resource successfully allocated to the event!";
          this.showError = false;
          
          this.itemForm.reset();
          this.getResources(); // Refresh resources to update their availability status
          
          setTimeout(() => this.showMessage = false, 3000);
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Failed to allocate resource. Please check availability and try again.";
          this.showMessage = false;
          
          setTimeout(() => this.showError = false, 3000);
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
