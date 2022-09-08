import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingConfirmationsComponent } from './pending-confirmations.component';

describe('PendingConfirmationsComponent', () => {
  let component: PendingConfirmationsComponent;
  let fixture: ComponentFixture<PendingConfirmationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingConfirmationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingConfirmationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
