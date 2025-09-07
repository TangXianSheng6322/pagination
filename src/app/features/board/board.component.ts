import { Component, inject, signal } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserPiechartWidgetComponent } from './widgets/user-piechart-widget/user-piechart-widget.component';
import { UserStatsWidgetComponent } from './widgets/user-stats-widget/user-stats-widget.component';
import { AddUserFormComponent } from '../user-list/add-user-form/add-user-form.component';
import { UserInterface } from '../../core/models/user.interface';
import { BulkDeleteUserPopupComponent } from '../user-list/bulk-delete-user-popup/bulk-delete-user-popup.component';
import { DeleteUserPopupComponent } from '../user-list/delete-user-popup/delete-user-popup.component';
import { forkJoin } from 'rxjs';
import { UserFirebaseService } from '../../core/services/userFirebase.service';
import { MenuComponent } from './navbar/menu/menu.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-board',
  imports: [
    UserListComponent,
    NavbarComponent,
    UserPiechartWidgetComponent,
    UserStatsWidgetComponent,
    AddUserFormComponent,
    BulkDeleteUserPopupComponent,
    DeleteUserPopupComponent,
    MenuComponent,
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

  usersFirebaseService = inject(UserFirebaseService);

  singleUserToDelete = signal<UserInterface | null>(null);
  bulkUsersToDelete = signal<UserInterface[]>([]);

  closeDeletePopup() {
    this.singleUserToDelete.set(null);
    this.bulkUsersToDelete.set([]);
  }

  deleteSingleUser() {
    const user = this.singleUserToDelete();
    if (!user?.id) return;

    this.usersFirebaseService.deleteUserFromDB(user.id).subscribe({
      next: () => {
        console.log('Deleted single user', user);
        this.closeDeletePopup();
      },
      error: (err) => console.error(err),
    });
  }

  deleteBulkUsers() {
    const users = this.bulkUsersToDelete().filter((u) => u.id !== undefined);
    const deletions = users.map((u) =>
      this.usersFirebaseService.deleteUserFromDB(u.id!),
    );

    forkJoin(deletions).subscribe({
      next: () => {
        console.log('Deleted bulk users', users);
        this.closeDeletePopup();
      },
      error: (err) => console.error(err),
    });
  }

  handleSingleDelete(user: UserInterface) {
    this.singleUserToDelete.set(user);
  }

  handleBulkDelete(users: UserInterface[]) {
    this.bulkUsersToDelete.set(users);
  }

  //menu
  menuOpen: boolean = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
