import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkModalComponent } from './bulk-modal.component';

describe('BulkModalComponent', () => {
  let component: BulkModalComponent;
  let fixture: ComponentFixture<BulkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
