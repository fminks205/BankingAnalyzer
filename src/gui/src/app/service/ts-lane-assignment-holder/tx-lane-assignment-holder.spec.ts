import { TestBed } from '@angular/core/testing';

import { TxLaneAssignmentHolder } from './tx-lane-assignment-holder';

describe('TxLaneAssignmentHolder', () => {
  let service: TxLaneAssignmentHolder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TxLaneAssignmentHolder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
