import { Component } from '@angular/core';
import { TransactionsHolder } from '../../service/transaction-holder/transactions-holder';
import { TransactionCategoryDragDrop } from "../../components/transaction-category-drag-drop/transaction-category-drag-drop";

@Component({
	selector: 'app-transaction-lanes-page',
	imports: [TransactionCategoryDragDrop],
	templateUrl: './transaction-lanes-page.html',
	styleUrl: './transaction-lanes-page.scss'
})
export class TransactionLanesPage {
	constructor(
		public txHolder: TransactionsHolder
	){}
}
