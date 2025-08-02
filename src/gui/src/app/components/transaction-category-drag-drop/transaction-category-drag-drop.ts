import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Report } from '../../client/openapi/model/report';
import { Entry } from '../../client/openapi/model/entry';

export interface Lane{
	name: string,
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
	laneNames: string[] = ["Lebensmittel", "Laufende Kosten", "Hobby"]

	@ViewChildren(CdkDropList)
	dropLists!: QueryList<CdkDropList>
  
	todo: Entry[] = [];

	lanes: Lane[] = []

	ngOnInit(): void {
		this.todo = this.report.entries
		this.lanes = this.laneNames
			.map(name => {return {
				name: name,
				entries: [],
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
