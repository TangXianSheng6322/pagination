import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockIconComponent } from './lock-icon.component';

describe('LockIconComponent', () => {
  let component: LockIconComponent;
  let fixture: ComponentFixture<LockIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
