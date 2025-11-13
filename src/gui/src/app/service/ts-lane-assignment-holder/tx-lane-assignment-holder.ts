import { Injectable, OnInit, signal, WritableSignal, WritableSignal as WritableSignal$ } from '@angular/core';
import { DefaultService, Lane, Report, LaneEntryAssignment } from '../../client/openapi';
import { AssignmentKeyManager } from '../assignment-key-manager/assignment-key-manager';

/**
 * All the information needed to identify a report entry
 */
export interface TxLaneAssignmentKey{
	year:number,
	month:number,
	entryId:number,
} 

@Injectable({
	providedIn: 'root'
})
export class TxLaneAssignmentHolder{

	reports$: WritableSignal<Report[]> = signal([])
	lanes$: WritableSignal<Lane[]> = signal([])
	laneAssignments$: WritableSignal$<Map<string, number>> = signal(new Map());

	constructor(
		private client: DefaultService,
		private keyHandler: AssignmentKeyManager
	){	
	}

	loadCompleteStateFromServer(){
		this.loadLanesFromServer()
		this.loadReportsFromServer()
		this.loadAssignmentsFromServer()
	}

	saveState(){
		this.saveAssignmentsToCsv()
		this.saveLanesToCsv()
	}

	setAssignment(key: TxLaneAssignmentKey, laneId:number){
		const keyStr = this.keyHandler.toKeyStr(key)
		this.laneAssignments$.update((before)=>{
			return before.set(keyStr, laneId)
		})
	}

	deleteAssignment(key: TxLaneAssignmentKey){
		this.laneAssignments$.update((before)=>{
			before.delete(this.keyHandler.toKeyStr(key))
			return before
		})
	}

	findLaneOfReportEntry(key: TxLaneAssignmentKey){
		const keyStr = this.keyHandler.toKeyStr(key)
		return this.laneAssignments$().get(keyStr)
	}

	getAllAssignmentsAsArray(){
		let assignments: LaneEntryAssignment[] = []
		let entries = this.laneAssignments$() != undefined 
			? this.laneAssignments$().entries() 
			: []
		for(let entry of entries){
			let key = this.keyHandler.keyToYearMonthEntryId(entry[0])
			assignments.push({
				year: key.year,
				month: key.month,
				entry: key.entryId,
				lane: entry[1]
			})
		}
		return assignments
	}

	getLanes(){
		return this.lanes$()
	}

	addLane(name: string, description: string){
		let lanes = this.lanes$();

		for(let lane of lanes){
			if (lane.name == name){
				console.error(`Lane name ${name} is already taken`)
				return
			}
		}

		const takenIds = lanes.map(lane => lane.id);
		let newId = 1;
		while (takenIds.includes(newId)) {
			newId++;
		}

		let newLane = {
			id: newId,
			name: name,
			description: description
		}

		this.lanes$.set([...lanes, newLane])

		console.info(`New lane pushed: ${newLane.name}`)
	}

	deleteLane(id: number){
		let filteredLanes = this.lanes$()
			.filter(lane => lane.id != id)
		if (filteredLanes.length == this.lanes$().length){
			console.error(`Tried to delete nonexistend lane ${id}`)
		}
		let newAssignmentList = this.getAllAssignmentsAsArray()
			.filter(ass => ass.lane != id)
		this.setAssignmentsFromArray(newAssignmentList)
		
		this.lanes$.set(filteredLanes)
	}

	getReports(){
		return this.reports$()
	}

	private loadReportsFromServer(): void {
		console.debug(`Requesting reports from server`)
		this.client.getReports()
			.subscribe({
				next: (response)=>{
					console.debug(`Received ${response.length} reports from server`)
					this.reports$.set(response)
				}
			})
	}
	private loadLanesFromServer(): void {
		console.debug(`Requesting lanes from server`)
		this.client.getLanes()
			.subscribe({
				next: (response)=>{
					console.debug(`Received ${response.length} lanes from server`)
					this.lanes$.set(response)
				}
			})
	}
	private loadAssignmentsFromServer(){
		console.debug("Requesting assignments from server")
		this.client
			.getLaneEntryAssignments()
				.subscribe({
					next: (response)=>{
						console.debug(`Received ${response.length} assignments from server`)
						this.setAssignmentsFromArray(
							response != undefined
								? response
								: []
						)
					}
				})
	}

	private saveAssignmentsToCsv(){
		let allAssignments = this.getAllAssignmentsAsArray()
		this.client.postLaneEntryAssignments(allAssignments)
			.subscribe({
				next: (response)=>{
					this.setAssignmentsFromArray(response)
				}
			})
	}

	private saveLanesToCsv(){
		this.client.postLanes(this.lanes$())
			.subscribe({
				next: (response)=>{
					console.debug(`Received ${response.length} lanes from server as a POST response`)
					this.lanes$.set(response)
				}
			})
	}

	private setAssignmentsFromArray(arr: LaneEntryAssignment[]){
		let newMap: Map<string, number> = new Map()
		for(const assignment of arr){
			if(assignment.lane == null) continue;
			newMap.set(
				this.keyHandler.toKeyStr({
					year: assignment.year,
					month: assignment.month,
					entryId: assignment.entry
				}),
				assignment.lane
			)
		}
		this.laneAssignments$.set(newMap)
	}
}
