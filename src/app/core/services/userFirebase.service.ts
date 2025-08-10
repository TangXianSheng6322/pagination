import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, map, Observable, switchMap, take } from 'rxjs';
import { UserInterface } from '../models/user.interface';
import { addDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UserFirebaseService {
  firestore = inject(Firestore);
  userCollection = collection(this.firestore, 'users');

  //Get Users
  getUsers(): Observable<UserInterface[]> {
    return collectionData(this.userCollection, {
      idField: 'id',
    }) as Observable<UserInterface[]>;
  }

  //Add User
  addUser(
    username: string,
    email: string,
    picture: string,
  ): Observable<string> {
    return this.getUsers().pipe(
      take(1),
      map((users) => {
        const maxId = users.reduce((max, user) => {
          const id = parseInt(user.userId, 10);
          return id > max ? id : max;
        }, 0);

        const newUser: UserInterface = {
          userId: String(maxId + 1),
          picture,
          username,
          email,
          active: Math.random() < 0.7,
          vip: Math.random() < 0.5,
          blocked: false,
        };

        return newUser;
      }),
      switchMap((newUser) => from(addDoc(this.userCollection, newUser))),
      map((docRef) => docRef.id),
    );
  }

  //Block User
  updateUserBlockedStatus(
    userDocId: string,
    blocked: boolean,
  ): Observable<void> {
    const userDocRef = doc(this.userCollection, userDocId);
    return from(updateDoc(userDocRef, { blocked }));
  }

  //Delete User
  deleteUserFromDB(userDocId: string): Observable<void> {
    const userDocRef = doc(this.userCollection, userDocId);
    return from(deleteDoc(userDocRef));
  }
}
