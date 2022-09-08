import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignModalComponent } from './foreign-modal.component';

describe('ForeignModalComponent', () => {
  let component: ForeignModalComponent;
  let fixture: ComponentFixture<ForeignModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForeignModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
