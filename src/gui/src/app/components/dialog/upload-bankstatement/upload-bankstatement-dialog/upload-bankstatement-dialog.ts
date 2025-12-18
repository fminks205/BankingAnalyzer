import { Component, effect, model, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { FileUpload } from "primeng/fileupload";
import { ButtonModule } from "primeng/button";
import { DecimalPipe } from '@angular/common';
import { TxLaneAssignmentHolder } from '../../../../service/ts-lane-assignment-holder/tx-lane-assignment-holder';

@Component({
  selector: 'app-upload-bankstatement-dialog',
  imports: [Dialog, FileUpload, ButtonModule, DecimalPipe],
  templateUrl: './upload-bankstatement-dialog.html',
  styleUrl: './upload-bankstatement-dialog.scss'
})
export class UploadBankstatementDialog implements OnInit{
	visible = model<boolean>()

	@ViewChild('pdfUpload') 
	pdfUpload!: FileUpload;
	
	fileNamesSavedInServer: WritableSignal<string[]> = signal([])

	// This is a workaround as the dialogs (onHide) method causes issues when using a "visible" signal
	visibleNeverUndefined: boolean = false

	constructor(
		private assignmentsHolder: TxLaneAssignmentHolder
	){
		effect(()=>{
			let visibleInput = this.visible()
			this.visibleNeverUndefined = (visibleInput == true)
		})
	}

	ngOnInit(): void {
		this.loadFilesNamesSavedInServer()
	}
	
  	onPdfUpload(event: any) {
		const files: File[] = event.files;

		this.assignmentsHolder.uploadFiles(files)
			.subscribe({
				next: ()=>{
					this.pdfUpload.clear()
					console.log("Done uploading pdfs")
					this.loadFilesNamesSavedInServer()
				}
			})
	}

	loadFilesNamesSavedInServer(){
		this.assignmentsHolder.loadSavedBankStatements()
			.subscribe({
				next: (res: string[])=>{
					console.debug(`Received ${res.length} file names from server`)
					this.fileNamesSavedInServer.set(res)
				}
			})
	}
}
