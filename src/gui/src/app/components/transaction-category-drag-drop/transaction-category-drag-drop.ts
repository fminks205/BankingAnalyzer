import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, effect, input, Input, OnInit, QueryList, signal, untracked, ViewChildren, WritableSignal } from '@angular/core';
import { Report } from '../../client/openapi/model/report';
import { Entry } from '../../client/openapi/model/entry';
import { Lane, LaneEntryAssignment } from '../../client/openapi';
import { ButtonDirective } from "primeng/button";
import { BoardStateHolder, TxLaneAssignmentKey } from '../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';

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
	report = input<Report | undefined>()

	@ViewChildren(CdkDropList)
	dropLists!: QueryList<CdkDropList>
  
	allEntries: Entry[] = [];

	readonly unassignedLane: Lane = {
		description: "",
		id: -1,
		name: "Not assigned"
	}

	dragDropLanes$: WritableSignal<DragDropLane[]> = signal([])

	constructor(
		public boardState: BoardStateHolder,
	){
		effect(()=>{
			// DragDrop loads new lanes as reaction to changed state
			let lanes = this.boardState.lanes$()
			this.reloadDragDropMenu()
		})
	}

	ngOnInit(): void {
		this.reloadDragDropMenu()
	}

	onClickRemoveLane(laneToDelete: DragDropLane) {
		this.boardState.deleteLane(laneToDelete.lane.id)
		this.reloadDragDropMenu()
	}

	reloadDragDropMenu(){
		let report = this.report()
		if(report == undefined){
			console.warn("Tried to load lanes for an undefined report")
			return
		}
		console.log(`Recalculating view for report ${report.month}/${report.year}`)
		this.allEntries = [...report.entries]
		let lanesInView = [this.unassignedLane].concat(this.boardState.lanes$())
		let assignments = this.boardState.getAllAssignmentsAsArray()
			.filter(assignment => {
				return assignment.year == report.year
					&& assignment.month == report.month
			})

		this.fromEntitiesSetViewState(
			report.entries,
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
		let report = this.report()
		if (event.previousContainer === event.container) {
			console.debug(`Moving objec around inside container`)
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			if (event.item.data == undefined) {
				console.error(`DragDrop event data invalid, cannot set new assignment: ${event.item.data}`)
				return
			}
			if (report == undefined
				|| report.month == undefined
				|| report.year == undefined
			) {
				console.error(`Report invalid, cannot set new assignment: ${this.report}`)
				return
			}

			const key: TxLaneAssignmentKey = {
				year: report.year,
				month: report.month,
				entryId: (event.item.data as Entry).id
			}
			if(ddLane == undefined || ddLane.lane.id == this.unassignedLane.id){
				console.debug(`Deleting assignment: ${key.entryId}-${key.year}-${key.month}`)
				this.boardState.deleteAssignment(key)
			} else {
				console.debug(`Setting assignment: ${key.entryId}-${key.year}-${key.month}:${ddLane.lane.id}`)
				this.boardState.setAssignment(
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
