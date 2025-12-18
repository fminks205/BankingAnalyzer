import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBankstatementDialog } from './upload-bankstatement-dialog';

describe('UploadBankstatementDialog', () => {
  let component: UploadBankstatementDialog;
  let fixture: ComponentFixture<UploadBankstatementDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBankstatementDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBankstatementDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
