import { Component } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-board',
  imports: [UserListComponent, NavbarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {}
