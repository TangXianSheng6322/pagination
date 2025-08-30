import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { UserInterface } from '../../../core/models/user.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  imports: [FormsModule, NgClass],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  // Plain Inputs (not signals)
  @Input() selectedUsers: Set<UserInterface> = new Set();
  @Input() searchTextValue: string = '';
  @Input() sortAscendingValue: boolean = true;
  @Input() statusFilterValue:
    | 'all'
    | 'vip'
    | 'active'
    | 'blocked'
    | 'inactive' = 'all';

  // Outputs
  @Output() selectAllUsers = new EventEmitter<void>();
  @Output() openBulkDeletionPopup = new EventEmitter<void>();
  @Output() blockInBulk = new EventEmitter<boolean>();
  @Output() addRandomUsers = new EventEmitter<void>();
  @Output() toggleSortDirection = new EventEmitter<void>();
  @Output() searchTextChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<
    'all' | 'vip' | 'active' | 'blocked' | 'inactive'
  >();
}
