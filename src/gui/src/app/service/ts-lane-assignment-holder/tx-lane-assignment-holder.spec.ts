import { TestBed } from '@angular/core/testing';

import { BoardStateHolder } from './tx-lane-assignment-holder';

describe('TxLaneAssignmentHolder', () => {
  let service: BoardStateHolder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardStateHolder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
