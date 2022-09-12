import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenteredModalWrapperComponent } from './centered-modal-wrapper.component';

describe('CenteredModalWrapperComponent', () => {
  let component: CenteredModalWrapperComponent;
  let fixture: ComponentFixture<CenteredModalWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenteredModalWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenteredModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
