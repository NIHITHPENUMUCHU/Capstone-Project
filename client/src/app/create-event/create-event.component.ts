import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  itemForm!: FormGroup;
  eventList: any[] = [];
  showMessage: boolean = false;
  responseMessage: string = '';
  showError: boolean = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      eventDate: ['', Validators.required],
      location: ['', Validators.required],
      status: ['SCHEDULED'] // Default status
    });
    this.getEvents();
  }

  getEvents(): void {
    this.httpService.GetAllevents().subscribe((data) => {
      this.eventList = data;
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.createEvent(this.itemForm.value).subscribe(
        (res) => {
          this.showMessage = true;
          this.responseMessage = "Event successfully drafted!";
          this.itemForm.reset({ status: 'SCHEDULED' });
          this.getEvents();
          setTimeout(() => this.showMessage = false, 3000);
        },
        (error) => {
          this.showError = true;
          this.errorMessage = "Failed to create event. Please try again.";
          setTimeout(() => this.showError = false, 3000);
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
