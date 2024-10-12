import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { initalGuard } from './inital.guard';

describe('initalGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => initalGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
