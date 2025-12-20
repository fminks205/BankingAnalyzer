import { Injectable } from '@angular/core';
import { TxLaneAssignmentKey } from './tx-lane-assignment-holder';

@Injectable({
  providedIn: 'root'
})
export class AssignmentKeyManager {
  	private readonly keyDelimter: string = "x"
    
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
}
