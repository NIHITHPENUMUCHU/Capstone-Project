import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  itemForm!: FormGroup;
  showMessage: boolean = false;
  responseMessage: string = '';
  showError: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Added strict Regex Validation Patterns
    this.itemForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{4,20}$/)]], // 4-20 chars, no spaces
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]], // Valid Email format
      password: ['', [Validators.required, Validators.minLength(6)]], // Min 6 characters
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.registerUser(this.itemForm.value).subscribe(
        (res: any) => {
          this.showMessage = true;
          this.responseMessage = "Registration successful! Redirecting to login...";
          this.showError = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        (error: any) => {
          this.showError = true;
          this.showMessage = false;
          // Catching the duplicate entry error from the backend
          if (error.status === 400 || error.status === 500) {
             this.errorMessage = "Registration failed: Username or Email already exists!";
          } else {
             this.errorMessage = "An unexpected error occurred. Please try again.";
          }
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
