import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../../app/user-list/types/user.interface';
import { HttpClient } from '@angular/common/http';

// @Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUser(): Observable<UserInterface[]> {
    const url = 'http://localhost:3001/users';
    return this.httpClient.get<UserInterface[]>(url);
  }
}
