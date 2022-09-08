import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementInstructionComponent } from './settlement-instruction.component';

describe('SettlementInstructionComponent', () => {
  let component: SettlementInstructionComponent;
  let fixture: ComponentFixture<SettlementInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
