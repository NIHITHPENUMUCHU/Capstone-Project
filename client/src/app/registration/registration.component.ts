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
  
  itemForm!: FormGroup; 
  formModel: any = { role: null, email: '', password: '', username: '' }; 
  showMessage: boolean = false; 
  responseMessage: any;
  showError: boolean = false;
  errorMessage: any;

  constructor(
    public router: Router, 
    public bookService: HttpService, 
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
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
      this.itemForm.markAllAsTouched();
    }
  }
}