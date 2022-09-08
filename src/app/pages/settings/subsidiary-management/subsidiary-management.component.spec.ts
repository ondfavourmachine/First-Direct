import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiaryManagementComponent } from './subsidiary-management.component';

describe('SubsidiaryManagementComponent', () => {
  let component: SubsidiaryManagementComponent;
  let fixture: ComponentFixture<SubsidiaryManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiaryManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiaryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
