import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLanesDialog } from './add-lanes-dialog';

describe('AddLanesDialog', () => {
  let component: AddLanesDialog;
  let fixture: ComponentFixture<AddLanesDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLanesDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLanesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
