import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  
  // Variables strictly matching the Capstone Document (File 11)
  itemForm!: FormGroup; 
  formModel: any = { role: null, email: '', password: '', username: '' }; 
  showMessage: boolean = false; 
  responseMessage: any;
  
  // Adding error handling variables for a better user experience
  showError: boolean = false;
  errorMessage: any;

  constructor(
    public router: Router, 
    public bookService: HttpService, // Required by doc to be named 'bookService' here
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // Exactly 4 controls with strict validators required by Test Cases 34, 35, and 36
    this.itemForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [null, Validators.required]
    });
  }

  onRegister(): void {
    if (this.itemForm.valid) {
      this.bookService.registerUser(this.itemForm.value).subscribe(
        (res: any) => {
          this.showMessage = true;
          this.responseMessage = "Registration Successful! You can now log in.";
          this.showError = false;
          
          this.itemForm.reset();
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Registration Failed. This username or email might already be taken.";
          this.showMessage = false;
        }
      );
    } else {
      // Required by Document: Marks all controls as touched to show validation errors if the form is invalid
      this.itemForm.markAllAsTouched();
    }
  }
}