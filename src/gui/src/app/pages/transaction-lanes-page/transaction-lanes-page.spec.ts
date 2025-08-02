import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionLanesPage } from './transaction-lanes-page';

describe('TransactionLanesPage', () => {
  let component: TransactionLanesPage;
  let fixture: ComponentFixture<TransactionLanesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionLanesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionLanesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
