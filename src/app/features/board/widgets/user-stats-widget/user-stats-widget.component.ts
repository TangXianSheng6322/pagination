import { Component, OnInit } from '@angular/core';
import { UserFirebaseService } from '../../../../core/services/userFirebase.service';

@Component({
  selector: 'app-user-stats-widget',
  templateUrl: './user-stats-widget.component.html',
  styleUrls: ['./user-stats-widget.component.css'],
})
export class UserStatsWidgetComponent implements OnInit {
  totalUsers = 0;
  activeUsers = 0;
  vipUsers = 0;

  // ✅ Percentage properties for progress bars
  activeUsersPercent = 0;
  vipUsersPercent = 0;

  constructor(private userService: UserFirebaseService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.totalUsers = users.length;
      this.activeUsers = users.filter((u) => u.active).length;
      this.vipUsers = users.filter((u) => u.vip).length;

      // ✅ Compute percentages
      this.activeUsersPercent = this.totalUsers
        ? (this.activeUsers / this.totalUsers) * 100
        : 0;
      this.vipUsersPercent = this.totalUsers
        ? (this.vipUsers / this.totalUsers) * 100
        : 0;
    });
  }
}
