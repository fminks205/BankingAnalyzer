import { Injectable, signal, WritableSignal } from '@angular/core';
import { Report } from '../../client/openapi';

@Injectable({
	providedIn: 'root'
})
export class TransactionLanesPageState {
	selectedReport$: WritableSignal<Report | undefined> = signal(undefined)

	uploadReportsDialogVisible: WritableSignal<boolean> = signal(false)
	processReportsDialogVisible: WritableSignal<boolean> = signal(false)
	newFilterDialogVisible: WritableSignal<boolean> = signal(false)
	newLaneDialogVisible: WritableSignal<boolean> = signal(false)
}
