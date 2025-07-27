import { Component, computed, inject, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { UserInterface } from './types/user.interface';
import { FormsModule } from '@angular/forms';
import { UserFirebaseService } from '../../shared/services/userFirebase.service';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';

@Component({
  selector: 'app-user-list',
  imports: [FormsModule, AddUserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  providers: [UserService],
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);
  usersFirebaseService = inject(UserFirebaseService);

  columns: string[] = [
    'Select',
    'ID',
    'Picture',
    'Username',
    'Active',
    'VIP',
    'E-mail',
    'Actions',
  ];
  visibleUsers = computed(() => this.userService.usersSig());
  //blocking and unblocking
  toggleBlocked(user: UserInterface) {
    if (!user.id) return;
    const newBlocked = !user.blocked;
    this.usersFirebaseService
      .updateUserBlockedStatus(user.id, newBlocked)
      .subscribe({
        next: () => {
          console.log(
            `User ${user.username} is now ${newBlocked ? 'blocked' : 'unblocked'}`,
          );
        },
        error: (err) => {
          console.log('Error updating blocked status:', err);
        },
      });
  }

  //deleting user
  deletionProcess = false;
  selectedUser: UserInterface | null = null;

  deleteUserPopUp(user: UserInterface) {
    this.selectedUser = user;
    this.deletionProcess = true;
  }
  cancelDelete() {
    this.selectedUser = null;
    this.deletionProcess = false;
  }

  deleteUser() {
    if (!this.selectedUser?.id) return;
    this.deletionProcess = false;
    this.usersFirebaseService
      .deleteUserFromDB(this.selectedUser?.id)
      .subscribe({
        next: () => {
          console.log(
            `User ${this.selectedUser?.username} with ID ${this.selectedUser?.id} was deleted from the servers.`,
          );
          this.cancelDelete();
        },
        error: (err) => {
          console.log('Error deleting user:', err);
        },
      });
  }

  ngOnInit(): void {
    this.usersFirebaseService.getUsers().subscribe((users) => {
      this.userService.usersSig.set(users);
    });
  }
}
