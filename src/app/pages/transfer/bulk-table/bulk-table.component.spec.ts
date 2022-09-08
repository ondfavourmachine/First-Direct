import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkTableComponent } from './bulk-table.component';

describe('BulkTableComponent', () => {
  let component: BulkTableComponent;
  let fixture: ComponentFixture<BulkTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
