import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWorkflowToolbar } from './main-workflow-toolbar';

describe('MainWorkflowToolbar', () => {
  let component: MainWorkflowToolbar;
  let fixture: ComponentFixture<MainWorkflowToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainWorkflowToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainWorkflowToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
