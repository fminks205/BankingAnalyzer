import { Component, effect, OnInit, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { TransactionCategoryDragDrop } from "../../components/transaction-category-drag-drop/transaction-category-drag-drop";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TxLaneAssignmentHolder } from '../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';
import { Report } from '../../client/openapi';
import { DashboardCreator } from '../../service/dashboard/dashboard-creator';
import { FilterHolder } from '../../service/filter-holder/filter-holder';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { MainWorkflowToolbar } from "../../components/main-workflow-toolbar/main-workflow-toolbar/main-workflow-toolbar";
import { UploadBankstatementDialog } from '../../components/dialog/upload-bankstatement/upload-bankstatement-dialog/upload-bankstatement-dialog';
import { ParseReportsDialog } from "../../components/dialog/parse-reports/parse-reports-dialog/parse-reports-dialog";
import { AddLanesDialog } from "../../components/dialog/add-lanes/add-lanes-dialog/add-lanes-dialog";
import { AddFiltersDialog } from "../../components/dialog/add-filters/add-filters-dialog/add-filters-dialog";



@Component({
	selector: 'app-transaction-lanes-page',
	imports: [
		CommonModule,
		DialogModule,
		ButtonModule,
		FileUploadModule,
		
		TransactionCategoryDragDrop,
		MainWorkflowToolbar,
		UploadBankstatementDialog,
		ParseReportsDialog,
		AddLanesDialog,
		AddFiltersDialog
	],
	templateUrl: './transaction-lanes-page.html',
	styleUrl: './transaction-lanes-page.scss',
	encapsulation: ViewEncapsulation.None
})
export class TransactionLanesPage implements OnInit{
	@ViewChild(TransactionCategoryDragDrop)
	reportDragDropLane!: TransactionCategoryDragDrop

	uploadReportsDialogVisible: WritableSignal<boolean> = signal(false)
	processReportsDialogVisible: WritableSignal<boolean> = signal(false)
	newFilterDialogVisible: WritableSignal<boolean> = signal(false)
	newLaneDialogVisible: WritableSignal<boolean> = signal(false)

	selectedReport: WritableSignal<Report | undefined> = signal(undefined)

	constructor(
		public assignmentsHolder: TxLaneAssignmentHolder,
		public dashboardCreator: DashboardCreator,
		public filterHolder: FilterHolder,
	){
	}

	ngOnInit(): void {
		this.assignmentsHolder.loadCompleteStateFromServer()
		this.filterHolder.loadFromServer()
	}

	setSelectedReport(report: Report){
		this.selectedReport.set(report)
		this.reportDragDropLane.reloadDragDropMenu()
	}
}
