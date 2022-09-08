import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveBeneficiariesComponent } from './approve-beneficiaries.component';

describe('ApproveBeneficiariesComponent', () => {
  let component: ApproveBeneficiariesComponent;
  let fixture: ComponentFixture<ApproveBeneficiariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveBeneficiariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
