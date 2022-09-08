import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateAccountReportsComponent } from './account-reports.component';

describe('AccountReportsComponent', () => {
  let component: CorporateAccountReportsComponent;
  let fixture: ComponentFixture<CorporateAccountReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateAccountReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateAccountReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
