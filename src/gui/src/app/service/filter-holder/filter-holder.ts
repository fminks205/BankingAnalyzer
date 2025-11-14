import { Injectable, signal, WritableSignal } from '@angular/core';
import { DefaultService, Filter } from '../../client/openapi';

@Injectable({
  providedIn: 'root'
})
export class FilterHolder {
  filters$: WritableSignal<Filter[]> = signal([])

  constructor(
    private client: DefaultService
  ){
  }

  loadFromServer(){
    console.debug(`Requesting filters from server`)
		this.client.getFilter()
			.subscribe({
				next: (response)=>{
					console.debug(`Received ${response.length} reports from server`)
					this.filters$.set(response)
				}
			})
  }

  save(){
    this.client.postFilter(this.filters$())
			.subscribe({
				next: (response)=>{
					console.debug(`Received ${response.length} filters from server as a POST response`)
					this.filters$.set(response)
				}
			})
  }

  addFilter(filter: Filter){
    this.filters$.set([filter, ...this.filters$()])
    console.debug(`Added filter, new amount: ${this.filters$().length}`)
  }

  removeFilter(i: number){
    this.filters$.set([
        ...this.filters$().slice(0, i),
        ...this.filters$().slice(i + 1),
    ])
  }
}
