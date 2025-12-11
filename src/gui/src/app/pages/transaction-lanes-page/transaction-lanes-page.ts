import { Component, effect, OnInit, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { TransactionCategoryDragDrop } from "../../components/transaction-category-drag-drop/transaction-category-drag-drop";
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Toolbar } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { TxLaneAssignmentHolder } from '../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';
import { Report } from '../../client/openapi';
import { Select } from 'primeng/select';
import { DashboardCreator } from '../../service/dashboard/dashboard-creator';
import { FilterHolder } from '../../service/filter-holder/filter-holder';
import { Workflow } from '../../service/workflow/workflow';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-transaction-lanes-page',
	imports: [
		CommonModule,
		TransactionCategoryDragDrop,
		DialogModule,
		ButtonModule,
		FloatLabel,
		InputTextModule,
		Select,
		FormsModule,
		Toolbar,
		FileUploadModule,
	],
	templateUrl: './transaction-lanes-page.html',
	styleUrl: './transaction-lanes-page.scss',
	encapsulation: ViewEncapsulation.None
})
export class TransactionLanesPage implements OnInit{
	@ViewChild(TransactionCategoryDragDrop)
	reportDragDropLane!: TransactionCategoryDragDrop

	@ViewChild('pdfUpload') 
	pdfUpload!: FileUpload;

	uploadReportsDialogVisible = false
	fileNamesSavedInServer: WritableSignal<string[]> = signal([])

	processReportsDialogVisible = false

	newFilterDialogVisible = false;
	categoryOptions = [
		{ name: 'Category A', id: 1 },
		{ name: 'Category B', id: 2 },
		{ name: 'Category C', id: 3 }
	];

	newLaneDialogVisible = false;
	newLaneName = ""
	newLaneDescription = ""

	selectedReport: Report | undefined = undefined

	constructor(
		public assignmentsHolder: TxLaneAssignmentHolder,
		public dashboardCreator: DashboardCreator,
		public filterHolder: FilterHolder,
		public workflowService: Workflow
	){
		effect(()=>{
			this.categoryOptions = this.assignmentsHolder.lanes$()
		})
	}

	ngOnInit(): void {
		this.assignmentsHolder.loadCompleteStateFromServer()
		this.filterHolder.loadFromServer()
		this.loadPdfsUploaded()
	}

	loadPdfsUploaded(){
		this.workflowService.listUploadedFiles()
			.subscribe({
				next: (res)=>{
					console.debug(`Received ${res.length} file names from server`)
					this.fileNamesSavedInServer.set(res)
				}
			})
	}

	onPdfUpload(event: any) {
		const files: File[] = event.files;

		this.workflowService.uploadFiles(files)
			.subscribe({
				next: ()=>{
					this.pdfUpload.clear()
					console.log("Done uploading pdfs")
					this.loadPdfsUploaded()
				}
			})
	}


	applyFilter(idx: number) {
		let filterToApply = this.filterHolder.filters$().at(idx)
		if(filterToApply == undefined){
			console.error(`Filter no. ${idx} not found`)
			return
		}
		if (this.selectedReport == undefined || this.selectedReport.year == null || this.selectedReport.month == null){
			console.error(`Cannot apply filter because seleted report is undefined`)
			return
		}

		for (let entry of this.selectedReport.entries){
			if(entry.subject == null) continue;
			if(entry.subject.match(filterToApply.subject_substring) != null){
				this.assignmentsHolder.setAssignment(
					{
						year: this.selectedReport.year,
						month: this.selectedReport.month,
						entryId: entry.id
					},
					filterToApply.lane_id
				)
			}
		}

		this.reportDragDropLane.loadReportLanes()
	}

	applyAllFilters() {
		this.filterHolder.filters$()
			.forEach((filter, i)=>{
				this.applyFilter(i)
			})
	}

	newFilter() {
		this.filterHolder.addFilter({subject_substring: '', lane_id: -1});
	}

	setSelectedReport(report: Report){
		this.selectedReport = report
		this.reportDragDropLane.loadReportLanes(report)
	}

	openUploadReportsDialogClick(){
		this.uploadReportsDialogVisible = true
	}

	openProcessReportsDialogClick(){
		this.processReportsDialogVisible = true
	}

	openNewLaneDialogClick(){
		this.newLaneDialogVisible = true
	}

	openFiltersDialogClick(){
		this.newFilterDialogVisible = true
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
