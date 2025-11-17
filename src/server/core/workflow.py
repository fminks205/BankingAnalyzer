from fastapi import UploadFile
from core.Persistence import Persistence
from domain.Entry import Entry
from domain.Report import Report
from filesystem.PdfFileHandler import PdfFileHandler
from parsers.sparkasse.kontoauszug_schema2025.SKA2025parser import SKA2025parser


class Workflow:
	def __init__(self, persistence: Persistence):
		self.persistence = persistence
		self.pdf_handler = PdfFileHandler()
		self.parser = SKA2025parser()

	async def save_report_pdf(self,reportPdfs: list[UploadFile]):
		for file in reportPdfs:
			await self.pdf_handler.save_report_pdf(file)
	
	def rebuild_csv_files(self):
		src_pdfs = self.pdf_handler.find_pdf_files()
		for src_pdf in src_pdfs:
			text_pages = self.pdf_handler.read_pdf(src_pdf)

			month, year = self.parser.extract_date(text_pages[0])

			entries: list[Entry] = []
			for page_text in text_pages:
				raw_entries = self.parser.extract_raw_entries_from_page_text(page_text)
				for raw_entry in raw_entries:
					entry = self.parser.entryRawText_to_entry(raw_entry)
					entries.append(entry)
			for i, entry in enumerate(entries):
				entry.id = i

			report = Report(
				year=year, 
				month=month, 
				entries=entries
			)

			self.persistence.save_report_for_src_pdf(src_pdf, report)