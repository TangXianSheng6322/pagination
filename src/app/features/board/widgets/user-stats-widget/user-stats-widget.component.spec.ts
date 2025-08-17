import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatsWidgetComponent } from './user-stats-widget.component';

describe('UserStatsWidgetComponent', () => {
  let component: UserStatsWidgetComponent;
  let fixture: ComponentFixture<UserStatsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStatsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStatsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
