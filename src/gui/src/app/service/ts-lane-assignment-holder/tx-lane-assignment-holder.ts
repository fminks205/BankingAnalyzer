import { Injectable } from '@angular/core';
import { DefaultService, LaneEntryAssignment } from '../../client/openapi';

export interface TxLaneAssignmentKey{
	year:number,
	month:number,
	entryId:number,
} 

@Injectable({
	providedIn: 'root'
})
export class TxLaneAssignmentHolder {
	private readonly keyDelimter: string = "x"
	private laneAssignments: Map<string, number> = new Map();

	constructor(private client: DefaultService){}

	// TxLaneAssignmentKey -> "12x34x56"
	toKeyStr(key: TxLaneAssignmentKey){
		return `${key.year}${this.keyDelimter}${key.month}${this.keyDelimter}${key.entryId}`
	}

	// "12x34x56" -> TxLaneAssignmentKey
	keyToYearMonthEntryId(keyStr: string): TxLaneAssignmentKey{
		let tuple = keyStr
			.split(this.keyDelimter)
			.map(Number);
		return {
			year: tuple[0],
			month: tuple[1],
			entryId: tuple[2]
		}
	}

	setAssignment(key: TxLaneAssignmentKey, laneId:number){
		const keyStr = this.toKeyStr(key)
		this.laneAssignments.set(keyStr, laneId)
		return this
	}

	deleteAssignment(key: TxLaneAssignmentKey){
		this.laneAssignments.delete(this.toKeyStr(key))
	}

	getLane(key: TxLaneAssignmentKey){
		const keyStr = this.toKeyStr(key)
		return this.laneAssignments.get(keyStr)
	}

	saveToCsv(){
		let allAssignments = this.getAll()
		console.log(JSON.stringify(allAssignments))
		this.client.postLaneEntryAssignments(allAssignments)
			.subscribe({
				next: (response)=>{
					console.debug(`Received ${response.length} assignments from server as a POST response`)
				}
			})
	}

	getAll(){
		let assignments: LaneEntryAssignment[] = []
		let entries = this.laneAssignments
			.entries()
		for(let entry of entries){
			let key = this.keyToYearMonthEntryId(entry[0])
			assignments.push({
				year: key.year,
				month: key.month,
				entry: key.entryId,
				lane: entry[1]
			})
		}
		return assignments
	}
}
