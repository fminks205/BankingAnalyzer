import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParseReportsDialog } from './parse-reports-dialog';

describe('ParseReportsDialog', () => {
  let component: ParseReportsDialog;
  let fixture: ComponentFixture<ParseReportsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParseReportsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParseReportsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
