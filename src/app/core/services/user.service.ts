import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../models/user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  usersSig = signal<UserInterface[]>([]);
}
