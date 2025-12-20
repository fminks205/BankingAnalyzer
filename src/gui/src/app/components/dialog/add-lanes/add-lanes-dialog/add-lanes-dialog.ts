import { Component, EventEmitter, model, Output } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { FloatLabel } from "primeng/floatlabel";
import { ButtonModule } from "primeng/button";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardStateHolder } from '../../../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';
import { InputTextModule } from 'primeng/inputtext';

@Component({
	selector: 'app-add-lanes-dialog',
	imports: [
		Dialog, 
		FloatLabel, 
		ButtonModule,
		CommonModule,
		FormsModule,
		FloatLabel,
    	InputTextModule,
	],
	templateUrl: './add-lanes-dialog.html',
	styleUrl: './add-lanes-dialog.scss'
})
export class AddLanesDialog {
	visible = model(false)

	newLaneName = ""
	newLaneDescription = ""

	constructor(
		public boadState: BoardStateHolder
	){

	}

	onClickAddLane(name: string, description: string){
		this.boadState.addLane(name, description)
	}
}