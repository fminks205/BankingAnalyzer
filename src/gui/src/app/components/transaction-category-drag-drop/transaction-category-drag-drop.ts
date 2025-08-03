import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Report } from '../../client/openapi/model/report';
import { Entry } from '../../client/openapi/model/entry';
import { Lane } from '../../client/openapi';

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

	@Input()
	inputLanes!: Lane[]

	@ViewChildren(CdkDropList)
	dropLists!: QueryList<CdkDropList>
  
	todo: Entry[] = [];

	dragDropLanes: DragDropLane[] = []

	ngOnInit(): void {
		this.todo = this.report.entries
		this.dragDropLanes = this.inputLanes
			.map(lane => {return {
				lane: lane,
				entries: []
			}})	
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
