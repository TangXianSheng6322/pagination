import { Timestamp } from '@angular/fire/firestore';

export interface AdminInterface {
  picture: string;
  username: string;
  email: string;
  createdAt?: Timestamp;
  lastUpdated?: Timestamp;
}
