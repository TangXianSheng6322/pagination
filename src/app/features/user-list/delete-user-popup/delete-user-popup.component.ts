import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInterface } from '../../../core/models/user.interface';

@Component({
  selector: 'app-delete-user-popup',
  imports: [],
  templateUrl: './delete-user-popup.component.html',
  styleUrl: './delete-user-popup.component.css',
})
export class DeleteUserPopupComponent {
  @Input() singleUserToDelete!: UserInterface | null;
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  confirmSingleDelete() {
    this.confirmDelete.emit();
  }

  closeDeletePopup() {
    this.cancelDelete.emit();
  }
}
