import { TestBed } from '@angular/core/testing';

import { LaneHolder } from './lane-holder';

describe('LaneHolder', () => {
  let service: LaneHolder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaneHolder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
