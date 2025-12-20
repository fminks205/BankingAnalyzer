import { Component, effect, model, signal, WritableSignal } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { BoardStateHolder } from '../../../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';
import { ButtonModule } from 'primeng/button';

interface ParsingStatus{
	isLoading: boolean,
	toParse: number,
	parsed: number
}

@Component({
  selector: 'app-parse-reports-dialog',
  imports: [Dialog, ButtonModule],
  templateUrl: './parse-reports-dialog.html',
  styleUrl: './parse-reports-dialog.scss'
})
export class ParseReportsDialog {

	visible = model<boolean>()

  	parsingStatus$: WritableSignal<ParsingStatus> = signal({
		isLoading: false,
		toParse: 0,
		parsed: 0
	})

	constructor(
		public boardState: BoardStateHolder
	){
		this.wireParsingStatus()
		this.wireStartOnOpening()
	}

	wireStartOnOpening(){
		effect(()=>{
			let visible = this.visible()
			let status = this.parsingStatus$()
			if (visible == false) return
			if (status.isLoading == true) return
			this.boardState
				.loadReportsFromServer()
				.subscribe(()=>{
					this.parseRemainingFilesToCsv()
				})
			
		})
	}

	parseRemainingFilesToCsv(){
		this.parsingStatus$.set({
			isLoading: true,
			parsed: 0,
			toParse: this.boardState.pdfsInServer$().length - this.boardState.reports$().length
		})
	}

	wireParsingStatus(){
		effect(()=>{
			let status = this.parsingStatus$()
			if(status.isLoading == false) return
			if(status.toParse <= status.parsed){
				this.parsingStatus$.set({
					isLoading: false,
					parsed: 0,
					toParse: 0
				})
				return
			}
			this.boardState.requestToParseNextReport()
				.subscribe({
					next:()=>{
						console.info("Sucessfully parsed report to csv")
						this.boardState.loadReportsFromServer()
							.subscribe({
								next: ()=>{
									let oldStatus = this.parsingStatus$()
									let newStatus: ParsingStatus = {
										isLoading: true,
										toParse: oldStatus.toParse,
										parsed: oldStatus.parsed + 1
									}
									this.parsingStatus$.set(newStatus)
								}
							})
					},
					error: (err)=>{
						console.info(`Parsing reports to csv failed: ${JSON.stringify(err)}`)
					}
				})
			},
			{
				allowSignalWrites: true
			}
		)
	}
}
