import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  @Output() toggleMenuEvent = new EventEmitter<void>();
  toggleMenu() {
    this.toggleMenuEvent.emit();
  }
}
