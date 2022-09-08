import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignReportsComponent } from './foreign-reports.component';

describe('ForeignReportsComponent', () => {
  let component: ForeignReportsComponent;
  let fixture: ComponentFixture<ForeignReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForeignReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
