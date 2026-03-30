import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {
  itemForm!: FormGroup;  
  resourceList: any[] = []; 
  showError: boolean = false; 
  errorMessage: string = ''; 
  showMessage: boolean = false; 
  responseMessage: string = '';

  constructor(
    private formBuilder: FormBuilder, 
    public httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      availability: ['', Validators.required]
    });
    
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
          this.showMessage = true;
          this.responseMessage = "Resource successfully added to inventory!";
          this.showError = false;
          
          this.itemForm.reset();
          this.getResouce();
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Failed to add resource. Ensure all fields are filled correctly.";
          this.showMessage = false;
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
