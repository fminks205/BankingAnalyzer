import { Component, computed, signal, Signal } from '@angular/core';
import { TransactionsHolder } from '../../service/transactions-holder';

@Component({
	selector: 'app-transaction-lanes-page',
	imports: [],
	templateUrl: './transaction-lanes-page.html',
	styleUrl: './transaction-lanes-page.scss'
})
export class TransactionLanesPage {
	text$: Signal<string> = signal("")
	constructor(
		private txHolder: TransactionsHolder
	){
		this.wireTransactions()
	}

	wireTransactions(){
		this.text$ = computed(()=>{
			let reports = this.txHolder.reports$()
			return JSON.stringify(reports)
		})
	}
}
