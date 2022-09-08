import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBeneficiariesComponent } from './view-beneficiaries.component';

describe('ViewBeneficiariesComponent', () => {
  let component: ViewBeneficiariesComponent;
  let fixture: ComponentFixture<ViewBeneficiariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBeneficiariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
