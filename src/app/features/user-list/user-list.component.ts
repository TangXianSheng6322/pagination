import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { UserFirebaseService } from '../../core/services/userFirebase.service';
import { FormsModule } from '@angular/forms';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';
import { forkJoin } from 'rxjs';
import { faker } from '@faker-js/faker';
import { UserInterface } from '../../core/models/user.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [FormsModule, AddUserFormComponent, NgClass],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  providers: [UserService],
})
export class UserListComponent implements OnInit {
  // Services And Constants
  userService = inject(UserService);
  usersFirebaseService = inject(UserFirebaseService);

  trackByUserId(index: number, user: any) {
    return user.userId;
  }

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

  visibleUsers = computed(() => {
    const users = this.userService.usersSig();
    const search = this.searchText().toLowerCase();
    const asc = this.sortAscending();

    return users
      .filter(
        (user) =>
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search),
      )
      .filter((user) => {
        switch (this.statusFilter()) {
          case 'vip':
            return user.vip === true;
          case 'active':
            return user.active === true;
          case 'blocked':
            return user.blocked === true;
          case 'inactive':
            return user.active === false;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        const idA = parseInt(a.userId, 10);
        const idB = parseInt(b.userId, 10);
        return asc ? idA - idB : idB - idA;
      });
  });

  //Search and Sorting
  searchText = signal('');
  sortAscending = signal(true);
  toggleSortDirection() {
    this.sortAscending.set(!this.sortAscending());
  }

  //Filtering
  statusFilter = signal<'all' | 'vip' | 'active' | 'blocked' | 'inactive'>(
    'all',
  );

  // Selection Management
  selectedUsers: Set<UserInterface> = new Set();
  selectAll: boolean = false;

  isUserSelected(user: UserInterface): boolean {
    return Array.from(this.selectedUsers).some(
      (selected) => selected.userId === user.userId,
    );
  }

  toggleUserSelection(user: UserInterface) {
    const alreadySelected = this.isUserSelected(user);
    if (alreadySelected) {
      this.selectedUsers.forEach((u) => {
        if (u.userId === user.userId) {
          this.selectedUsers.delete(u);
        }
      });
    } else {
      this.selectedUsers.add(user);
    }
  }

  toggleSelectAll(visibleUsers: UserInterface[]) {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      visibleUsers.forEach((user) => {
        if (!this.isUserSelected(user)) {
          this.selectedUsers.add(user);
        }
      });
    } else {
      this.selectedUsers.clear();
    }
  }

  selectAllUsers() {
    const allSelected = this.visibleUsers().every((user) =>
      this.selectedUsers.has(user),
    );

    if (allSelected) {
      this.visibleUsers().forEach((user) => this.selectedUsers.delete(user));
    } else {
      this.visibleUsers().forEach((user) => this.selectedUsers.add(user));
    }
  }

  // Blocking Methods
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

  blockInBulk(shouldBlock: boolean) {
    const updates = Array.from(this.selectedUsers)
      .filter((user) => user.id !== undefined)
      .map((user) => {
        return this.usersFirebaseService.updateUserBlockedStatus(
          user.id!,
          shouldBlock,
        );
      });

    forkJoin(updates).subscribe({
      next: () => {
        console.log(`Users ${shouldBlock ? 'blocked' : 'unblocked'}`);
        this.selectedUsers.clear();
      },
      error: (err) => {
        console.error('Error updating block status:', err);
      },
    });
  }

  // Single Deletion
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

  // Bulk Deletion
  deletionPopupVisible = false;
  usersToDelete: UserInterface[] = [];

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
    const deletions = this.usersToDelete
      .filter((user) => user.id !== undefined)
      .map((user) => {
        return this.usersFirebaseService.deleteUserFromDB(user.id!);
      });

    forkJoin(deletions).subscribe({
      next: () => {
        this.usersToDelete.forEach((user) => {
          console.log(
            `User ${user.username} (ID: ${user.userId}) has been deleted`,
          );
        });
        this.selectedUsers.clear();
        this.closePopup();
      },
      error: (err) => {
        console.log('Error deleting users:', err);
        this.closePopup();
      },
    });
  }

  // Random User Generation
  generateRandomUser() {
    return {
      picture: faker.image.avatar(),
      username: faker.internet.username(),
      email: faker.internet.email(),
    };
  }

  addRandomUsers(count: number = 1) {
    const addRequests = Array.from({ length: count }, () => {
      const randomUser = this.generateRandomUser();
      return this.usersFirebaseService.addUser(
        randomUser.username,
        randomUser.email,
        randomUser.picture,
      );
    });

    forkJoin(addRequests).subscribe({
      next: () => {
        console.log(`${count} users added`);
        this.usersFirebaseService.getUsers().subscribe((users) => {
          this.userService.usersSig.set(users);
        });
      },
      error: (err) => {
        console.error('Error adding users:', err);
      },
    });
  }

  //Paginated Users
  currentPage = signal(1);
  usersPerPage = signal(10);

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.usersPerPage();
    const end = start + this.usersPerPage();
    return this.visibleUsers().slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.visibleUsers().length / this.usersPerPage()),
  );

  //Navigation
  nextPage() {
    if (this.currentPage() < this.usersPerPage()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
  // Hook
  ngOnInit(): void {
    this.usersFirebaseService.getUsers().subscribe((users) => {
      this.userService.usersSig.set(users);
    });
  }
}
