import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOderComponent } from './create-oder.component';

describe('CreateOderComponent', () => {
  let component: CreateOderComponent;
  let fixture: ComponentFixture<CreateOderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
