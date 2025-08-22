import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDeleteUserPopupComponent } from './bulk-delete-user-popup.component';

describe('BulkDeleteUserPopupComponent', () => {
  let component: BulkDeleteUserPopupComponent;
  let fixture: ComponentFixture<BulkDeleteUserPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkDeleteUserPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkDeleteUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
