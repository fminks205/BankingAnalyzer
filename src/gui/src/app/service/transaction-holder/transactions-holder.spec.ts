import { TestBed } from '@angular/core/testing';

import { TransactionsHolder } from './transactions-holder';

describe('TransactionsHolder', () => {
  let service: TransactionsHolder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsHolder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
