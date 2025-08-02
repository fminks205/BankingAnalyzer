	import { Inject, Injectable, OnInit, signal, WritableSignal } from '@angular/core';
	import { BASE_PATH, DefaultService, DefaultServiceInterface, Report } from '../client/src/app/core/modules/openapi';
	
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
			this.service.getReportsReportsGet()
				.subscribe({
					next: (response)=>{
						console.debug(`Received ${response.length} reports from server`)
						this.reports$.set(response)
					}
				})
		}
		
	}
