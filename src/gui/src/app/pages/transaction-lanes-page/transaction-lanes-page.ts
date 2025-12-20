import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TransactionCategoryDragDrop } from "../../components/transaction-category-drag-drop/transaction-category-drag-drop";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BoardStateHolder } from '../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';
import { Report } from '../../client/openapi';
import { DashboardCreator } from '../../service/dashboard/dashboard-creator';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { MainWorkflowToolbar } from "../../components/main-workflow-toolbar/main-workflow-toolbar/main-workflow-toolbar";
import { UploadBankstatementDialog } from '../../components/dialog/upload-bankstatement/upload-bankstatement-dialog/upload-bankstatement-dialog';
import { ParseReportsDialog } from "../../components/dialog/parse-reports/parse-reports-dialog/parse-reports-dialog";
import { AddLanesDialog } from "../../components/dialog/add-lanes/add-lanes-dialog/add-lanes-dialog";
import { AddFiltersDialog } from "../../components/dialog/add-filters/add-filters-dialog/add-filters-dialog";
import { TransactionLanesPageState } from './transaction-lanes-page-state';



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

	constructor(
		public assignmentsHolder: BoardStateHolder,
		public dashboardCreator: DashboardCreator,
		public state: TransactionLanesPageState
	){
	}

	ngOnInit(): void {
		this.assignmentsHolder.loadCompleteStateFromServer()
		this.assignmentsHolder.loadFiltersFromServer()
	}

	setSelectedReport(report: Report){
		this.state.selectedReport$.set(report)
		this.reportDragDropLane.reloadDragDropMenu()
	}
}
