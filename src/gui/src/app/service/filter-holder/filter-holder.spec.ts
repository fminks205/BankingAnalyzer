import { TestBed } from '@angular/core/testing';

import { FilterHolder } from './filter-holder';

describe('FilterHolder', () => {
  let service: FilterHolder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterHolder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
