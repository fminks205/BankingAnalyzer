import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from "primeng/toolbar";

@Component({
  selector: 'app-main-workflow-toolbar',
  imports: [
    Toolbar,
    ButtonModule,
  ],
  templateUrl: './main-workflow-toolbar.html',
  styleUrl: './main-workflow-toolbar.scss'
})
export class MainWorkflowToolbar {

  // Event Emitters for each button click
  @Output() onUploadReportsClick = new EventEmitter<void>();
  @Output() onProcessReportsClick = new EventEmitter<void>();
  @Output() onAddLaneClick = new EventEmitter<void>();
  @Output() onFiltersClick = new EventEmitter<void>();
  @Output() onSaveAssignmentsClick = new EventEmitter<void>();
  @Output() onCreateDashboardClick = new EventEmitter<void>();

  // Methods for each button that emit events
  openUploadReportsDialogClick(): void {
    this.onUploadReportsClick.emit();
  }

  openProcessReportsDialogClick(): void {
    this.onProcessReportsClick.emit();
  }

  openNewLaneDialogClick(): void {
    this.onAddLaneClick.emit();
  }

  openFiltersDialogClick(): void {
    this.onFiltersClick.emit();
  }

  onClickSave(): void {
    this.onSaveAssignmentsClick.emit();
  }

  createDashboardClick(): void {
    this.onCreateDashboardClick.emit();
  }
}
