import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtgsReportsComponent } from './rtgs-reports.component';

describe('RtgsReportsComponent', () => {
  let component: RtgsReportsComponent;
  let fixture: ComponentFixture<RtgsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtgsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtgsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
