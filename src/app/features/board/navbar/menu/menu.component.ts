import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  imports: [FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  @Input() open = false;
  @Output() closeMenu = new EventEmitter<void>();
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  view: 'main' | 'settings' = 'main';
  screenWidth = window.innerWidth;

  ngOnInit(): void {
    this.updateViewByScreen();
  }

  constructor(
    public auth: AuthService,
    private elementRef: ElementRef,
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.updateViewByScreen();
  }
  private updateViewByScreen() {
    if (this.screenWidth >= 1200) {
      this.view = 'settings';
    } else {
      this.view = 'main';
    }
  }
  get isMobile() {
    return this.screenWidth < 768;
  }

  get isDropdown() {
    return this.screenWidth >= 768 && this.screenWidth < 1200;
  }

  get isDesktop() {
    return this.screenWidth >= 1200;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isDropdown && this.open) {
      const clickedInside = this.dropdownRef?.nativeElement.contains(
        event.target,
      );
      if (!clickedInside) {
        this.closeMenu.emit();
      }
    }
  }
  @HostListener('window:scroll', [])
  onScroll() {
    if (!this.open) return;

    const menuEl = document.querySelector<HTMLElement>('app-menu');
    if (!menuEl) return;

    const rect = menuEl.getBoundingClientRect();
    const fullyOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;

    if (fullyOutOfView) {
      this.closeMenu.emit();
    }
  }

  logout() {
    this.auth.logout();
  }

  // //settings stuff
  // private setInitialUserData() {
  //   const user: User | null = this.auth.currentUser;
  //   if (user) {
  //     this.username = user.displayName || '';
  //     this.profileUrl = user.photoURL || '';
  //   }
  // }

  // async saveSettings() {
  //   try {
  //     const user = this.auth.currentUser;
  //     if (!user) return;

  //     // Update profile
  //     await this.auth.updateProfile(user, {
  //       displayName: this.username,
  //       photoURL: this.profileUrl,
  //     });

  //     // Update password (if provided)
  //     if (this.password.trim()) {
  //       await this.auth.updatePassword(user, this.password);
  //     }

  //     console.log('✅ Settings updated successfully');
  //     this.closeMenu.emit();
  //   } catch (err) {
  //     console.error('⚠️ Error updating settings', err);
  //   }
  // }
}
