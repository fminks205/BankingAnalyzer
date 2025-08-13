import { Component, ViewEncapsulation } from '@angular/core';
import { TransactionsHolder } from '../../service/transaction-holder/transactions-holder';
import { TransactionCategoryDragDrop } from "../../components/transaction-category-drag-drop/transaction-category-drag-drop";
import { LaneHolder } from '../../service/lane-holder/lane-holder';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-transaction-lanes-page',
	imports: [
		TransactionCategoryDragDrop,
		DialogModule,
		ButtonModule,
		FloatLabel,
		InputTextModule,
		FormsModule,
	],
	templateUrl: './transaction-lanes-page.html',
	styleUrl: './transaction-lanes-page.scss',
	encapsulation: ViewEncapsulation.None
})
export class TransactionLanesPage {
	constructor(
		public txHolder: TransactionsHolder,
		public laneHolder: LaneHolder,
	){}

	newLaneDialogVisible = false;
	newLaneName = ""
	newLaneDescription = ""

	openNewLaneDialogClick(){
		console.log("Open dialog")
		this.newLaneDialogVisible = true
	}

	addLane(name: string, description: string){
		let lanes = this.laneHolder.lanes$();

		for(let lane of lanes){
			if (lane.name == name){
				console.error(`Lane name ${name} is already taken`)
				return
			}
		}

		const takenIds = lanes.map(lane => lane.id);
		let newId = 1;
		while (takenIds.includes(newId)) {
			newId++;
		}

		let newLane = {
			id: newId,
			name: name,
			description: description
		}

		this.laneHolder.lanes$.set([...lanes, newLane])

		console.info(`New lane pushed: ${newLane.name}`)
	}
}
