import { TestBed } from '@angular/core/testing';

import { DashboardCreator } from './dashboard-creator';

describe('DashboardCreator', () => {
  let service: DashboardCreator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardCreator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
