import { Component, signal } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserPiechartWidgetComponent } from './widgets/user-piechart-widget/user-piechart-widget.component';
import { UserStatsWidgetComponent } from './widgets/user-stats-widget/user-stats-widget.component';
import { AddUserFormComponent } from '../user-list/add-user-form/add-user-form.component';
import { UserInterface } from '../../core/models/user.interface';

@Component({
  selector: 'app-board',
  imports: [
    UserListComponent,
    NavbarComponent,
    UserPiechartWidgetComponent,
    UserStatsWidgetComponent,
    AddUserFormComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  popupVisible = false;

  openPopupHandler() {
    this.popupVisible = true;
  }

  closePopup() {
    this.popupVisible = false;
  }

  singleUserToDelete = signal<UserInterface | null>(null);
  bulkUsersToDelete = signal<UserInterface[]>([]);

  // Called from UserListComponent
  handleSingleDelete(user: UserInterface) {
    this.singleUserToDelete.set(user);
  }

  handleBulkDelete(users: UserInterface[]) {
    this.bulkUsersToDelete.set(users);
  }

  closeDeletePopup() {
    this.singleUserToDelete.set(null);
    this.bulkUsersToDelete.set([]);
  }

  confirmSingleDelete() {
    // Here you can call the service to delete the single user
    console.log('Deleting single user', this.singleUserToDelete());
    this.closeDeletePopup();
  }

  confirmBulkDelete() {
    // Here you can call the service to delete all selected users
    console.log('Deleting bulk users', this.bulkUsersToDelete());
    this.closeDeletePopup();
  }
}
