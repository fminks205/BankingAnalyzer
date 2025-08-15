import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, effect, Input, OnInit, QueryList, signal, untracked, ViewChildren, WritableSignal } from '@angular/core';
import { Report } from '../../client/openapi/model/report';
import { Entry } from '../../client/openapi/model/entry';
import { Lane } from '../../client/openapi';
import { LaneHolder } from '../../service/lane-holder/lane-holder';
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
  
	unassignedTodos: Entry[] = [];

	dragDropLanes$: WritableSignal<DragDropLane[]> = signal([])

	constructor(
		public laneHolder: LaneHolder,
		public txLaneAssignmentsHolder: TxLaneAssignmentHolder,
	){
		this.wireLanesToDropAreas()
	}

	ngOnInit(): void {
		this.unassignedTodos = this.report.entries
	}

	onClickRemoveLane(laneToDelete: DragDropLane) {
		let filteredLanes = this.laneHolder.lanes$()
				.filter(lane => lane.id != laneToDelete.lane.id)
		this.laneHolder.lanes$.set(filteredLanes)
	}

	wireLanesToDropAreas(){
		effect(()=>{
			let newLanes = this.laneHolder.lanes$()
			let oldDroplanes = untracked(this.dragDropLanes$)

			// Elements from removed lanes get moved to unassigned to dos
			let newLaneIds = newLanes.map(lanes => lanes.id)
			let removedLanes = oldDroplanes
				.filter(oldDD => 
					newLaneIds
						.find(newLaneId => newLaneId == oldDD.lane.id)
						== undefined
				)
			for (let removedDDlane of removedLanes){
				this.unassignedTodos = this.unassignedTodos.concat(removedDDlane.entries)
				removedDDlane.entries = []
			}
			// Now all lanes to delete have been cleared

			let newDdLanes = newLanes
				.map(lane => {return {
					lane: lane,
					entries: []
				}})	
			this.dragDropLanes$.set(newDdLanes)
		})
	}

	drop(event: CdkDragDrop<Entry[]>, ddLane: DragDropLane | undefined) {

		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			if (
				event.item.data == undefined
				|| this.report == undefined
				|| this.report.month == undefined
				|| this.report.year == undefined
				|| ddLane == undefined
			) return

			const key: TxLaneAssignmentKey = {
				year: this.report.year,
				month: this.report.month,
				entryId: (event.item.data as Entry).id
			}
			if(ddLane.lane.id == undefined){
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
