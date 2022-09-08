import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PappsComponent } from './papps.component';

describe('PappsComponent', () => {
  let component: PappsComponent;
  let fixture: ComponentFixture<PappsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PappsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PappsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
