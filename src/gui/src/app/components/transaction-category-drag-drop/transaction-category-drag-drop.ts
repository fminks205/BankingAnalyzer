import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, effect, Input, OnInit, QueryList, signal, untracked, ViewChildren, WritableSignal } from '@angular/core';
import { Report } from '../../client/openapi/model/report';
import { Entry } from '../../client/openapi/model/entry';
import { Lane } from '../../client/openapi';
import { LaneHolder } from '../../service/lane-holder/lane-holder';
import { ButtonDirective } from "primeng/button";

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
  
	todo: Entry[] = [];

	dragDropLanes$: WritableSignal<DragDropLane[]> = signal([])

	constructor(
		public laneHolder: LaneHolder,
	){
		this.wireLanesToDropAreas()
	}

	ngOnInit(): void {
		this.todo = this.report.entries
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
				this.todo = this.todo.concat(removedDDlane.entries)
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

	drop(event: CdkDragDrop<Entry[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
		}
	}
}
