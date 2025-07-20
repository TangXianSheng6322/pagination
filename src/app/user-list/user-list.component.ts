import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { userItem } from '../../shared/models/userItem';
// import { UserService } from '../../shared/services/user.service';
import { UserInterface } from './types/user.interface';
import { SortingInterface } from './types/sorting.iterface';

@Component({
  selector: 'app-user-list',
  imports: [NgFor, NgIf],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  // providers: [UserService],
})
export class UserListComponent implements OnInit {
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

  sorting: SortingInterface = { column: 'ID', order: 'asc' };
  ngOnInit(): void {}
  // constructor(private userInterface: UserService) {}
  // ngOnInit(): void {
  // fetchData();
  //   });
  // }

  // fetchData(): void{
  //   this.userService.getUser(this.sorting).subscribe((usersOnline) => {
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

  isDescSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }
  isAscSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }
}
