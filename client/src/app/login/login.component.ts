import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.Login(this.itemForm.value).subscribe(
        (res: any) => {
          if (res && res.token) {
            this.authService.saveToken(res.token);
            // Uses the role we added to the LoginResponse DTO!
            this.authService.SetRole(res.role); 
            this.router.navigateByUrl('/dashboard');
          } else {
            this.showError = true;
            this.errorMessage = "Invalid response from server.";
          }
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Login failed. Please check your credentials and try again.";
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
