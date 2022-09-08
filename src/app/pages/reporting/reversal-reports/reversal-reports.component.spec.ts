import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReversalReportsComponent } from './reversal-reports.component';

describe('ReversalReportsComponent', () => {
  let component: ReversalReportsComponent;
  let fixture: ComponentFixture<ReversalReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReversalReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReversalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
