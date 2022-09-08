import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiaryTransactionReportComponent } from './subsidiary-transaction-report.component';

describe('SubsidiaryTransactionReportComponent', () => {
  let component: SubsidiaryTransactionReportComponent;
  let fixture: ComponentFixture<SubsidiaryTransactionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiaryTransactionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiaryTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
