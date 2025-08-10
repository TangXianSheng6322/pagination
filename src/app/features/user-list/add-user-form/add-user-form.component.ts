import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserFirebaseService } from '../../../core/services/userFirebase.service';

@Component({
  selector: 'app-add-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user-form.component.html',
  styleUrl: './add-user-form.component.css',
})
export class AddUserFormComponent {
  userFirebaseService = inject(UserFirebaseService);
  submitting = false;

  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    picture: new FormControl(''),
  });

  onSubmit() {
    if (this.userForm.valid && !this.submitting) {
      this.submitting = true;
      const { username, email, picture } = this.userForm.value;
      this.userForm.reset();
      this.userFirebaseService.addUser(username!, email!, picture!).subscribe({
        next: (docId) => {
          console.log('User added with ID:', docId);

          this.submitting = false;
        },
        error: (err) => {
          console.error('Error adding user:', err);
          this.submitting = false;
        },
      });
    }
  }
}
