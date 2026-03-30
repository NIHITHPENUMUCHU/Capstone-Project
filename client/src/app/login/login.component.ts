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
    this.itemForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.itemForm.valid) {
      this.httpService.Login(this.itemForm.value).subscribe(
        (res: any) => {
          this.authService.saveToken(res.token);
          this.authService.SetRole(res.role || 'CLIENT'); 
          this.showError = false;
          
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = "Incorrect username or password. Please try again.";
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  registration(): void {
    this.router.navigate(['/registration']);
  }
}