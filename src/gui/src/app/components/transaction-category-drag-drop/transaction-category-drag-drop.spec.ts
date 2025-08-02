import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCategoryDragDrop } from './transaction-category-drag-drop';

describe('TransactionCategoryDragDrop', () => {
  let component: TransactionCategoryDragDrop;
  let fixture: ComponentFixture<TransactionCategoryDragDrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCategoryDragDrop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionCategoryDragDrop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
