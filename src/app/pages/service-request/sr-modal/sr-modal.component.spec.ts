import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrModalComponent } from './sr-modal.component';

describe('SrModalComponent', () => {
  let component: SrModalComponent;
  let fixture: ComponentFixture<SrModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
