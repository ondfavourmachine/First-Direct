import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OderPreviewComponent } from './oder-preview.component';

describe('OderPreviewComponent', () => {
  let component: OderPreviewComponent;
  let fixture: ComponentFixture<OderPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OderPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
