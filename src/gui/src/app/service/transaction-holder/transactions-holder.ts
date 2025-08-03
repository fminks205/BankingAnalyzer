	import { Injectable, signal, WritableSignal } from '@angular/core';
	import { DefaultService, Report } from '../../client/openapi';
	
	@Injectable({
		providedIn: 'root'
	})
	export class TransactionsHolder{
		reports$: WritableSignal<Report[]> = signal([])

		constructor(
			private service: DefaultService
		) {
			this.fireRequest()
		}

		fireRequest(): void {
			console.debug(`Requesting reports from server`)
			this.service.getReports()
				.subscribe({
					next: (response)=>{
						console.debug(`Received ${response.length} reports from server`)
						this.reports$.set(response)
					}
				})
		}
		
	}
