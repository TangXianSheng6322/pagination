import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  @Input() open = false;
  @Output() closeMenu = new EventEmitter<void>();
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  view: 'main' | 'settings' = 'main';
  screenWidth = window.innerWidth;

  constructor(
    public auth: AuthService,
    private elementRef: ElementRef,
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  get isMobile() {
    return this.screenWidth < 768;
  }

  get isDropdown() {
    return this.screenWidth >= 768 && this.screenWidth < 1200;
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
}
