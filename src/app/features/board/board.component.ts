import { Component } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserPiechartWidgetComponent } from './widgets/user-piechart-widget/user-piechart-widget.component';
import { UserStatsWidgetComponent } from './widgets/user-stats-widget/user-stats-widget.component';

@Component({
  selector: 'app-board',
  imports: [
    UserListComponent,
    NavbarComponent,
    UserPiechartWidgetComponent,
    UserStatsWidgetComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {}
