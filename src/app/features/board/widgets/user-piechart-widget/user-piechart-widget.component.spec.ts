import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPiechartWidgetComponent } from './user-piechart-widget.component';

describe('UserPiechartWidgetComponent', () => {
  let component: UserPiechartWidgetComponent;
  let fixture: ComponentFixture<UserPiechartWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPiechartWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPiechartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
