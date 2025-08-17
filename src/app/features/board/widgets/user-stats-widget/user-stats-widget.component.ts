import { Component, OnInit } from '@angular/core';
import { UserFirebaseService } from '../../../../core/services/userFirebase.service';

@Component({
  selector: 'app-user-stats-widget',
  imports: [],
  templateUrl: './user-stats-widget.component.html',
  styleUrl: './user-stats-widget.component.css',
})
export class UserStatsWidgetComponent implements OnInit {
  totalUsers = 0;
  activeUsers = 0;
  vipUsers = 0;

  constructor(private userService: UserFirebaseService) {}
  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.totalUsers = users.length;
      this.activeUsers = users.filter((u) => u.active === true).length;
      this.vipUsers = users.filter((u) => u.vip === true).length;
    });
  }
}
