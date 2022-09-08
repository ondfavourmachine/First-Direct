import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePappsComponent } from './approve-papps.component';

describe('ApprovePappsComponent', () => {
  let component: ApprovePappsComponent;
  let fixture: ComponentFixture<ApprovePappsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovePappsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePappsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
