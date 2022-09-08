import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveForeignComponent } from './approve-foreign.component';

describe('ApproveForeignComponent', () => {
  let component: ApproveForeignComponent;
  let fixture: ComponentFixture<ApproveForeignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveForeignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveForeignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
