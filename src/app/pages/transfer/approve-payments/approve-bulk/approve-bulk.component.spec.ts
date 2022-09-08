import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveBulkComponent } from './approve-bulk.component';

describe('ApproveBulkComponent', () => {
  let component: ApproveBulkComponent;
  let fixture: ComponentFixture<ApproveBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
