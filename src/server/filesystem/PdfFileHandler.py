import os
from typing import List

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

	def read_pdf(self, pdf_path):
		pages_text = []
		with pdfplumber.open(pdf_path) as pdf:
			for page in pdf.pages:
				pages_text.append(page.extract_text())
		return pages_text