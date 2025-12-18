import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFiltersDialog } from './add-filters-dialog';

describe('AddFiltersDialog', () => {
  let component: AddFiltersDialog;
  let fixture: ComponentFixture<AddFiltersDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFiltersDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFiltersDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
