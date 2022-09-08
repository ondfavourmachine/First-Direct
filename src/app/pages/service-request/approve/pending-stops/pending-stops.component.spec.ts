import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStopsComponent } from './pending-stops.component';

describe('PendingStopsComponent', () => {
  let component: PendingStopsComponent;
  let fixture: ComponentFixture<PendingStopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingStopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingStopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
