import { Component } from '@angular/core';
import { TransactionsHolder } from '../../service/transaction-holder/transactions-holder';
import { TransactionCategoryDragDrop } from "../../components/transaction-category-drag-drop/transaction-category-drag-drop";
import { LaneHolder } from '../../service/lane-holder/lane-holder';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-transaction-lanes-page',
	imports: [
		TransactionCategoryDragDrop,
		DialogModule,
		ButtonModule,
	],
	templateUrl: './transaction-lanes-page.html',
	styleUrl: './transaction-lanes-page.scss'
})
export class TransactionLanesPage {
visible: any;
	constructor(
		public txHolder: TransactionsHolder,
		public laneHolder: LaneHolder,
	){}

	newLaneDialogVisible = false;

	openNewLaneDialogClick(){
		console.log("Open dialog")
		this.newLaneDialogVisible = true
	}
}
