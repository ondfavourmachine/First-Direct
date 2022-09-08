import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchReportsComponent } from './batch-reports.component';

describe('BatchReportsComponent', () => {
  let component: BatchReportsComponent;
  let fixture: ComponentFixture<BatchReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
