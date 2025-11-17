import { Injectable } from '@angular/core';
import { DefaultService } from '../../client/openapi';

@Injectable({
  providedIn: 'root'
})
export class Workflow {
  constructor(
    private client: DefaultService
  ){}

  uploadFiles(files: File[]){
    return this.client.postReportFiles(files)
  }

  parseReports(){
    this.client.rebuildCsv()
      .subscribe({
        next:()=>{
          console.info("Sucessfully parsed reports to csv")
        },
        error: (err)=>{
          console.info(`Parsing reports to csv failed: ${JSON.stringify(err)}`)
        }
      })
  }
}
