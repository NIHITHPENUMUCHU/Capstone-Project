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
    // 3 strict controls required for allocation
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
      
      this.httpService.allocateResources(formValues.eventId, formValues.resourceId, formValues).subscribe(
        (res: any) => {
          this.showMessage = true;
          this.responseMessage = "Resource successfully allocated to the event!";
          this.showError = false;
          
          this.itemForm.reset();
          this.getResources(); // Refresh resources in case availability changed
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
