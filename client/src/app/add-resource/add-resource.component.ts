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
  showMessage: boolean = false;
  responseMessage: string = '';
  showError: boolean = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      availability: [true]
    });
    this.getResources();
  }

  getResources(): void {
    this.httpService.GetAllResources().subscribe((data) => {
      this.resourceList = data;
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.addResource(this.itemForm.value).subscribe(
        (res) => {
          this.showMessage = true;
          this.responseMessage = "Resource added to global inventory!";
          this.itemForm.reset({ availability: true });
          this.getResources();
          setTimeout(() => this.showMessage = false, 3000);
        },
        (error) => {
          this.showError = true;
          this.errorMessage = "Failed to add resource.";
          setTimeout(() => this.showError = false, 3000);
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
