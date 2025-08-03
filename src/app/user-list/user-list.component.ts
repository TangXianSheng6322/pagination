import { Component, computed, inject, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { UserInterface } from './types/user.interface';
import { FormsModule } from '@angular/forms';
import { UserFirebaseService } from '../../shared/services/userFirebase.service';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';
import { forkJoin } from 'rxjs';

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

  //selecting users and selecting all users
  selectedUsers: Set<string> = new Set();
  selectAll: boolean = false;

  toggleUserSelection(userId: string) {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
  }

  toggleSelectAll(visibleUsers: UserInterface[]) {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      visibleUsers.forEach((user) => this.selectedUsers.add(user.userId));
    } else {
      this.selectedUsers.clear();
    }
  }

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

  //bulk block/unblock
  blockInBulk(shouldBlock: boolean) {
    const update = Array.from(this.selectedUsers).map((userId) => {
      return this.usersFirebaseService.updateUserBlockedStatus(
        userId,
        shouldBlock,
      );
    });

    forkJoin(update).subscribe({
      next: () => {
        console.log(`Users ${shouldBlock ? 'blocked' : 'unblocked'}`);
        this.selectedUsers.clear();
      },
      error: (err) => {
        console.log('Error blocking users:', err);
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

  //deleting in bulk
  deletionPopupVisible = false;
  usersToDelete: string[] = [];

  openBulkDeletionPopup() {
    this.usersToDelete = Array.from(this.selectedUsers);
    if (this.usersToDelete.length > 0) {
      this.deletionPopupVisible = true;
    }
  }

  closePopup() {
    this.deletionPopupVisible = false;
    this.usersToDelete = [];
  }

  confirmBulkDelete() {
    const deletions = this.usersToDelete.map((userId) => {
      return this.usersFirebaseService.deleteUserFromDB(userId);
    });

    forkJoin(deletions).subscribe({
      next: () => {
        (this.usersToDelete.forEach((user) => {
          console.log(`User ${user} hsa been deleted`);
        }),
          this.selectedUsers.clear());
        this.closePopup();
      },
      error: (err) => {
        console.log('Error deleting users', err);
        this.closePopup();
      },
    });
  }

  ngOnInit(): void {
    this.usersFirebaseService.getUsers().subscribe((users) => {
      this.userService.usersSig.set(users);
    });
  }
}
