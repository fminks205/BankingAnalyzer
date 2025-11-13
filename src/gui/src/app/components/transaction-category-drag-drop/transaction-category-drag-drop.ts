import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, effect, Input, OnInit, QueryList, signal, untracked, ViewChildren, WritableSignal } from '@angular/core';
import { Report } from '../../client/openapi/model/report';
import { Entry } from '../../client/openapi/model/entry';
import { Lane, LaneEntryAssignment } from '../../client/openapi';
import { ButtonDirective } from "primeng/button";
import { TxLaneAssignmentHolder, TxLaneAssignmentKey } from '../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';

export interface DragDropLane{
	lane: Lane,
	entries: Entry[],
}

@Component({
	selector: 'app-transaction-category-drag-drop',
	imports: [
		CdkDrag, 
		CdkDropList, 
		CdkDropListGroup,
		ButtonDirective
	],
	templateUrl: './transaction-category-drag-drop.html',
	styleUrl: './transaction-category-drag-drop.scss'
})
export class TransactionCategoryDragDrop implements OnInit{

	@Input()
	report!: Report

	@ViewChildren(CdkDropList)
	dropLists!: QueryList<CdkDropList>
  
	allEntries: Entry[] = [];

	readonly unassignedLane: Lane = {
		description: "",
		id: -1,
		name: "Nicht zugewiesen"
	}

	dragDropLanes$: WritableSignal<DragDropLane[]> = signal([])

	constructor(
		public txLaneAssignmentsHolder: TxLaneAssignmentHolder,
	){
	}

	ngOnInit(): void {
		this.loadReportLanes()
	}

	onClickRemoveLane(laneToDelete: DragDropLane) {
		this.txLaneAssignmentsHolder.deleteLane(laneToDelete.lane.id)
		this.loadReportLanes()
	}

	loadReportLanes(report?: Report){
		if(report != undefined){
			this.report = report
		}
		console.log(`Recalculating view for report ${this.report.month}/${this.report.year}`)
		this.allEntries = [...this.report.entries]
		let lanesInView = [this.unassignedLane].concat(this.txLaneAssignmentsHolder.getLanes())
		let assignments = this.txLaneAssignmentsHolder.getAllAssignmentsAsArray()
			.filter(assignment => {
				return assignment.year == this.report.year
					&& assignment.month == this.report.month
			})

		this.fromEntitiesSetViewState(
			this.report.entries,
			lanesInView,
			assignments
		)
	}

	fromEntitiesSetViewState(entries: Entry[], lanes: Lane[], assignments: LaneEntryAssignment[]){
		this.allEntries = [...entries];
		let entriesToPutInView = [...entries]

		let ddlanes = lanes.map((lane):DragDropLane=>{
			return {
				lane: lane,
				entries: []
			}
		})

		// Put all assigned entries into their respective drag drop lane
		for(let assignment of assignments){
			if (assignment.lane == null) continue;

			let targetLane = ddlanes.find(dl => dl.lane.id == assignment.lane)
			if(targetLane == undefined) continue 

			let index = entriesToPutInView.findIndex(u => u.id == assignment.entry)
			let [elementToMove] = entriesToPutInView.splice(index, 1)
			targetLane.entries.push(elementToMove)
		}
		// Put the rest into the unassigned lane
		let laneForUnassignedElements = ddlanes.find(dl => dl.lane.id == this.unassignedLane.id)
		if(laneForUnassignedElements == undefined) {
			console.error(`Drag drop lane for unassigned report entries not found`)
			return
		}
		laneForUnassignedElements.entries = laneForUnassignedElements.entries.concat(entriesToPutInView)

		this.dragDropLanes$.set(ddlanes)
	}

	drop(event: CdkDragDrop<Entry[]>, ddLane: DragDropLane | undefined) {
		console.debug(`DropEvent: ${event.previousContainer.id} -> ${ddLane?.lane.name ?? "no id"}`)
		if (event.previousContainer === event.container) {
			console.debug(`Moving objec around inside container`)
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			if (event.item.data == undefined) {
				console.error(`DragDrop event data invalid, cannot set new assignment: ${event.item.data}`)
				return
			}
			if (this.report == undefined
				|| this.report.month == undefined
				|| this.report.year == undefined
			) {
				console.error(`Report invalid, cannot set new assignment: ${this.report}`)
				return
			}

			const key: TxLaneAssignmentKey = {
				year: this.report.year,
				month: this.report.month,
				entryId: (event.item.data as Entry).id
			}
			if(ddLane == undefined || ddLane.lane.id == this.unassignedLane.id){
				console.debug(`Deleting assignment: ${key.entryId}-${key.year}-${key.month}`)
				this.txLaneAssignmentsHolder.deleteAssignment(key)
			} else {
				console.debug(`Setting assignment: ${key.entryId}-${key.year}-${key.month}:${ddLane.lane.id}`)
				this.txLaneAssignmentsHolder.setAssignment(
					key, 
					ddLane.lane.id
				)
			}
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
		}
	}
}
