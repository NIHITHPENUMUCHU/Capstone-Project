import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html'
})
export class AddResourceComponent implements OnInit {
  // Required variables as per the Capstone document
  itemForm!: FormGroup;  
  formModel: any = { status: null }; 
  showError: boolean = false; 
  errorMessage: any; 
  resourceList: any = []; 
  assignModel: any = {};
  showMessage: any; 
  responseMessage: any;

  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Initialize the form with Validators required by the tests
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      availability: ['', Validators.required]
    });
    
    // Fetch resources as soon as the component loads
    this.getResouce(); 
  }

  getResouce(): void {
    this.httpService.GetAllResources().subscribe(
      (data: any) => { 
        this.resourceList = data; 
      },
      (error: any) => {
        this.showError = true;
        this.errorMessage = "Failed to load resources. Please try again.";
      }
    );
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.addResource(this.itemForm.value).subscribe(
        (res: any) => {
          // Clear the form and refresh the table list on success
          this.itemForm.reset();
          this.getResouce();
          this.showError = false;
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Failed to add resource. Ensure all fields are filled correctly.";
        }
      );
    }
  }
}
