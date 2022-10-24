import { TestBed } from '@angular/core/testing';

import { LposService } from './lpos.service';

describe('LposService', () => {
  let service: LposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
