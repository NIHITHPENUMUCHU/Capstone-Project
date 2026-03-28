import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  // Variables strictly matching the Capstone Document
  itemForm!: FormGroup; 
  formModel: any = {}; 
  showError: boolean = false; 
  errorMessage: any;

  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Both fields must be required to pass test cases 31, 32, and 33
    this.itemForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.itemForm.valid) {
      this.httpService.Login(this.itemForm.value).subscribe(
        (res: any) => {
          // Save token and role to local storage via AuthService
          this.authService.saveToken(res.token);
          this.authService.SetRole(res.role || 'CLIENT'); 
          
          this.showError = false;
          
          // Redirect to the dashboard
          this.router.navigate(['/dashboard']);
          
          // Slight delay to ensure routing completes before the mandated page reload
          setTimeout(() => { 
            window.location.reload(); 
          }, 100);
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Incorrect username or password. Please try again.";
        }
      );
    } else {
      // Mark all controls as touched to trigger validation messages in the UI
      this.itemForm.markAllAsTouched();
    }
  }

  registration(): void {
    this.router.navigate(['/registration']);
  }
}