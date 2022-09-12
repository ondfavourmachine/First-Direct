import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsModalWrapperComponent } from './details-modal-wrapper.component';

describe('DetailsModalWrapperComponent', () => {
  let component: DetailsModalWrapperComponent;
  let fixture: ComponentFixture<DetailsModalWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsModalWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
