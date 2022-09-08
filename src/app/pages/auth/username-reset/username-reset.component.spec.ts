import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameResetComponent } from './username-reset.component';

describe('UsernameResetComponent', () => {
  let component: UsernameResetComponent;
  let fixture: ComponentFixture<UsernameResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
