import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { FloatLabel } from "primeng/floatlabel";
import { Select } from "primeng/select";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterHolder } from '../../../../service/filter-holder/filter-holder';
import { Report } from '../../../../client/openapi';
import { TxLaneAssignmentHolder } from '../../../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';
import { InputTextModule } from 'primeng/inputtext';

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
	report$ = input<Report | undefined>(undefined)

	@Output()
	appliedFilter = new EventEmitter<void>()


	constructor(
		public filterHolder: FilterHolder,
		public assignmentsHolder: TxLaneAssignmentHolder,
	){
	}

	newFilter() {
		this.filterHolder.addFilter({subject_substring: '', lane_id: -1});
	}

	applyAllFilters() {
		this.filterHolder.filters$()
			.forEach((_, i)=>{
				this.applyFilter(i)
			})
	}

	applyFilter(idx: number) {
		let filterToApply = this.filterHolder.filters$().at(idx)
		let report = this.report$()
		if(filterToApply == undefined){
			console.error(`Filter no. ${idx} not found`)
			return
		}
		if (report == undefined || report.year == null || report.month == null){
			console.error(`Cannot apply filter because seleted report is undefined`)
			return
		}

		for (let entry of report.entries){
			if(entry.subject == null) continue;
			if(entry.subject.match(filterToApply.subject_substring) != null){
				this.assignmentsHolder.setAssignment(
					{
						year: report.year,
						month: report.month,
						entryId: entry.id
					},
					filterToApply.lane_id
				)
			}
		}
		this.appliedFilter.emit()
	}
}
