import { Routes } from '@angular/router';
import { TransactionLanesPage } from './pages/transaction-lanes-page/transaction-lanes-page';

export const routes: Routes = [
	{ path: '', component: TransactionLanesPage },
	{ path: 'transaction-lanes', component: TransactionLanesPage },
];
