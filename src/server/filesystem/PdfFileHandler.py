import os
from typing import List

from fastapi import UploadFile
import pdfplumber

from config.FilePathsConfig import FilePathsConfig

class PdfFileHandler:
	def __init__(self):
		self.file_paths_config: FilePathsConfig = FilePathsConfig()

	def find_pdf_files(self) -> List[str]:
		directory = self.file_paths_config.get_kontoauszug_pdfs_root_dir_relative()
		result = []
		for root, _, files in os.walk(directory):
			for file in files:
				if file.lower().endswith('.pdf'):
					result.append(os.path.join(root, file))
		return result
	
	async def save_report_pdf(self, reportPdf: UploadFile):
		dest = os.path.join(
			self.file_paths_config.get_kontoauszug_pdfs_root_dir_relative(),
			reportPdf.filename
		)

		os.makedirs(os.path.dirname(dest), exist_ok=True)

		data = await reportPdf.read()

		with open(dest, "wb") as out:
			out.write(data)

		return dest

	def read_pdf(self, pdf_path):
		pages_text = []
		with pdfplumber.open(pdf_path) as pdf:
			for page in pdf.pages:
				pages_text.append(page.extract_text())
		return pages_text