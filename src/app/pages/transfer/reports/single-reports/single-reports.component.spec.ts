import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleReportsComponent } from './single-reports.component';

describe('SingleReportsComponent', () => {
  let component: SingleReportsComponent;
  let fixture: ComponentFixture<SingleReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
