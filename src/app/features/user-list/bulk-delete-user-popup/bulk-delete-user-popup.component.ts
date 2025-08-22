import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInterface } from '../../../core/models/user.interface';

@Component({
  selector: 'app-bulk-delete-user-popup',
  imports: [],
  templateUrl: './bulk-delete-user-popup.component.html',
  styleUrl: './bulk-delete-user-popup.component.css',
})
export class BulkDeleteUserPopupComponent {
  @Input() bulkUsersToDelete: UserInterface[] = [];
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  confirmBulkDelete() {
    this.confirmDelete.emit();
  }

  closeDeletePopup() {
    this.cancelDelete.emit();
  }
}
