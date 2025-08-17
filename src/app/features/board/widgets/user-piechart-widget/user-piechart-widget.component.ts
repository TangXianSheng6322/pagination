import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserFirebaseService } from '../../../../core/services/userFirebase.service';

@Component({
  selector: 'app-user-piechart-widget',
  imports: [BaseChartDirective],
  templateUrl: './user-piechart-widget.component.html',
  styleUrl: './user-piechart-widget.component.css',
})
export class UserPiechartWidgetComponent implements OnInit {
  inactiveUsers = 0;
  activeUsers = 0;
  vipUsers = 0;
  blockedUsers = 0;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Active Users', 'Inactive Users', 'VIP Users', 'Blocked Users'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#10B981', '#F59E0B', '#C084FC', '#C084GC'],
      },
    ],
  };

  public pieChartType: ChartType = 'pie';

  constructor(private userService: UserFirebaseService) {}
  ngOnInit(): void {
    console.log('Pie chart widget initialized');
    this.userService.getUsers().subscribe((users) => {
      this.inactiveUsers = users.filter((u) => u.active === false).length;
      this.activeUsers = users.filter((u) => u.active === true).length;
      this.vipUsers = users.filter((u) => u.vip === true).length;
      this.blockedUsers = users.filter((u) => u.blocked === true).length;

      this.pieChartData = {
        ...this.pieChartData,
        datasets: [
          {
            ...this.pieChartData.datasets[0],
            data: [
              this.activeUsers,
              this.inactiveUsers,
              this.vipUsers,
              this.blockedUsers,
            ],
          },
        ],
      };
    });
  }
}
