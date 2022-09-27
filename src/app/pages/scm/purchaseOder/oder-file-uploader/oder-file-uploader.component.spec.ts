import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OderFileUploaderComponent } from './oder-file-uploader.component';

describe('OderFileUploaderComponent', () => {
  let component: OderFileUploaderComponent;
  let fixture: ComponentFixture<OderFileUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OderFileUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OderFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
