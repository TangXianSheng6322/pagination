
import { Component, OnInit } from '@angular/core';
import { userItem } from '../../shared/models/userItem';
// import { UserService } from '../../shared/services/user.service';
import { UserInterface } from './types/user.interface';
import { SortingInterface } from './types/sorting.iterface';
import { FormBuilder, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  // providers: [UserService],
})
export class UserListComponent implements OnInit {
  searchValue: string = '';
  usersOnline: UserInterface[] = [];
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
  // constructor(
  //   private userService: UserService,
  //   private fb: FormBuilder,
  // ) {}
  // searchForm = this.fb.nonNullable.group({ searchValue: '' });

  sorting: SortingInterface = { column: 'ID', order: 'asc' };
  ngOnInit(): void {}
  // constructor(private userInterface: UserService) {}
  // ngOnInit(): void {
  // fetchData();
  //   });
  // }

  // fetchData(): void{
  //   this.userService.getUser(this.sorting, this.searchValue).subscribe((usersOnline) => {
  //      this.usersOnline = usersOnline;};

  users: UserInterface[] = [
    {
      userId: '1',
      picture: 'hgggn',
      username: 'Jiggly',
      active: true,
      vip: true,
      email: 'jigly@gmail.com',
      blocked: false,
    },
    {
      userId: '2',
      picture: 'jjii',
      username: 'Alaska',
      active: false,
      vip: false,
      email: 'alaska@gmail.com',
      blocked: false,
    },
  ];
  // onSearchSubmit(): void {
  //   this.searchValue = this.searchForm.value.searchValue ?? '';
  //   this.fetchData();
  // }
  isDescSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }
  isAscSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }
}
