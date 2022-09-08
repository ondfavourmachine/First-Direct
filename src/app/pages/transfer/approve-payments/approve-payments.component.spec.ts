import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePaymentsComponent } from './approve-payments.component';

describe('ApprovePaymentsComponent', () => {
  let component: ApprovePaymentsComponent;
  let fixture: ComponentFixture<ApprovePaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovePaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
