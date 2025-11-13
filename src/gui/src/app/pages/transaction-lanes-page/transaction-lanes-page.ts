import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TransactionCategoryDragDrop } from "../../components/transaction-category-drag-drop/transaction-category-drag-drop";
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Toolbar } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { TxLaneAssignmentHolder } from '../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';
import { Report } from '../../client/openapi';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";
import { DashboardCreator } from '../../service/dashboard/dashboard-creator';

@Component({
	selector: 'app-transaction-lanes-page',
	imports: [
    TransactionCategoryDragDrop,
    DialogModule,
    ButtonModule,
    FloatLabel,
    InputTextModule,
    FormsModule,
    Toolbar,
    CdkDragPlaceholder
],
	templateUrl: './transaction-lanes-page.html',
	styleUrl: './transaction-lanes-page.scss',
	encapsulation: ViewEncapsulation.None
})
export class TransactionLanesPage implements OnInit{
	@ViewChild(TransactionCategoryDragDrop)
	reportDragDropLane!: TransactionCategoryDragDrop

	newLaneDialogVisible = false;
	newLaneName = ""
	newLaneDescription = ""

	selectedReport: Report | undefined = undefined

	constructor(
		public assignmentsHolder: TxLaneAssignmentHolder,
		public dashboardCreator: DashboardCreator
	){}

	setSelectedReport(report: Report){
		this.selectedReport = report
		this.reportDragDropLane.loadReportLanes(report)
	}


	ngOnInit(): void {
		this.assignmentsHolder.loadCompleteStateFromServer()
	}

	openNewLaneDialogClick(){
		this.newLaneDialogVisible = true
	}

	createDashboardClick(){
		this.dashboardCreator.createDashboard()
	}

	onClickSave(){
		this.assignmentsHolder.saveState()
	}

	onClickAddLane(name: string, description: string){
		this.assignmentsHolder.addLane(name, description)
		this.reportDragDropLane.loadReportLanes()
	}
}
