import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeftReportsComponent } from './neft-reports.component';

describe('NeftReportsComponent', () => {
  let component: NeftReportsComponent;
  let fixture: ComponentFixture<NeftReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeftReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeftReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
