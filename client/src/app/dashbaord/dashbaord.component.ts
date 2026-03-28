import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashbaord', // Keeping your exact spelling
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  roleName: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Fetch the role so the HTML knows which dashboard cards to show
    this.roleName = this.authService.getRole();
  }
}