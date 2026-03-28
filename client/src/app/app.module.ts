import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // CRITICAL FOR FORMS

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ResourceAllocateComponent } from './resource-allocate/resource-allocate.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashbaordComponent,
    CreateEventComponent,
    AddResourceComponent,
    ResourceAllocateComponent,
    ViewEventsComponent,
    BookingDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,           // FIXES BLANK SCREEN
    ReactiveFormsModule    // FIXES BLANK SCREEN
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }