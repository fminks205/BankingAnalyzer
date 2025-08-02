import { TestBed } from '@angular/core/testing';

import { TransactionCategoryHolder } from './transaction-category-holder';

describe('TransactionCategoryHolder', () => {
  let service: TransactionCategoryHolder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionCategoryHolder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
