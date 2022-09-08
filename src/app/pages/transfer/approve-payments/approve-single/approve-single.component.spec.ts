import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSingleComponent } from './approve-single.component';

describe('ApproveSingleComponent', () => {
  let component: ApproveSingleComponent;
  let fixture: ComponentFixture<ApproveSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
