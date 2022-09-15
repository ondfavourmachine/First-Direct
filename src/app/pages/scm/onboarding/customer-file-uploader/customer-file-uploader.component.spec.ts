import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFileUploaderComponent } from './customer-file-uploader.component';

describe('CustomerFileUploaderComponent', () => {
  let component: CustomerFileUploaderComponent;
  let fixture: ComponentFixture<CustomerFileUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFileUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
