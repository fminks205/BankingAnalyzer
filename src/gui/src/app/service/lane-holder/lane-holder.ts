import { Injectable, signal, WritableSignal } from '@angular/core';
import { DefaultService, Lane } from '../../client/openapi';

@Injectable({
  providedIn: 'root'
})
export class LaneHolder {
    lanes$: WritableSignal<Lane[]> = signal([])

		constructor(
			private service: DefaultService
		) {
			this.fireRequest()
		}

		fireRequest(): void {
			console.debug(`Requesting lanes from server`)
			this.service.getLanes()
				.subscribe({
					next: (response)=>{
						console.debug(`Received ${response.length} lanes from server`)
						this.lanes$.set(response)
					}
				})
		}
}
