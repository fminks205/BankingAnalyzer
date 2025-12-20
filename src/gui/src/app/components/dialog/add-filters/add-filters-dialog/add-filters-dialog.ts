import { Component, EventEmitter, model, Output } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { FloatLabel } from "primeng/floatlabel";
import { Select } from "primeng/select";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardStateHolder } from '../../../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';
import { InputTextModule } from 'primeng/inputtext';
import { TransactionLanesPageState } from '../../../../pages/transaction-lanes-page/transaction-lanes-page-state';

@Component({
	selector: 'app-add-filters-dialog',
	imports: [
		Dialog, 
		ButtonModule, 
		FloatLabel, 
		Select,
		FormsModule,
		CommonModule,
		InputTextModule,
	],
	templateUrl: './add-filters-dialog.html',
	styleUrl: './add-filters-dialog.scss'
})
export class AddFiltersDialog {
	visible = model(false)

	@Output()
	appliedFilter = new EventEmitter<void>()


	constructor(
		public pageState: TransactionLanesPageState,
		public boardState: BoardStateHolder,
	){
	}

	newFilter() {
		this.boardState.addFilter({subject_substring: '', lane_id: -1});
	}

	applyAllFiltersToMonthClicked(){
		let report = this.pageState.selectedReport$()
		if (report == undefined) return
		this.boardState.applyAllFiltersToReport(report)
		this.appliedFilter.emit()
	}

	applyAllFiltersToAllClicked(){
		let report = this.pageState.selectedReport$()
		if (report == undefined) return
		this.boardState.applyAllFiltersToAll()
		this.appliedFilter.emit()
	}

	applyFilterClicked(i: number){
		let filter = this.boardState.filters$()[i]
		let report = this.pageState.selectedReport$()
		if (filter == undefined || report == undefined) return
		this.boardState.applyFilter(filter, report)
		this.appliedFilter.emit()
	}

	deleteFilterClicked(i: number){
		this.boardState.removeFilter(i)
	}

	saveClicked(){
		this.boardState.saveFilters()
	}
}
