import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTabsComponent } from './table-tabs.component';

describe('TableTabsComponent', () => {
  let component: TableTabsComponent;
  let fixture: ComponentFixture<TableTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
