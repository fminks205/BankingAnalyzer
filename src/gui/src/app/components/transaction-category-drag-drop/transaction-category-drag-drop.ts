import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, computed, Input, OnInit, QueryList, signal, Signal, ViewChildren } from '@angular/core';
import { Report } from '../../client/openapi/model/report';
import { Entry } from '../../client/openapi/model/entry';
import { Lane } from '../../client/openapi';
import { LaneHolder } from '../../service/lane-holder/lane-holder';

export interface DragDropLane{
	lane: Lane,
	entries: Entry[],
}

@Component({
  selector: 'app-transaction-category-drag-drop',
  imports: [
    CdkDrag, CdkDropList, CdkDropListGroup
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

	dragDropLanes$: Signal<DragDropLane[]> = signal([])

	constructor(
		public laneHolder: LaneHolder,
	){
		this.wireLanesToDropAreas()
	}

	ngOnInit(): void {
		this.todo = this.report.entries
	}

	wireLanesToDropAreas(){
		this.dragDropLanes$ = computed(()=>{
			let lanes = this.laneHolder.lanes$()
			let dragDropLanes = lanes
				.map(lane => {return {
					lane: lane,
					entries: []
				}})	
			return dragDropLanes
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
