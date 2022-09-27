import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceUploaderComponent } from './invoice-uploader.component';

describe('InvoiceUploaderComponent', () => {
  let component: InvoiceUploaderComponent;
  let fixture: ComponentFixture<InvoiceUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
