import os
from typing import List

import pdfplumber


def find_pdf_files(directory: str) -> List[str]:
	result = []
	for root, _, files in os.walk(directory):
		for file in files:
			if file.lower().endswith('.pdf'):
				result.append(os.path.join(root, file))
	return result

def read_pdf(pdf_path):
	pages_text = []
	with pdfplumber.open(pdf_path) as pdf:
		for page in pdf.pages:
			pages_text.append(page.extract_text())
	return pages_text