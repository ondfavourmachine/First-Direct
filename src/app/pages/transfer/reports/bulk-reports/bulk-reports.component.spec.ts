import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReportsComponent } from './bulk-reports.component';

describe('BulkReportsComponent', () => {
  let component: BulkReportsComponent;
  let fixture: ComponentFixture<BulkReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
