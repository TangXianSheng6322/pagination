import { Injectable, signal } from '@angular/core';
import { UserInterface } from '../models/user.interface';

@Injectable()
export class UserService {
  usersSig = signal<UserInterface[]>([]);
}
