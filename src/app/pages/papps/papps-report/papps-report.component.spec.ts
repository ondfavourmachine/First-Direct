import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PappsReportComponent } from './papps-report.component';

describe('PappsReportComponent', () => {
  let component: PappsReportComponent;
  let fixture: ComponentFixture<PappsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PappsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PappsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
