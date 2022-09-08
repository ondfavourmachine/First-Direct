import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspenseReportsComponent } from './suspense-reports.component';

describe('SuspenseReportsComponent', () => {
  let component: SuspenseReportsComponent;
  let fixture: ComponentFixture<SuspenseReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspenseReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspenseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
